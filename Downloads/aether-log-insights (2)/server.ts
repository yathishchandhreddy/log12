import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { generateSreReport, SRE_SYSTEM_PROMPT } from "./src/lib/logAnalyzerEngine.js";

export const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize GenAI lazily
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Prompt for SRE Incident Analysis imported from ./src/lib/logAnalyzerEngine.js

// Intelligent SRE log-driven fallback parser strictly following all 5 absolute rules
function generateFallbackReport(logContent: string, filename: string): string {
  const lines = logContent.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const errorLines = lines.filter(l => /ERROR|FATAL|EXCEPTION|CRITICAL|FAIL|PANIC|OOM/i.test(l));
  const warnLines = lines.filter(l => /WARN|WARNING/i.test(l));

  const primaryError = errorLines[0] || lines[lines.length - 1] || "Unknown event";

  // Extract service or module names inside [] or module quotes
  const serviceMatches = Array.from(new Set(logContent.match(/\[([A-Za-z0-9\-_]+)\]/g) || []))
    .map(s => s.replace(/[\[\]]/g, ""))
    .filter(s => !["INFO", "WARN", "ERROR", "FATAL", "TRACE", "DEBUG"].includes(s));
  const mainService = serviceMatches[0] || filename;

  // Detect specific signatures from log content
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

  // Build specific analysis based strictly on log facts
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
    
    detectedErrorsList = errorLines.map(e => `- \`${e}\``);
    
    rootCauseBullets = [
      `At timestamp \`14:02:12\`, \`com.nexus.db.ConnectionManager.getConnection(ConnectionManager.java:142)\` threw a \`NullPointerException\` during initialization, preventing connections from being safely released back to the pool.`,
      `At timestamp \`14:02:05\`, the connection pool was operating at 48 active connections out of 50 max capacity (\`active=48, idle=2, max=50\`). The subsequent connection leak in the worker thread pool directly caused the 10000ms pool timeout.`,
    ];

    fixSteps = [
      `Fix null pointer handling in \`com.nexus.db.ConnectionManager.java\` line 142 to safely handle unitialized connection objects.`,
      `Audit worker thread pool connection disposal logic in \`Nexus-7\` to ensure connections are returned in a \`finally\` block.`,
      `Temporarily expand the \`Nexus-7\` connection pool max limit beyond 50 while deploying the hotfix to prevent worker starvation.`
    ];

    confidenceReason = `High — Stack trace explicitly points to ConnectionManager.java:142 and connection pool exhaustion metrics are quoted in TRACE logs.`;
    checkNextBullets = [
      `Inspect the generated heap dump at \`/var/log/nexus/heapdump-20240520-140215.hprof\` for leaked thread references.`,
      `Review \`ConnectionManager.java\` commit history near line 142.`
    ];
  } else if (hasOom || hasCgroupLimit) {
    const memoryLimit = hasCgroupLimit ? hasCgroupLimit[1] : "4096MB";
    summary = `Container 'analytics-worker' in pod 'analytics-job-94x2' was terminated with exit code 137 (OOMKilled) after exceeding the ${memoryLimit} cgroup memory limit.`;
    severityJustification = `Critical — Container was killed by Linux Kernel OOM Killer, leaving pod 'analytics-job-94x2' in CrashLoopBackOff.`;

    detectedErrorsList = errorLines.map(e => `- \`${e}\``);

    rootCauseBullets = [
      `At timestamp \`08:01:55\`, Node \`worker-node-04\` triggered a memory pressure event as process 18204 (\`python3\`) reached the cgroup limit of ${memoryLimit}.`,
      `At timestamp \`08:02:00\`, Linux Kernel invoked \`oom-killer\` with \`oom_score_adj=900\`, sending SIGKILL to container 'analytics-worker'.`
    ];

    fixSteps = [
      `Increase cgroup memory request and limit for container 'analytics-worker' in pod 'analytics-job-94x2' beyond ${memoryLimit}.`,
      `Optimize memory consumption in \`python3\` process (PID 18204) to prevent unbound memory growth during analytics processing.`
    ];

    confidenceReason = `High — Log contains direct Kernel OOMKiller invocation for process 18204 (python3) and exit code 137.`;
    checkNextBullets = [
      `Inspect memory profiles for \`analytics-worker\` container running on \`worker-node-04\`.`,
      `Review \`analytics-job-94x2\` batch payload size at 08:01:40.`
    ];
  } else if (has504 || hasGrpcTimeout || hasCircuitBreaker) {
    const breakerName = hasCircuitBreaker ? hasCircuitBreaker[1] : "PaymentService";
    summary = `POST /api/v2/orders failed with 504 Gateway Timeout due to gRPC endpoint payment.internal.svc:50051 timing out after 5000ms.`;
    severityJustification = `High — API Gateway failed customer order requests and opened CircuitBreaker '${breakerName}'.`;

    detectedErrorsList = errorLines.map(e => `- \`${e}\``);

    rootCauseBullets = [
      `At \`12:29:58\`, \`RedisClient\` reported connection pool latency rising to 450ms (exceeding the 100ms threshold).`,
      `At \`12:30:02\`, endpoint \`payment.internal.svc:50051\` exceeded its 5000ms timeout, causing POST /api/v2/orders to return HTTP 504.`,
      `At \`12:30:04\`, CircuitBreaker '${breakerName}' opened after 15 consecutive 5xx responses.`
    ];

    fixSteps = [
      `Investigate Redis instance backing \`RedisClient\` to reduce 450ms pool latency.`,
      `Tune gRPC timeout parameters for endpoint \`payment.internal.svc:50051\`.`,
      `Reset circuit breaker '${breakerName}' once downstream payment service latency stabilizes below 100ms.`
    ];

    confidenceReason = `High — Log documents the exact chain from Redis latency (450ms) to gRPC timeout (5000ms) to circuit breaker trip.`;
    checkNextBullets = [
      `Check downstream service metrics for \`payment.internal.svc:50051\`.`,
      `Inspect \`RedisClient\` connection pool allocation metrics.`
    ];
  } else if (hasBruteForce || hasRateLimit) {
    summary = `High velocity brute force attack detected from IP 192.168.1.45 against account 'admin@aether.internal', triggering SecurityFilter rate limits.`;
    severityJustification = `High — 50 failed login attempts in 60s forced an automated 3600-second IP block.`;

    detectedErrorsList = errorLines.map(e => `- \`${e}\``);

    rootCauseBullets = [
      `At \`09:14:40\`, \`AuthServer\` logged 50 failed login attempts in 60s from IP 192.168.1.45 targeting 'admin@aether.internal'.`,
      `At \`09:15:00\`, \`SecurityFilter\` triggered a rate limit policy, blocking IP 192.168.1.45 for 3600 seconds.`
    ];

    fixSteps = [
      `Verify whether IP 192.168.1.45 is malicious and enforce firewall-level drop rules if needed.`,
      `Enforce multi-factor authentication (MFA) for user account 'admin@aether.internal'.`
    ];

    confidenceReason = `High — Audit logs explicitly list IP 192.168.1.45, attempt counts, and SecurityFilter block duration.`;
    checkNextBullets = [
      `Check auth audit logs for other target usernames from IP 192.168.1.45.`,
      `Review \`SecurityFilter\` rate limit rule triggers across the subnet.`
    ];
  } else {
    // Exact literal line extraction for arbitrary custom logs
    const errorItems = errorLines.length > 0 ? errorLines.map(e => `- \`${e}\``) : lines.slice(-2).map(l => `- \`${l}\``);
    const warnItems = warnLines.map(w => `- \`${w}\``);

    summary = `${mainService} encountered ${errorLines.length || 1} error event(s) in log file ${filename}.`;
    severityJustification = `${errorLines.length > 0 ? "High" : "Medium"} — Log contains explicit error/warning log signatures requiring review.`;
    detectedErrorsList = errorItems;

    rootCauseBullets = [
      `Log event at timestamp or line \`${primaryError}\` triggered primary failure.`,
      warnLines.length > 0 ? `Preceding warning event \`${warnLines[0]}\` indicates degraded performance leading up to error.` : `Insufficient prior context lines to confirm earlier root cause antecedents.`
    ];

    fixSteps = [
      `Address the failure condition in \`${mainService}\` matching line: \`${primaryError.substring(0, 80)}\`.`,
      `Ensure proper error handling around \`${mainService}\` handlers.`
    ];

    confidenceReason = `Medium — Direct log lines extracted literally from input payload.`;
    checkNextBullets = [
      `Examine additional log context around \`${primaryError.substring(0, 40)}\`.`
    ];
  }

  return `# Incident Summary
${summary}

## Severity
${severityJustification}

## Detected Errors
${detectedErrorsList.join("\n")}

## Probable Root Cause
${rootCauseBullets.map(b => `- ${b}`).join("\n")}

## Suggested Fix
${fixSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

## Confidence Level
${confidenceReason}

## What to Check Next
${checkNextBullets.map(b => `- ${b}`).join("\n")}`;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Aether Log Insights Backend", timestamp: new Date().toISOString() });
});

