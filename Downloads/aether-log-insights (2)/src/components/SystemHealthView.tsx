import React, { useState } from "react";
import { RecentSession } from "../types";
import { Play, RotateCcw, ShieldAlert, Cpu, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

interface SystemHealthViewProps {
  onLoadScenarioToTerminal: (content: string, filename: string) => void;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({
  onLoadScenarioToTerminal,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>("db");

  const scenarios = [
    {
      id: "db",
      title: "NullPointer in Database Connection Manager",
      service: "Nexus-7 DB Engine",
      filename: "nexus-db-cluster-01.log",
      severity: "CRITICAL",
      description: "Connection pool exhaustion triggered by null pointer exception in worker pool initialization.",
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
      id: "oom",
      title: "Kubernetes OOMKilled Container",
      service: "k8s-worker-node-04",
      filename: "k8s-oom-event.log",
      severity: "CRITICAL",
      description: "Analytics pod exceeded 4096MB memory threshold and was terminated by Kernel cgroup OOM Killer.",
      content: `[2024-05-20 08:01:40] INFO  [Kubelet] Container 'analytics-worker' in pod 'analytics-job-94x2' started
[2024-05-20 08:01:55] WARN  [Kernel] Memory pressure event detected on Node worker-node-04 (cgroup memory limit: 4096MB)
[2024-05-20 08:02:00] ERROR [OOMKiller] Process 18204 (python3) invoked oom-killer: gfp_mask=0x100cca(GFP_HIGHUSER_MOVABLE), order=0, oom_score_adj=900
[2024-05-20 08:02:01] ERROR [Kubelet] Container 'analytics-worker' in pod 'analytics-job-94x2' was terminated with exit code 137 (OOMKilled)
[2024-05-20 08:02:02] INFO  [Kubelet] Pod 'analytics-job-94x2' state changed to CrashLoopBackOff`
    },
    {
      id: "grpc",
      title: "504 Gateway Timeout & gRPC Drop",
      service: "API Gateway US-East",
      filename: "api-gateway-timeout.log",
      severity: "ELEVATED",
      description: "Downstream payment microservice connection timed out causing circuit breaker tripping.",
      content: `[2024-05-20 12:29:45] INFO  [Gateway] Request POST /api/v2/orders p99_latency=42ms status=200
[2024-05-20 12:29:58] WARN  [RedisClient] Connection pool latency exceeding threshold: 450ms (threshold: 100ms)
[2024-05-20 12:30:02] ERROR [gRPC-Transport] Endpoint payment.internal.svc:50051 timed out after 5000ms
[2024-05-20 12:30:03] ERROR [Gateway] Request POST /api/v2/orders failed with 504 Gateway Timeout
[2024-05-20 12:30:04] WARN  [CircuitBreaker] Circuit 'PaymentService' opened due to 15 consecutive 5xx responses.`
    }
  ];

  const current = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-20 flex flex-col items-center">
      <div className="w-full mb-8">
        <span className="font-body text-xs font-semibold text-[#adc6ff] tracking-[0.4em] uppercase block mb-1">
          SIMULATOR & DIAGNOSTICS
        </span>
        <h2 className="font-headline text-4xl md:text-5xl text-white font-light">
          System Health & Log Simulator
        </h2>
        <p className="text-sm text-[#c1c6d7] mt-2 max-w-2xl">
          Test the Aether Log Insights SRE engine with simulated incident logs or inspect system diagnostic checks.
        </p>
      </div>

      <div className="w-full grid grid-cols-12 gap-8">
        {/* Scenario Selection Cards (5 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <h3 className="font-headline text-xl text-white mb-2">Simulated Incident Scenarios</h3>
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenario;
            return (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                className={`glass-panel rounded-xl p-5 border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-[#adc6ff] bg-[#adc6ff]/10 shadow-[0_0_20px_rgba(173,198,255,0.2)]"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-code text-[#68d3ff]">{scenario.service}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-code font-bold uppercase ${
                      scenario.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {scenario.severity}
                  </span>
                </div>
                <h4 className="font-body text-base text-white font-medium mb-1">{scenario.title}</h4>
                <p className="text-xs text-[#8b90a0] leading-relaxed">{scenario.description}</p>
              </div>
            );
          })}
        </div>

        {/* Scenario Preview & Inject Button (7 cols) */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-body font-semibold text-[#adc6ff] uppercase tracking-wider block">
                  SCENARIO PREVIEW
                </span>
                <h3 className="font-headline text-2xl text-white">{current.title}</h3>
              </div>
              <span className="text-xs font-code text-[#8b90a0]">{current.filename}</span>
            </div>

            <div className="bg-[#060e20] border border-white/5 rounded-xl p-5 font-code text-xs text-[#adc6ff] h-[280px] overflow-y-auto leading-relaxed">
              <pre>{current.content}</pre>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onLoadScenarioToTerminal(current.content, current.filename)}
              className="ai-glow-button px-8 py-4 bg-[#adc6ff] text-[#002e69] font-body text-xs font-bold rounded-full flex items-center gap-3 tracking-widest uppercase cursor-pointer hover:bg-white shadow-[0_0_20px_rgba(173,198,255,0.3)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>LOAD SCENARIO TO LOG EXPLORER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
