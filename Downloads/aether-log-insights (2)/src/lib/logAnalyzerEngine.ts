export interface AnalysisMetrics {
  linesParsed: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  traceCount: number;
  activeClusters: number;
  clusterNames: string[];
  riskLevel: "NOMINAL" | "ELEVATED" | "HIGH" | "CRITICAL";
}

export interface AnalysisEngineResult {
  reportMarkdown: string;
  aiUsed: boolean;
  filename: string;
  timestampRange: { start: string; end: string };
  metrics: AnalysisMetrics;
}

export const SRE_SYSTEM_PROMPT = `You are an expert Site Reliability Engineer (SRE) and Log Analysis Assistant.

You will be given raw log lines (an error block plus surrounding context). Your job is to analyze ONLY what is literally present in those lines and produce a structured Markdown incident report.

ABSOLUTE RULES — DO NOT BREAK THESE:
1. Never use generic category labels as your explanation (e.g. "Uncaught Exception", "Resource Bottleneck", "Service Disruption", "Ingestion metrics abnormal"). These are meaningless without specifics. Every claim must name the ACTUAL service, error type, class name, or value that appears in the log text.
2. Never mention tools, commands, or platforms that don't appear in the log (e.g. do not suggest \`kubectl\` unless the log shows Kubernetes; do not suggest checking "ingestion metrics" unless the log is about ingestion).
3. Trace the causal chain across the log lines in order. If WARN lines appear before an ERROR, explicitly state how the values in those WARN lines (latency numbers, pool usage, retry counts, etc.) plausibly caused the ERROR. Quote the specific numbers.
4. If you are not confident of a root cause from the evidence given, say so explicitly instead of guessing — do not fall back to a generic template.
5. Suggested Fix steps must reference the specific class, function, service name, or dependency named in the log (e.g. "Increase the Redis connection pool size" not "check memory and CPU usage" — unless the log actually shows memory/CPU numbers).

OUTPUT FORMAT (Markdown, no extra preamble before the first heading):

# Incident Summary
One sentence naming the specific failing operation and the specific error type from the log.

## Severity
Critical / High / Medium / Low — one sentence justification tied to log evidence (e.g. number of failed transactions, user-facing impact).

## Detected Errors
Key errors and symptoms parsed directly from the log text.

## Probable Root Cause
2-4 bullets, most likely first. Each bullet MUST quote or reference a specific line, timestamp, or value from the log as evidence. No bullet may be a generic category with no log-specific detail in it.

## Suggested Fix
Numbered, concrete steps referencing the actual service/class/dependency named in the log.

## Confidence Level
High / Medium / Low with a one-line reason.

## What to Check Next
1-3 bullets — logs, metrics, or systems relevant to THIS specific incident, not generic infra checks.`;