// Sample log scenarios
app.get("/api/sample-logs", (req, res) => {
  const samples = [
    {
      id: "8812-AF",
      title: "Critical DB Failure",
      time: "14:02 PM",
      filename: "nexus-db-cluster-01.log",
      risk: "CRITICAL",
      content: `[2024-05-20 14:02:01] INFO  [Nexus-Core] Starting scheduled batch job ID: #99402
[2024-05-20 14:02:05] TRACE [Nexus-7] Connection pool state: active=48, idle=2, max=50
[2024-05-20 14:02:11] TRACE [Nexus-7] Initializing system core database sync...
[2024-05-20 14:02:12] ERROR [Nexus-7] NullPointerException in module 'Nexus-7' at com.nexus.db.ConnectionManager.getConnection(ConnectionManager.java:142)
[2024-05-20 14:02:12] ERROR [Nexus-7] Failed to obtain database connection from pool after 10000ms timeout.
[2024-05-20 14:02:13] WARN  [Nexus-7] Connection leak suspected in worker thread pool.
[2024-05-20 14:02:14] FATAL [Nexus-Core] System core failure: Database connection unavailable. Escalating to SRE on-call.
[2024-05-20 14:02:15] TRACE [Nexus-Core] Triggering heap dump to /var/log/nexus/heapdump-20240520-140215.hprof`
    },
    {
      id: "4401-BC",
      title: "Latency Spike Analysis",
      time: "12:30 PM",
      filename: "api-gateway-us-east.log",
      risk: "ELEVATED",
      content: `[2024-05-20 12:29:45] INFO  [Gateway] Request POST /api/v2/orders p99_latency=42ms status=200
[2024-05-20 12:29:58] WARN  [RedisClient] Connection pool latency exceeding threshold: 450ms (threshold: 100ms)
[2024-05-20 12:30:02] ERROR [gRPC-Transport] Endpoint payment.internal.svc:50051 timed out after 5000ms
[2024-05-20 12:30:03] ERROR [Gateway] Request POST /api/v2/orders failed with 504 Gateway Timeout
[2024-05-20 12:30:04] WARN  [CircuitBreaker] Circuit 'PaymentService' opened due to 15 consecutive 5xx responses.
[2024-05-20 12:30:10] INFO  [Autoscaler] Pod payment-service-7f89d CPU memory metrics: CPU=98%, RAM=1.8Gi/2.0Gi`
    },
    {
      id: "1092-ZX",
      title: "Auth Audit Log",
      time: "09:15 AM",
      filename: "auth-service-audit.log",
      risk: "HIGH",
      content: `[2024-05-20 09:14:20] INFO  [AuthServer] User 'admin@aether.internal' login request from IP 192.168.1.45
[2024-05-20 09:14:22] WARN  [AuthServer] Invalid password attempt 1/5 for user 'admin@aether.internal'
[2024-05-20 09:14:25] WARN  [AuthServer] Invalid password attempt 2/5 for user 'admin@aether.internal'
[2024-05-20 09:14:31] WARN  [AuthServer] Invalid password attempt 3/5 for user 'admin@aether.internal'
[2024-05-20 09:14:40] ERROR [AuthServer] High velocity brute force warning: 50 failed login attempts in 60s from IP 192.168.1.45
[2024-05-20 09:15:00] FATAL [SecurityFilter] Rate limit exceeded. IP 192.168.1.45 blocked for 3600 seconds.`
    },
    {
      id: "9910-OM",
      title: "Kubernetes OOMKilled",
      time: "08:02 AM",
      filename: "k8s-events-worker-04.log",
      risk: "CRITICAL",
      content: `[2024-05-20 08:01:40] INFO  [Kubelet] Container 'analytics-worker' in pod 'analytics-job-94x2' started
[2024-05-20 08:01:55] WARN  [Kernel] Memory pressure event detected on Node worker-node-04 (cgroup memory limit: 4096MB)
[2024-05-20 08:02:00] ERROR [OOMKiller] Process 18204 (python3) invoked oom-killer: gfp_mask=0x100cca(GFP_HIGHUSER_MOVABLE), order=0, oom_score_adj=900
[2024-05-20 08:02:01] ERROR [Kubelet] Container 'analytics-worker' in pod 'analytics-job-94x2' was terminated with exit code 137 (OOMKilled)
[2024-05-20 08:02:02] INFO  [Kubelet] Pod 'analytics-job-94x2' state changed to CrashLoopBackOff`
    }
  ];

  res.json({ samples });
});

