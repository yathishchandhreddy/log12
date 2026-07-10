import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import ProjectsSection from "./components/ProjectsSection";
import ExperienceEducation from "./components/ExperienceEducation";
import CertificationsAchievements from "./components/CertificationsAchievements";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check local storage or default to true for modern dark layout
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  const [loading, setLoading] = useState(true);

  // Apply dark mode styling to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Initial Loading Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        id="applet-loader"
        className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 transition-all duration-500"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Microsoft Styled Grid Loading animation */}
          <div className="grid grid-cols-2 gap-1.5 w-16 h-16 animate-pulse">
            <div className="bg-[#f25022] w-7 h-7 rounded-sm" />
            <div className="bg-[#7fba00] w-7 h-7 rounded-sm" />
            <div className="bg-[#00a4ef] w-7 h-7 rounded-sm" />
            <div className="bg-[#ffb900] w-7 h-7 rounded-sm" />
          </div>
          <div className="text-center mt-4">
            <h1 className="font-display font-extrabold text-white text-lg tracking-wider">
              P. YATHISH CHANDH REDDY
            </h1>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
              Preparing Portfolio Engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-ms-blue/20">
      {/* Header top bar */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Portfolio contents */}
      <main className="overflow-x-hidden">
        {/* 1. Hero Presentational Area */}
        <Hero />

        {/* 2. About Narrative & Key Bento Indicators */}
        <About />

        {/* 3. Filterable Skills & Toolbox */}
        <Skills />

        {/* 4. Interactive Live-Playground Projects */}
        <ProjectsSection />

        {/* 5. Timelines: Work Experience & Academic Degrees */}
        <ExperienceEducation />

        {/* 6. Professional Milestones & Certifications */}
        <CertificationsAchievements />

        {/* 7. Connected coordinates & Interactive Message sender */}
        <Contact />
      </main>

      {/* Footer corporate notes & scroll actions */}
      <Footer />
    </div>
  );
}
