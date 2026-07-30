import React, { useState, useRef, useEffect } from "react";
import { RecentSession, AnalysisResult } from "../types";
import { Upload, Trash2, Clipboard, Sparkles, AlertTriangle, Cpu, Terminal, ArrowRight, Play } from "lucide-react";

interface LogExplorerProps {
  logInput: string;
  setLogInput: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  recentSessions: RecentSession[];
  onSelectSession: (session: RecentSession) => void;
  analysisResult: AnalysisResult | null;
  filename: string;
  setFilename: (name: string) => void;
}

export const LogExplorer: React.FC<LogExplorerProps> = ({
  logInput,
  setLogInput,
  onAnalyze,
  isAnalyzing,
  recentSessions,
  onSelectSession,
  analysisResult,
  filename,
  setFilename,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Live calculated line metrics
  const linesCount = logInput ? logInput.split("\n").length : 0;
  const formattedLines = linesCount.toLocaleString("en-US", { minimumIntegerDigits: 4, useGrouping: true });

  const errorCount = (logInput.match(/ERROR|FATAL|EXCEPTION|FAIL|CRITICAL|PANIC|OOM/gi) || []).length;
  const warnCount = (logInput.match(/WARN|WARNING/gi) || []).length;

  let riskLevel: "NOMINAL" | "ELEVATED" | "HIGH" | "CRITICAL" = "NOMINAL";
  if (errorCount > 5 || /FATAL|PANIC|OOMKilled/i.test(logInput)) {
    riskLevel = "CRITICAL";
  } else if (errorCount > 0) {
    riskLevel = "HIGH";
  } else if (warnCount > 3) {
    riskLevel = "ELEVATED";
  }

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setLogInput(text);
      }
    } catch (err) {
      console.warn("Could not read clipboard:", err);
    }
  };

  // Clear input
  const handleClear = () => {
    setLogInput("");
    setFilename("custom-terminal.log");
  };

  // Upload file handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setLogInput(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setLogInput(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-20 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full mb-10 text-left">
        <span className="font-body text-xs font-semibold text-[#adc6ff] tracking-[0.4em] uppercase block mb-2">
          RAW DATA INGESTION
        </span>
        <h2 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white mb-4 font-light tracking-tight">
          the exploration
        </h2>
        <p className="font-body text-base md:text-lg text-[#c1c6d7] max-w-2xl leading-relaxed">
          Unleash the full diagnostic potential of Aether. Paste your logs below for a deep-space analysis of anomalies, architectural bottlenecks, and critical failures.
        </p>
      </section>

      {/* Input Console Bento Grid */}
      <div className="w-full grid grid-cols-12 gap-6">
        {/* Main Log Input (8 columns) */}
        <div className="col-span-12 lg:col-span-8 group">
          <div className="glass-panel rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-500 hover:border-white/20">
            <div>
              {/* Header Bar */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full animate-pulse ${
                      riskLevel === "CRITICAL"
                        ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"
                        : riskLevel === "HIGH"
                        ? "bg-orange-400"
                        : riskLevel === "ELEVATED"
                        ? "bg-yellow-400"
                        : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    }`}
                  ></div>
                  <span className="font-body text-xs font-semibold text-[#dae2fd] tracking-widest uppercase">
                    TERMINAL INPUT {filename && <span className="text-[#8b90a0] font-mono font-normal">({filename})</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePasteClipboard}
                    className="p-2 rounded-lg bg-[#222a3d]/80 text-[#c1c6d7] hover:text-white hover:bg-[#2d3449] transition-all flex items-center gap-1.5 text-xs font-body"
                    title="Paste from Clipboard"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-2 rounded-lg bg-[#222a3d]/80 text-[#c1c6d7] hover:text-white hover:bg-[#2d3449] transition-all flex items-center gap-1.5 text-xs font-body"
                    title="Clear Terminal"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>

              {/* Textarea Area with Drag and Drop */}
              <div
                className={`relative rounded-xl transition-all duration-300 ${
                  isDragging ? "ring-2 ring-[#4b8eff] bg-[#4b8eff]/10" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <textarea
                  value={logInput}
                  onChange={(e) => setLogInput(e.target.value)}
                  className="w-full h-[400px] md:h-[450px] bg-[#060e20]/60 border border-white/5 rounded-xl p-6 font-code text-xs md:text-sm text-[#d8e2ff] leading-relaxed log-textarea resize-none placeholder:text-[#8b90a0]/40"
                  placeholder="[2024-05-20 14:02:11] TRACE: Initializing system core... &#10;[2024-05-20 14:02:12] ERROR: NullPointerException in module 'Nexus-7'... &#10;Paste your raw system logs here for AI-driven classification."
                  spellCheck={false}
                />

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".log,.txt,.json,.csv"
                  className="hidden"
                />

                {/* Floating Upload Icon */}
                <div className="absolute bottom-5 right-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 glass-panel rounded-full hover:bg-white/10 transition-all border-[#adc6ff]/20 shadow-[0_0_15px_rgba(173,198,255,0.1)] text-[#adc6ff] text-xs font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>UPLOAD FILE</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#8b90a0] font-code flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4b8eff]"></span>
                <span>Ready for SRE Deep Diagnostic Engine</span>
              </div>

              <button
                onClick={onAnalyze}
                disabled={isAnalyzing || !logInput.trim()}
                className={`ai-glow-button px-8 py-4 bg-[#adc6ff] text-[#002e69] font-body text-xs font-bold rounded-full flex items-center justify-center gap-3 tracking-widest uppercase transition-all duration-300 ${
                  isAnalyzing || !logInput.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-white cursor-pointer shadow-[0_0_25px_rgba(173,198,255,0.4)]"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span>Analyzing Logs...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      psychology
                    </span>
                    <span>ANALYZE WITH AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Side Panels (4 columns) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Ingestion Metrics Card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-1/2">
            <div>
              <span className="font-body text-xs font-semibold text-[#8b90a0] tracking-widest block mb-4 uppercase">
                Ingestion Metrics
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="font-body text-sm text-[#c1c6d7]">Lines Parsed</span>
                  <span className="font-headline text-3xl text-[#68d3ff] tracking-tight">{formattedLines}</span>
                </div>

                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="font-body text-sm text-[#c1c6d7]">Active Clusters</span>
                  <span className="font-headline text-3xl text-[#adc6ff] tracking-tight">12</span>
                </div>

                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="font-body text-sm text-[#c1c6d7]">Risk Level</span>
                  <span
                    className={`font-headline text-2xl tracking-tight ${
                      riskLevel === "CRITICAL"
                        ? "text-red-400"
                        : riskLevel === "HIGH"
                        ? "text-orange-400"
                        : riskLevel === "ELEVATED"
                        ? "text-yellow-400"
                        : "text-[#e6c180]"
                    }`}
                  >
                    {riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkline Graphic */}
            <div className="mt-4">
              <div className="w-full h-20 relative overflow-hidden rounded-lg bg-[#222a3d]/30 border border-white/5">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <path
                    className="opacity-50"
                    d={
                      riskLevel === "CRITICAL"
                        ? "M0,90 L40,80 L80,30 L120,95 L160,20 L200,10 L240,85 L280,15 L320,90 L360,5 L400,60"
                        : "M0,80 L40,60 L80,90 L120,40 L160,50 L200,20 L240,70 L280,30 L320,50 L360,10 L400,40"
                    }
                    fill="none"
                    stroke={riskLevel === "CRITICAL" ? "#ffb4ab" : "#adc6ff"}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* AI Intelligence Context Card */}
          <div className="glass-panel rounded-2xl p-6 h-1/2 border-l-4 border-[#e6c180] overflow-hidden relative group flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <span className="material-symbols-outlined text-[160px] text-[#e6c180]">
                auto_awesome
              </span>
            </div>

            <div>
              <span className="font-body text-xs font-semibold text-[#e6c180] tracking-widest block mb-2 uppercase">
                INTELLIGENCE CONTEXT
              </span>
              <h3 className="font-headline text-2xl md:text-3xl text-white mb-3 italic">
                {isAnalyzing
                  ? "Analyzing Stream..."
                  : logInput.trim().length > 0
                  ? "Log Pattern Detected"
                  : "Scanning Patterns..."}
              </h3>
              <p className="font-body text-sm text-[#c1c6d7] leading-relaxed">
                {isAnalyzing
                  ? "Extracting error stack traces, correlating system metrics, and referencing SRE diagnostic rules..."
                  : logInput.trim().length > 0
                  ? `Detected ${errorCount} error signature(s) and ${warnCount} warning(s). Click 'ANALYZE WITH AI' to generate a full incident report.`
                  : '"The system is currently idling. Once logs are provided, I will initiate a multi-threaded pattern recognition sequence to identify root causes and suggest remediations."'
                }
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border border-[#0b1326] bg-[#adc6ff]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-[#adc6ff]">bolt</span>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-[#0b1326] bg-[#68d3ff]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-[#68d3ff]">search_insights</span>
                  </div>
                </div>
                <span className="text-xs font-body font-semibold text-[#8b90a0] ml-2">2 Engines Ready</span>
              </div>

              {analysisResult && (
                <span className="text-xs font-code text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Report Active
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Sessions Section */}
      <section className="w-full mt-12">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-body text-xs font-semibold text-[#8b90a0] tracking-widest uppercase">
            RECENT SESSIONS
          </h4>
          <span className="text-xs text-[#8b90a0]">Click scenario to load & analyze</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="glass-panel rounded-xl p-5 hover:bg-white/10 hover:border-[#adc6ff]/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      session.risk === "CRITICAL"
                        ? "bg-red-500/20 text-red-400"
                        : session.risk === "HIGH"
                        ? "bg-orange-500/20 text-orange-400"
                        : session.risk === "ELEVATED"
                        ? "bg-[#139cc7]/20 text-[#68d3ff]"
                        : "bg-[#5b430d]/20 text-[#e6c180]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {session.risk === "CRITICAL"
                        ? "warning"
                        : session.risk === "HIGH"
                        ? "security"
                        : "network_ping"}
                    </span>
                  </div>
                  <span className="font-code text-xs text-[#8b90a0]">{session.time}</span>
                </div>
                <div className="font-body text-lg text-white font-medium mb-1 group-hover:text-[#adc6ff] transition-colors">
                  {session.title}
                </div>
              </div>
              <div className="font-body text-[10px] text-[#8b90a0] font-semibold tracking-wider pt-3 border-t border-white/5 flex justify-between items-center">
                <span>SESSION ID: #{session.id}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#adc6ff]">
                  Load →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