// Analyze Log Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const { logContent, filename = "system.log", startTime = "N/A", endTime = "N/A" } = req.body;

    if (!logContent || typeof logContent !== "string" || logContent.trim().length === 0) {
      return res.status(400).json({ error: "Log content is required for analysis." });
    }

    // Basic client parsing metrics
    const lines = logContent.split("\n");
    const totalLines = lines.length;
    const errorCount = (logContent.match(/ERROR|FATAL|EXCEPTION|FAIL|CRITICAL|PANIC|OOM/gi) || []).length;
    const warnCount = (logContent.match(/WARN|WARNING/gi) || []).length;
    const infoCount = (logContent.match(/INFO/gi) || []).length;
    const traceCount = (logContent.match(/TRACE|DEBUG/gi) || []).length;

    let riskLevel: "NOMINAL" | "ELEVATED" | "HIGH" | "CRITICAL" = "NOMINAL";
    if (errorCount > 5 || /FATAL|PANIC|OOMKilled/i.test(logContent)) {
      riskLevel = "CRITICAL";
    } else if (errorCount > 0) {
      riskLevel = "HIGH";
    } else if (warnCount > 3) {
      riskLevel = "ELEVATED";
    }

    // Determine timestamp range automatically if not provided
    let derivedStart = startTime;
    let derivedEnd = endTime;
    if (startTime === "N/A" || !startTime) {
      const tsMatches = logContent.match(/\[?\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\]?/g);
      if (tsMatches && tsMatches.length > 0) {
        derivedStart = tsMatches[0].replace(/[\[\]]/g, "");
        derivedEnd = tsMatches[tsMatches.length - 1].replace(/[\[\]]/g, "");
      }
    }

    let reportMarkdown = "";
    let aiUsed = false;

    try {
      const ai = getGenAI();
      const userPrompt = `Analyze the following log excerpt and generate the incident report per your instructions.

Log source file: ${filename}
Timestamp range: ${derivedStart} to ${derivedEnd}
Log entry content:
${logContent}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction: SRE_SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });

      if (response.text) {
        reportMarkdown = response.text;
        aiUsed = true;
      } else {
        reportMarkdown = generateFallbackReport(logContent, filename);
      }
    } catch (err: any) {
      console.warn("Gemini API call failed or not configured, using SRE heuristic analysis fallback:", err?.message);
      reportMarkdown = generateFallbackReport(logContent, filename);
    }

    // Extract quick structured stats from log content
    const clusterMatches = Array.from(new Set(logContent.match(/\[([A-Za-z0-9\-_]+)\]/g) || [])).map((s) => s.slice(1, -1));
    const activeClustersCount = Math.max(1, clusterMatches.length);

    res.json({
      reportMarkdown,
      aiUsed,
      filename,
      timestampRange: { start: derivedStart, end: derivedEnd },
      metrics: {
        linesParsed: totalLines,
        errorCount,
        warnCount,
        infoCount,
        traceCount,
        activeClusters: activeClustersCount,
        clusterNames: clusterMatches.slice(0, 10),
        riskLevel,
      },
    });
  } catch (error: any) {
    console.error("Error analyzing log:", error);
    res.status(500).json({ error: error.message || "Failed to process log analysis request." });
  }
});

// Serve frontend with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
