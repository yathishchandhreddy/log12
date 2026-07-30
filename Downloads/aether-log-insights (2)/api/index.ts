import express from "express";
import { GoogleGenAI } from "@google/genai";
import { generateSreReport, SRE_SYSTEM_PROMPT } from "../src/lib/logAnalyzerEngine.js";

const app = express();
app.use(express.json({ limit: "10mb" }));

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
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

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Aether Log Insights Vercel Engine", timestamp: new Date().toISOString() });
});

// Sample logs
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
[2024-05-20 12:30:04] WARN  [CircuitBreaker] Circuit 'PaymentService' opened due to 15 consecutive 5xx responses.`
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

app.post("/api/analyze", async (req, res) => {
  try {
    const { logContent, filename = "system.log" } = req.body;

    if (!logContent || typeof logContent !== "string" || logContent.trim().length === 0) {
      return res.status(400).json({ error: "Log content is required for analysis." });
    }

    const fallbackResult = generateSreReport(logContent, filename);

    try {
      const ai = getGenAI();
      const userPrompt = `Analyze the following log excerpt and generate the incident report per your instructions.

Log source file: ${filename}
Timestamp range: ${fallbackResult.timestampRange.start} to ${fallbackResult.timestampRange.end}
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
        return res.json({
          ...fallbackResult,
          reportMarkdown: response.text,
          aiUsed: true,
        });
      }
    } catch (err: any) {
      console.warn("Gemini API call warning in Vercel function:", err?.message);
    }

    return res.json(fallbackResult);
  } catch (error: any) {
    console.error("Error in Vercel API analyze endpoint:", error);
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

export default app;
