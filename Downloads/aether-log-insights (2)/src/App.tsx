import React, { useState, useEffect } from "react";
import { NavigationTab, RecentSession, AnalysisResult, SystemSettings } from "./types";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { LogExplorer } from "./components/LogExplorer";
import { IncidentReportView } from "./components/IncidentReportView";
import { DashboardView } from "./components/DashboardView";
import { SystemHealthView } from "./components/SystemHealthView";
import { SettingsModal } from "./components/SettingsModal";
import { Footer } from "./components/Footer";
import { IntroOverlay } from "./components/IntroOverlay";
import { generateSreReport } from "./lib/logAnalyzerEngine";

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavigationTab>("explorer");
  const [logInput, setLogInput] = useState<string>(
    `[2024-05-20 14:02:11] TRACE: Initializing system core...
[2024-05-20 14:02:12] ERROR: NullPointerException in module 'Nexus-7' at com.nexus.db.ConnectionManager.getConnection(ConnectionManager.java:142)
[2024-05-20 14:02:12] ERROR: Failed to obtain database connection from pool after 10000ms timeout.
[2024-05-20 14:02:13] WARN: Connection leak suspected in worker thread pool.`
  );
  const [filename, setFilename] = useState<string>("nexus-7-system.log");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<SystemSettings>({
    autoAnalyzeOnPaste: true,
    riskThreshold: "CRITICAL",
    aiTemperature: 0.2,
    defaultFilename: "system-event.log",
    memoryUsagePercent: 75,
    activeClusterCount: 12,
  });

  // Default recent sessions list
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([
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
[2024-05-20 14:02:15] TRACE [Nexus-Core] Triggering heap dump to /var/log/nexus/heapdump-20240520-140215.hprof`,
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
[2024-05-20 12:30:04] WARN  [CircuitBreaker] Circuit 'PaymentService' opened due to 15 consecutive 5xx responses.`,
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
[2024-05-20 09:15:00] FATAL [SecurityFilter] Rate limit exceeded. IP 192.168.1.45 blocked for 3600 seconds.`,
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
[2024-05-20 08:02:02] INFO  [Kubelet] Pod 'analytics-job-94x2' state changed to CrashLoopBackOff`,
    },
  ]);

  // Load sample scenarios from server on mount if available
  useEffect(() => {
    fetch("/api/sample-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.samples && Array.isArray(data.samples)) {
          setRecentSessions(data.samples);
        }
      })
      .catch((err) => console.warn("Could not fetch initial sample logs:", err));
  }, []);

  // Trigger Log Analysis
  const handleAnalyze = async (inputOverride?: string, nameOverride?: string) => {
    const textToAnalyze = inputOverride || logInput;
    const fileToAnalyze = nameOverride || filename;

    if (!textToAnalyze || textToAnalyze.trim().length === 0) return;

    setIsAnalyzing(true);
    try {
      let data: AnalysisResult | null = null;

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logContent: textToAnalyze,
            filename: fileToAnalyze,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          }
        }
      } catch (networkErr) {
        console.warn("Backend API endpoint not reachable, running client-side SRE log analysis engine:", networkErr);
      }

      // Fallback to client-side SRE rule engine if backend API returned no result
      if (!data) {
        data = generateSreReport(textToAnalyze, fileToAnalyze);
      }

      setAnalysisResult(data);

      // Add to recent sessions if not present
      const newSession: RecentSession = {
        id: Math.floor(1000 + Math.random() * 9000) + "-AI",
        title: fileToAnalyze.replace(/\.[^/.]+$/, "").toUpperCase() + " Analysis",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        filename: fileToAnalyze,
        risk: data.metrics.riskLevel,
        content: textToAnalyze,
        reportMarkdown: data.reportMarkdown,
      };

      setRecentSessions((prev) => [newSession, ...prev.filter((s) => s.filename !== fileToAnalyze)]);

      // Switch view to report tab
      setCurrentTab("report");
    } catch (err: any) {
      console.error("Analysis request processing error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select a recent session
  const handleSelectSession = (session: RecentSession) => {
    setLogInput(session.content);
    setFilename(session.filename);
    handleAnalyze(session.content, session.filename);
  };

  // Load scenario from health simulator
  const handleLoadScenarioToTerminal = (content: string, name: string) => {
    setLogInput(content);
    setFilename(name);
    setCurrentTab("explorer");
    handleAnalyze(content, name);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-body relative overflow-x-hidden">
      {/* Background Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] bg-[radial-gradient(#adc6ff_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

      {/* Intro Overlay Sequence */}
      {showIntro && <IntroOverlay onEnter={() => setShowIntro(false)} />}

      {/* Header Bar */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Main Layout with Sidebar */}
      <div className="flex relative z-10">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          memoryUsage={settings.memoryUsagePercent}
        />

        {/* Main Content Pane */}
        <main className="ml-0 md:ml-72 w-full min-h-screen flex flex-col justify-between">
          <div>
            {currentTab === "explorer" && (
              <LogExplorer
                logInput={logInput}
                setLogInput={setLogInput}
                onAnalyze={() => handleAnalyze()}
                isAnalyzing={isAnalyzing}
                recentSessions={recentSessions}
                onSelectSession={handleSelectSession}
                analysisResult={analysisResult}
                filename={filename}
                setFilename={setFilename}
              />
            )}

            {currentTab === "report" && (
              <IncidentReportView
                result={analysisResult}
                onBackToExplorer={() => setCurrentTab("explorer")}
                rawLogContent={logInput}
              />
            )}

            {currentTab === "dashboard" && (
              <DashboardView
                recentSessions={recentSessions}
                onSelectSession={handleSelectSession}
                onNavigateExplorer={() => setCurrentTab("explorer")}
              />
            )}

            {currentTab === "health" && (
              <SystemHealthView onLoadScenarioToTerminal={handleLoadScenarioToTerminal} />
            )}
          </div>

          <Footer />
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