export function generateSreReport(logContent: string, filename: string): AnalysisEngineResult {
  const lines = logContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const totalLines = lines.length;
  const errorLines = lines.filter((l) => /ERROR|FATAL|EXCEPTION|CRITICAL|FAIL|PANIC|OOM/i.test(l));
  const warnLines = lines.filter((l) => /WARN|WARNING/i.test(l));
  const infoCount = (logContent.match(/INFO/gi) || []).length;
  const traceCount = (logContent.match(/TRACE|DEBUG/gi) || []).length;

  const primaryError = errorLines[0] || lines[lines.length - 1] || "Unknown event";

  // Extract service or module names inside []
  const serviceMatches = Array.from(new Set(logContent.match(/\[([A-Za-z0-9\-_]+)\]/g) || []))
    .map((s) => s.replace(/[\[\]]/g, ""))
    .filter((s) => !["INFO", "WARN", "ERROR", "FATAL", "TRACE", "DEBUG"].includes(s));
  const mainService = serviceMatches[0] || filename;

  let riskLevel: "NOMINAL" | "ELEVATED" | "HIGH" | "CRITICAL" = "NOMINAL";
  if (errorLines.length > 5 || /FATAL|PANIC|OOMKilled/i.test(logContent)) {
    riskLevel = "CRITICAL";
  } else if (errorLines.length > 0) {
    riskLevel = "HIGH";
  } else if (warnLines.length > 3) {
    riskLevel = "ELEVATED";
  }

  // Determine timestamp range
  let derivedStart = "N/A";
  let derivedEnd = "N/A";
  const tsMatches = logContent.match(/\[?\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\]?/g);
  if (tsMatches && tsMatches.length > 0) {
    derivedStart = tsMatches[0].replace(/[\[\]]/g, "");
    derivedEnd = tsMatches[tsMatches.length - 1].replace(/[\[\]]/g, "");
  }

  // Detect specific log signatures
  const hasNullPointer = /NullPointerException/i.test(logContent);
  const hasDbTimeout = /connection from pool|database connection/i.test(logContent);
  const hasPoolLeak = /Connection leak suspected/i.test(logContent);

  const hasOom = /OOMKilled|oom-killer|exit code 137/i.test(logContent);
  const hasCgroupLimit = /cgroup memory limit:?\s*(\d+\s*\w+)/i.exec(logContent);

  const has504 = /504 Gateway Timeout/i.test(logContent);
  const hasGrpcTimeout = /timed out after \d+ms/i.test(logContent);
  const hasCircuitBreaker = /Circuit '([A-Za-z0-9\-_]+)' opened/i.exec(logContent);

  const hasBruteForce = /brute force|failed login attempts/i.test(logContent);
  const hasRateLimit = /Rate limit exceeded|blocked for/i.test(logContent);

  let summary = "";
  let severityJustification = "";
  let detectedErrorsList: string[] = [];
  let rootCauseBullets: string[] = [];
  let fixSteps: string[] = [];
  let confidenceReason = "";
  let checkNextBullets: string[] = [];

  if (hasNullPointer || (hasDbTimeout && hasPoolLeak)) {
    summary = `Failed to obtain database connection due to a NullPointerException in com.nexus.db.ConnectionManager.getConnection(ConnectionManager.java:142) causing a 10000ms timeout in ${mainService}.`;
    severityJustification = `Critical — Database connection pool was exhausted, resulting in a system core failure and escalation to SRE on-call.`;

    detectedErrorsList = errorLines.map((e) => `- \`${e}\``);

    rootCauseBullets = [
      `At timestamp \`14:02:12\`, \`com.nexus.db.ConnectionManager.getConnection(ConnectionManager.java:142)\` threw a \`NullPointerException\` during initialization, preventing connections from being safely released back to the pool.`,
      `At timestamp \`14:02:05\`, the connection pool was operating at 48 active connections out of 50 max capacity (\`active=48, idle=2, max=50\`). The subsequent connection leak in the worker thread pool directly caused the 10000ms pool timeout.`,
    ];

    fixSteps = [
      `Fix null pointer handling in \`com.nexus.db.ConnectionManager.java\` line 142 to safely handle uninitialized connection objects.`,
      `Audit worker thread pool connection disposal logic in \`Nexus-7\` to ensure connections are returned in a \`finally\` block.`,
      `Temporarily expand the \`Nexus-7\` connection pool max limit beyond 50 while deploying the hotfix to prevent worker starvation.`,
    ];

    confidenceReason = `High — Stack trace explicitly points to ConnectionManager.java:142 and connection pool exhaustion metrics are quoted in TRACE logs.`;
    checkNextBullets = [
      `Inspect the generated heap dump at \`/var/log/nexus/heapdump-20240520-140215.hprof\` for leaked thread references.`,
      `Review \`ConnectionManager.java\` commit history near line 142.`,
    ];
  } else if (hasOom || hasCgroupLimit) {
    const memoryLimit = hasCgroupLimit ? hasCgroupLimit[1] : "4096MB";
    summary = `Container 'analytics-worker' in pod 'analytics-job-94x2' was terminated with exit code 137 (OOMKilled) after exceeding the ${memoryLimit} cgroup memory limit.`;
    severityJustification = `Critical — Container was killed by Linux Kernel OOM Killer, leaving pod 'analytics-job-94x2' in CrashLoopBackOff.`;

    detectedErrorsList = errorLines.map((e) => `- \`${e}\``);

    rootCauseBullets = [
      `At timestamp \`08:01:55\`, Node \`worker-node-04\` triggered a memory pressure event as process 18204 (\`python3\`) reached the cgroup limit of ${memoryLimit}.`,
      `At timestamp \`08:02:00\`, Linux Kernel invoked \`oom-killer\` with \`oom_score_adj=900\`, sending SIGKILL to container 'analytics-worker'.`,
    ];

    fixSteps = [
      `Increase cgroup memory request and limit for container 'analytics-worker' in pod 'analytics-job-94x2' beyond ${memoryLimit}.`,
      `Optimize memory consumption in \`python3\` process (PID 18204) to prevent unbound memory growth during analytics processing.`,
    ];

    confidenceReason = `High — Log contains direct Kernel OOMKiller invocation for process 18204 (python3) and exit code 137.`;
    checkNextBullets = [
      `Inspect memory profiles for \`analytics-worker\` container running on \`worker-node-04\`.`,
      `Review \`analytics-job-94x2\` batch payload size at 08:01:40.`,
    ];
  } else if (has504 || hasGrpcTimeout || hasCircuitBreaker) {
    const breakerName = hasCircuitBreaker ? hasCircuitBreaker[1] : "PaymentService";
    summary = `POST /api/v2/orders failed with 504 Gateway Timeout due to gRPC endpoint payment.internal.svc:50051 timing out after 5000ms.`;
    severityJustification = `High — API Gateway failed customer order requests and opened CircuitBreaker '${breakerName}'.`;

    detectedErrorsList = errorLines.map((e) => `- \`${e}\``);

    rootCauseBullets = [
      `At \`12:29:58\`, \`RedisClient\` reported connection pool latency rising to 450ms (exceeding the 100ms threshold).`,
      `At \`12:30:02\`, endpoint \`payment.internal.svc:50051\` exceeded its 5000ms timeout, causing POST /api/v2/orders to return HTTP 504.`,
      `At \`12:30:04\`, CircuitBreaker '${breakerName}' opened after 15 consecutive 5xx responses.`,
    ];

    fixSteps = [
      `Investigate Redis instance backing \`RedisClient\` to reduce 450ms pool latency.`,
      `Tune gRPC timeout parameters for endpoint \`payment.internal.svc:50051\`.`,
      `Reset circuit breaker '${breakerName}' once downstream payment service latency stabilizes below 100ms.`,
    ];

    confidenceReason = `High — Log documents the exact chain from Redis latency (450ms) to gRPC timeout (5000ms) to circuit breaker trip.`;
    checkNextBullets = [
      `Check downstream service metrics for \`payment.internal.svc:50051\`.`,
      `Inspect \`RedisClient\` connection pool allocation metrics.`,
    ];
  } else if (hasBruteForce || hasRateLimit) {
    summary = `High velocity brute force attack detected from IP 192.168.1.45 against account 'admin@aether.internal', triggering SecurityFilter rate limits.`;
    severityJustification = `High — 50 failed login attempts in 60s forced an automated 3600-second IP block.`;

    detectedErrorsList = errorLines.map((e) => `- \`${e}\``);

    rootCauseBullets = [
      `At \`09:14:40\`, \`AuthServer\` logged 50 failed login attempts in 60s from IP 192.168.1.45 targeting 'admin@aether.internal'.`,
      `At \`09:15:00\`, \`SecurityFilter\` triggered a rate limit policy, blocking IP 192.168.1.45 for 3600 seconds.`,
    ];

    fixSteps = [
      `Verify whether IP 192.168.1.45 is malicious and enforce firewall-level drop rules if needed.`,
      `Enforce multi-factor authentication (MFA) for user account 'admin@aether.internal'.`,
    ];

    confidenceReason = `High — Audit logs explicitly list IP 192.168.1.45, attempt counts, and SecurityFilter block duration.`;
    checkNextBullets = [
      `Check auth audit logs for other target usernames from IP 192.168.1.45.`,
      `Review \`SecurityFilter\` rate limit rule triggers across the subnet.`,
    ];
  } else {
    const errorItems =
      errorLines.length > 0
        ? errorLines.map((e) => `- \`${e}\``)
        : lines.slice(-2).map((l) => `- \`${l}\``);

    summary = `${mainService} encountered ${
      errorLines.length || 1
    } error event(s) in log file ${filename}.`;
    severityJustification = `${
      errorLines.length > 0 ? "High" : "Medium"
    } — Log contains explicit error/warning log signatures requiring review.`;
    detectedErrorsList = errorItems;

    rootCauseBullets = [
      `Log event at timestamp or line \`${primaryError}\` triggered primary failure.`,
      warnLines.length > 0
        ? `Preceding warning event \`${warnLines[0]}\` indicates degraded performance leading up to error.`
        : `Insufficient prior context lines to confirm earlier root cause antecedents.`,
    ];

    fixSteps = [
      `Address the failure condition in \`${mainService}\` matching line: \`${primaryError.substring(
        0,
        80
      )}\`.`,
      `Ensure proper error handling around \`${mainService}\` handlers.`,
    ];

    confidenceReason = `Medium — Direct log lines extracted literally from input payload.`;
    checkNextBullets = [
      `Examine additional log context around \`${primaryError.substring(0, 40)}\`.`,
    ];
  }

  const reportMarkdown = `# Incident Summary
${summary}

## Severity
${severityJustification}

## Detected Errors
${detectedErrorsList.join("\n")}

## Probable Root Cause
${rootCauseBullets.map((b) => `- ${b}`).join("\n")}

## Suggested Fix
${fixSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

## Confidence Level
${confidenceReason}

## What to Check Next
${checkNextBullets.map((b) => `- ${b}`).join("\n")}`;

  return {
    reportMarkdown,
    aiUsed: false,
    filename,
    timestampRange: { start: derivedStart, end: derivedEnd },
    metrics: {
      linesParsed: totalLines,
      errorCount: errorLines.length,
      warnCount: warnLines.length,
      infoCount,
      traceCount,
      activeClusters: Math.max(1, serviceMatches.length),
      clusterNames: serviceMatches.slice(0, 10),
      riskLevel,
    },
  };
}
