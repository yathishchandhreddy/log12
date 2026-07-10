import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, Terminal, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section
      const sections = navItems.map((item) =>
        document.getElementById(item.href.replace("#", ""))
      );

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].href.replace("#", ""));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of the header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        id="scroll-progress-bar"
        className="h-[2px] bg-ms-blue w-full fixed top-0 left-0 transition-all duration-100 origin-left"
        style={{
          transform: `scaleX(${
            typeof window !== "undefined"
              ? window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) || 0
              : 0
          })`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <div
            id="brand-logo"
            onClick={() => scrollToSection("hero")}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-ms-blue flex items-center justify-center text-white font-mono font-bold text-lg shadow-sm shadow-ms-blue/30 group-hover:bg-ms-darkblue transition-colors">
              Y
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-slate-900 dark:text-slate-50 text-base sm:text-lg leading-tight tracking-tight">
                P. Yathish Chandh
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                PORTFOLIO
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-navbar" className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <button
                  key={item.href}
                  id={`nav-link-${id}`}
                  onClick={() => scrollToSection(id)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 relative ${
                    isActive
                      ? "text-ms-blue font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-ms-blue dark:hover:text-ms-blue"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-3.5 right-3.5 h-[2px] bg-ms-blue rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Menu: Theme toggle & CTA */}
          <div id="header-actions" className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Microsoft Internship Focus Badge / Resume Action */}
            <button
              id="header-cta-btn"
              onClick={() => scrollToSection("contact")}
              className="hidden lg:flex items-center space-x-1.5 bg-ms-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ms-darkblue transition-all shadow-sm shadow-ms-blue/10 cursor-pointer"
            >
              <span>Apply Status</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div
        id="mobile-navbar-drawer"
        className={`md:hidden fixed inset-x-0 top-16 sm:top-20 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out shadow-lg z-40 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-1.5">
          {navItems.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={item.href}
                id={`mobile-nav-link-${id}`}
                onClick={() => scrollToSection(id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-900 text-ms-blue font-semibold border-l-4 border-ms-blue"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="px-4 pt-3">
            <button
              id="mobile-apply-badge"
              onClick={() => scrollToSection("contact")}
              className="w-full flex items-center justify-center space-x-2 bg-ms-blue text-white px-4 py-3 rounded-lg text-sm font-medium shadow-sm hover:bg-ms-darkblue"
            >
              <span>Microsoft Internship Prep Status: Active</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
