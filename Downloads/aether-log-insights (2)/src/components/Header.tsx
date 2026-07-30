import React from "react";
import { Settings, Activity, Cpu, Menu } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  onReplayIntro?: () => void;
  statusText?: string;
  versionText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onToggleMobileSidebar,
  onReplayIntro,
  statusText = "STATUS: OPTIMAL",
  versionText = "V2.4.0-STABLE",
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-10 py-4 backdrop-blur-xl bg-[#0b1326]/40 border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden text-[#adc6ff] p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4b8eff]/30 to-[#139cc7]/20 border border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff] shadow-[0_0_15px_rgba(75,142,255,0.25)]">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              hub
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-xl md:text-2xl font-headline text-[#dae2fd] tracking-tight font-light">
              Aether Log Insights
            </h1>
            <span className="text-[10px] sm:text-xs font-code font-bold text-[#e6c180] bg-[#5b430d]/40 px-2.5 py-0.5 rounded-full border border-[#e6c180]/30 tracking-wider uppercase">
              BY TEAM HACKHORIZON
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden lg:flex gap-6 items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#171f33]/60 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-body text-xs tracking-widest text-[#c1c6d7] font-semibold">
              {statusText}
            </span>
          </div>
          <span className="font-body text-xs tracking-widest text-[#8b90a0] font-semibold">
            {versionText}
          </span>
        </div>

        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131b2e] border border-[#adc6ff]/30 text-[#adc6ff] hover:bg-[#222a3d] transition-all text-xs font-code font-semibold uppercase tracking-wider cursor-pointer"
            title="Replay Intro Sequence"
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span className="hidden md:inline">Intro</span>
          </button>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-[#adc6ff] hover:bg-white/10 transition-all duration-300 hover:rotate-45"
          title="Open Settings"
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>
      </div>
    </header>
  );
};
