import React, { useState, useEffect } from "react";
import { ArrowUp, Terminal, Heart } from "lucide-react";
import { personalInfo } from "../data";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 transition-colors relative border-t border-slate-800">
      
      {/* Scroll to Top Trigger */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-ms-blue hover:bg-ms-darkblue text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-white/10 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start space-x-2.5">
              <div className="w-7 h-7 rounded bg-ms-blue flex items-center justify-center text-white font-mono font-bold text-sm">
                Y
              </div>
              <span className="font-display font-semibold text-white tracking-wide text-base">
                P. Yathish Chandh Reddy
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Computer Science student building full-stack web architectures & preparing for Microsoft Software Engineering Internships.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-end text-xs font-mono font-bold uppercase">
            <a href="#about" className="hover:text-ms-blue transition-colors">About</a>
            <a href="#skills" className="hover:text-ms-blue transition-colors">Skills</a>
            <a href="#projects" className="hover:text-ms-blue transition-colors">Projects</a>
            <a href="#experience" className="hover:text-ms-blue transition-colors">Experience</a>
            <a href="#contact" className="hover:text-ms-blue transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-500 font-medium">
          <p className="flex items-center gap-1">
            <span>© {currentYear} P. Yathish Chandh Reddy. All rights reserved.</span>
          </p>
          
          <p className="flex items-center justify-center sm:justify-end gap-1 font-mono text-[10px]">
            <span>Crafted with</span>
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>& Tailwind v4</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
