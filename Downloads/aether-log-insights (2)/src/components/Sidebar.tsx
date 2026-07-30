import React from "react";
import { NavigationTab } from "../types";

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  memoryUsage?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  memoryUsage = 75,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "explorer", label: "Log Explorer", icon: "search_insights" },
    { id: "report", label: "AI Incident Reports", icon: "psychology" },
    { id: "health", label: "System Health", icon: "biotech" },
  ];

  const handleTabClick = (id: NavigationTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 backdrop-blur-[40px] bg-[#131b2e]/60 border-r border-white/5 shadow-2xl flex flex-col gap-2 pt-28 pb-8 z-40 transition-transform duration-300 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-8 mb-4">
          <span className="text-xs font-body font-semibold text-[#adc6ff] tracking-[0.25em] uppercase">
            NAVIGATION
          </span>
        </div>

        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-4 px-8 py-3.5 text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-[#adc6ff]/15 text-[#adc6ff] border-r-4 border-[#adc6ff] font-medium"
                    : "text-[#c1c6d7] hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-[#adc6ff]" : "text-[#8b90a0]"
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-body text-base tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-6 pt-6 border-t border-white/5">
          <div className="p-4 rounded-xl bg-[#222a3d]/80 border border-white/5 shadow-inner">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-body font-semibold text-[#8b90a0] tracking-widest uppercase">
                MEMORY USAGE
              </span>
              <span className="text-xs font-code text-[#68d3ff]">{memoryUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#2d3449] rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#68d3ff] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(104,211,255,0.5)]"
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#8b90a0]">
              <span>Active Clusters:</span>
              <span className="text-[#adc6ff] font-medium">12 Nodes</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
