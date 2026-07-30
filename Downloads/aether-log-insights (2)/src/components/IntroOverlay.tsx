import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Cpu, Zap, X, ShieldCheck, Terminal, CheckCircle2 } from "lucide-react";

interface IntroOverlayProps {
  onEnter: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  const logs = [
    "INITIALIZING AETHER CORE PROTOCOLS v2.4.0...",
    "CONNECTING TELEMETRY INGESTION BUS...",
    "LOADING GEMINI AI SRE DIAGNOSTIC ENGINE...",
    "AUTHENTICATING DEVELOPMENT CREATOR CREDENTIALS...",
    "PRESENTED BY TEAM HACKHORIZON [2026 EDITION]...",
    "SYSTEM STATUS: ACCESS GRANTED. LAUNCHING TERMINAL...",
  ];

  useEffect(() => {
    // Smooth progress counter from 0 to 100 over ~3 seconds
    const intervalTime = 30; // 30ms * 100 = 3000ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Auto-transition to main application after reaching 100%
          setTimeout(() => {
            onEnter();
          }, 300);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    // Terminal log line animation
    const logTimer = setInterval(() => {
      setActiveLogIndex((prev) => {
        if (prev >= logs.length - 1) {
          clearInterval(logTimer);
          return logs.length - 1;
        }
        return prev + 1;
      });
    }, 450);

    // Escape or Enter key shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        onEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEnter]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-[#030712] text-[#dae2fd] flex flex-col justify-between p-6 md:p-12 overflow-hidden selection:bg-[#4b8eff]/30"
      >
        {/* Animated Cyber Grid & Radial Lights */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#171f33_1px,transparent_1px),linear-gradient(to_bottom,#171f33_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#4b8eff]/20 via-[#68d3ff]/15 to-[#e6c180]/25 blur-[160px] rounded-full pointer-events-none"></div>

        {/* Top Navigation Bar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-code text-xs text-[#adc6ff] tracking-[0.25em] uppercase font-semibold">
              AETHER LOG INSIGHTS 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#131b2e] border border-[#e6c180]/50 shadow-[0_0_15px_rgba(230,193,128,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#e6c180]" />
              <span className="font-code text-xs font-bold text-[#e6c180] tracking-wider uppercase">
                BY TEAM HACKHORIZON
              </span>
            </div>

            <button
              onClick={onEnter}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-[#dae2fd] border border-white/20 transition-all text-xs font-code font-bold uppercase tracking-wider cursor-pointer"
            >
              <span>Skip</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Intro Visuals */}
        <div className="relative z-10 my-auto text-center max-w-4xl mx-auto flex flex-col items-center py-6">
          {/* Animated "BY TEAM HACKHORIZON" Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#131b2e]/90 border border-[#e6c180]/60 shadow-[0_0_35px_rgba(230,193,128,0.35)] mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e6c180]/20 to-transparent animate-pulse"></div>
            <Cpu className="w-4 h-4 text-[#e6c180]" />
            <span className="font-code text-xs sm:text-sm font-extrabold text-[#e6c180] tracking-[0.3em] uppercase">
              PRESENTED BY TEAM HACKHORIZON
            </span>
          </motion.div>

          {/* Title 2026 Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="relative mb-4"
          >
            <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-light tracking-tight drop-shadow-[0_0_45px_rgba(173,198,255,0.3)]">
              AETHER LOG INSIGHTS
            </h1>
            <div className="font-code text-lg sm:text-2xl font-bold text-[#adc6ff] tracking-[0.5em] uppercase mt-2">
              EDITION 2026
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-body text-base sm:text-xl text-[#c1c6d7] max-w-2xl font-light mb-8 leading-relaxed"
          >
            AI-Powered Autonomous SRE Incident Diagnosis & Telemetry Platform
          </motion.p>

          {/* Automated Terminal Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-xl bg-[#060e20]/95 border border-white/10 rounded-xl p-4 text-left font-code text-xs text-[#adc6ff] shadow-2xl mb-8 h-28 overflow-hidden flex flex-col justify-end"
          >
            {logs.slice(0, activeLogIndex + 1).map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 py-0.5">
                <span className="text-[#68d3ff]">&gt;</span>
                <span className={log.includes("HACKHORIZON") ? "text-[#e6c180] font-bold" : ""}>
                  {log}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Status Message */}
          <div className="flex items-center gap-2 text-xs font-code tracking-widest text-[#e6c180] uppercase animate-pulse">
            {progress < 100 ? (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>LOADING AUTOMATIC INTRO SEQUENCE...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">SYSTEM ACCESS GRANTED - ENTERING TERMINAL</span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Automated Progress Counter Bar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="w-full sm:w-80">
            <div className="flex justify-between items-center text-xs font-code text-[#8b90a0] mb-2">
              <span>AUTOMATIC INTRO LOADER</span>
              <span className="text-[#e6c180] font-extrabold text-sm">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#1e293b] rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#4b8eff] via-[#68d3ff] to-[#e6c180] rounded-full transition-all duration-75 shadow-[0_0_15px_rgba(230,193,128,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="font-code text-xs text-[#8b90a0] tracking-widest uppercase text-center sm:text-right">
            CREATED BY <span className="text-[#e6c180] font-bold">TEAM HACKHORIZON</span> • 2026
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
