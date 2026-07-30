import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full flex flex-col sm:flex-row justify-between items-center px-4 md:px-10 py-6 bg-gradient-to-t from-[#060e20] to-transparent relative z-10 border-t border-white/5 text-xs font-code text-[#8b90a0] gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span>© 2026 Aether Technical Systems. Terminal v2.4.0-stable</span>
        <span className="hidden sm:inline text-[#414755]">•</span>
        <span className="text-[#e6c180] font-bold">BY TEAM HACKHORIZON</span>
      </div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-[#dae2fd] transition-colors">
          Support
        </a>
        <a href="#" className="hover:text-[#dae2fd] transition-colors">
          Documentation
        </a>
        <a href="#" className="hover:text-[#dae2fd] transition-colors">
          API Status
        </a>
      </div>
    </footer>
  );
};
