import React from "react";
import { RecentSession } from "../types";
import { Activity, ShieldAlert, Cpu, Server, CheckCircle, AlertTriangle, Zap, ArrowUpRight } from "lucide-react";

interface DashboardViewProps {
  recentSessions: RecentSession[];
  onSelectSession: (session: RecentSession) => void;
  onNavigateExplorer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recentSessions,
  onSelectSession,
  onNavigateExplorer,
}) => {
  const systemClusters = [
    { name: "Nexus-7 DB Cluster", status: "DEGRADED", errors: 14, latency: "420ms", nodeCount: 6 },
    { name: "API Gateway East", status: "HEALTHY", errors: 0, latency: "18ms", nodeCount: 12 },
    { name: "Payment Service gRPC", status: "WARNING", errors: 3, latency: "145ms", nodeCount: 4 },
    { name: "Auth Service Pods", status: "HEALTHY", errors: 0, latency: "22ms", nodeCount: 8 },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-20 flex flex-col items-center">
      {/* Title */}
      <div className="w-full mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-body text-xs font-semibold text-[#adc6ff] tracking-[0.4em] uppercase block mb-1">
            TELEMETRY & CLUSTERS
          </span>
          <h2 className="font-headline text-4xl md:text-5xl text-white font-light">
            System Operations Overview
          </h2>
        </div>

        <button
          onClick={onNavigateExplorer}
          className="px-6 py-3 bg-[#adc6ff] text-[#002e69] font-body text-xs font-bold rounded-full uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(173,198,255,0.3)] self-start md:self-auto"
        >
          Open Log Explorer →
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-body font-semibold text-[#8b90a0] tracking-widest uppercase">
              Total Ingestion Rate
            </span>
            <div className="p-2 rounded-lg bg-[#4b8eff]/20 text-[#adc6ff]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-4xl text-white mb-1">24.8k</div>
          <span className="text-xs text-emerald-400 font-code flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% from last hour
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-body font-semibold text-[#8b90a0] tracking-widest uppercase">
              Active Anomalies
            </span>
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-4xl text-red-400 mb-1">3</div>
          <span className="text-xs text-red-400 font-code">2 Critical, 1 Warning</span>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-body font-semibold text-[#8b90a0] tracking-widest uppercase">
              AI Processing Time
            </span>
            <div className="p-2 rounded-lg bg-[#139cc7]/20 text-[#68d3ff]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-4xl text-[#68d3ff] mb-1">1.2s</div>
          <span className="text-xs text-[#8b90a0] font-code">Gemini 3.6 Flash Engine</span>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-body font-semibold text-[#8b90a0] tracking-widest uppercase">
              Monitored Nodes
            </span>
            <div className="p-2 rounded-lg bg-[#5b430d]/20 text-[#e6c180]">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-4xl text-[#e6c180] mb-1">30 / 30</div>
          <span className="text-xs text-emerald-400 font-code">100% Heartbeat Active</span>
        </div>
      </div>

      {/* Cluster Health Grid & Recent Incidents */}
      <div className="w-full grid grid-cols-12 gap-8 mb-8">
        {/* Cluster Health Table (7 cols) */}
        <div className="col-span-12 lg:col-span-7 glass-panel rounded-2xl p-6">
          <h3 className="font-headline text-2xl text-white mb-6">Cluster Node Health</h3>
          <div className="space-y-4">
            {systemClusters.map((cluster, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#171f33]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        cluster.status === "HEALTHY"
                          ? "bg-emerald-400"
                          : cluster.status === "WARNING"
                          ? "bg-yellow-400"
                          : "bg-red-400 animate-pulse"
                      }`}
                    ></span>
                    <span className="font-body font-medium text-base text-white">{cluster.name}</span>
                  </div>
                  <span className="text-xs text-[#8b90a0] font-code mt-1 block">
                    {cluster.nodeCount} active instances • p99 latency: {cluster.latency}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-code font-semibold ${
                      cluster.status === "HEALTHY"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : cluster.status === "WARNING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {cluster.status}
                  </span>
                  <span className="text-xs font-code text-[#c1c6d7]">{cluster.errors} errors</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Ingestion Graph Simulation (5 cols) */}
        <div className="col-span-12 lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-headline text-2xl text-white mb-2">Ingestion Throughput</h3>
            <span className="text-xs text-[#8b90a0] font-body">Log entries processed per second across all namespaces</span>
          </div>

          <div className="w-full h-48 my-4 relative overflow-hidden rounded-xl bg-[#060e20] border border-white/5 p-4 flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4b8eff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4b8eff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,120 Q50,40 100,90 T200,60 T300,110 T400,30 T500,80 L500,150 L0,150 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,120 Q50,40 100,90 T200,60 T300,110 T400,30 T500,80"
                fill="none"
                stroke="#adc6ff"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-[#8b90a0] font-code pt-3 border-t border-white/5">
            <span>Buffer Limit: 100,000/s</span>
            <span className="text-emerald-400">0% Drop Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
