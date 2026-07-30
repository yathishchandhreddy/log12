import React from "react";
import { SystemSettings } from "../types";
import { X, Settings, Cpu, Shield, Sparkles, CheckCircle2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel-deep rounded-2xl w-full max-w-lg p-6 md:p-8 border border-white/10 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#adc6ff] text-[28px]">settings</span>
            <h3 className="font-headline text-2xl text-white">System Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8b90a0] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* AI Model Preference */}
          <div>
            <label className="block text-xs font-body font-semibold text-[#adc6ff] uppercase tracking-wider mb-2">
              Gemini AI Engine
            </label>
            <div className="p-3 rounded-xl bg-[#060e20] border border-white/10 flex items-center justify-between text-xs text-[#c1c6d7]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#adc6ff]" />
                <span className="font-code font-bold text-white">gemini-3.6-flash</span>
              </div>
              <span className="text-emerald-400 font-code font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <p className="text-[11px] text-[#8b90a0] mt-1.5 leading-relaxed">
              Configured via server-side Google GenAI SDK using system secrets.
            </p>
          </div>

          {/* Default Log Filename */}
          <div>
            <label className="block text-xs font-body font-semibold text-[#adc6ff] uppercase tracking-wider mb-2">
              Default Log Source Name
            </label>
            <input
              type="text"
              value={settings.defaultFilename}
              onChange={(e) =>
                onUpdateSettings({ ...settings, defaultFilename: e.target.value })
              }
              className="w-full bg-[#060e20] border border-white/10 rounded-xl p-3 font-code text-xs text-white focus:outline-none focus:border-[#4b8eff]"
            />
          </div>

          {/* Auto Analyze Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#171f33]/60 border border-white/5">
            <div>
              <span className="block font-body text-sm font-medium text-white">Auto-Detect Anomalies</span>
              <span className="text-xs text-[#8b90a0]">Highlight errors immediately on log upload</span>
            </div>

            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  autoAnalyzeOnPaste: !settings.autoAnalyzeOnPaste,
                })
              }
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                settings.autoAnalyzeOnPaste ? "bg-[#4b8eff] justify-end" : "bg-[#2d3449] justify-start"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
            </button>
          </div>

          {/* System API Status */}
          <div className="p-4 rounded-xl bg-[#060e20] border border-white/5 space-y-3">
            <span className="text-xs font-body font-semibold text-[#8b90a0] uppercase tracking-wider block">
              Deployment & API Connection Status
            </span>
            <div className="space-y-2 text-xs font-code">
              <div className="flex justify-between text-[#c1c6d7]">
                <span>Vercel Serverless & Express:</span>
                <span className="text-emerald-400 font-semibold">Configured (vercel.json & /api)</span>
              </div>
              <div className="flex justify-between text-[#c1c6d7]">
                <span>Client Engine Fallback:</span>
                <span className="text-emerald-400 font-semibold">Active & Standby</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-[#adc6ff]/80 font-body leading-relaxed">
              <strong className="text-white block mb-0.5">Vercel Deployment Tip:</strong>
              In Vercel Project Settings &gt; Environment Variables, set <code className="bg-black/40 text-[#e6c180] px-1 py-0.5 rounded font-code">GEMINI_API_KEY</code> or <code className="bg-black/40 text-[#e6c180] px-1 py-0.5 rounded font-code">VITE_GEMINI_API_KEY</code>.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#adc6ff] text-[#002e69] font-body text-xs font-bold rounded-full uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
