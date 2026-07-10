import React, { useState, useEffect } from "react";
import { ArrowRight, Code, Download, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { personalInfo } from "../data";

export default function Hero() {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const roles = [
    "Computer Science Student",
    "Aspiring Microsoft Software Engineer",
    "Full Stack & DSA Learner",
    "AI & Machine Learning Enthusiast",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = roles[roleIndex];
      if (!isDeleting) {
        setText(currentFullText.substring(0, text.length + 1));
        setTypingSpeed(75); // speed up writing
        if (text === currentFullText) {
          setIsDeleting(true);
          setTypingSpeed(1500); // hold word
        }
      } else {
        setText(currentFullText.substring(0, text.length - 1));
        setTypingSpeed(35); // delete faster
        if (text === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTypingSpeed(500); // pause before next
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, typingSpeed]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
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

  // Helper to handle printable resume trigger
  const handlePrintResume = () => {
    window.print();
  };

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      {/* Fluent Microsoft Grid Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.15]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse duration-[8s]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse duration-[12s]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Content Area */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left animate-fade-in-up">
            {/* Microsoft Prep Indicator Badge */}
            <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80 w-fit mx-auto lg:mx-0 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ms-blue"></span>
              </span>
              <span className="text-xs font-mono font-medium tracking-wide text-slate-700 dark:text-slate-300 uppercase">
                Microsoft Software Engineering Intern Prep
              </span>
            </div>

            {/* Main Greeting */}
            <div className="space-y-3">
              <h1 className="text-xs sm:text-sm font-mono tracking-widest text-ms-blue dark:text-blue-400 font-bold uppercase">
                Hi, my name is
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                {personalInfo.name}
              </h2>
              {/* Dynamic Typing Title */}
              <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start">
                <p className="text-lg sm:text-xl md:text-2xl font-mono text-slate-600 dark:text-slate-300">
                  I am a{" "}
                  <span className="text-ms-blue dark:text-blue-400 font-bold border-r-2 border-ms-blue dark:border-blue-400 pr-1 animate-pulse">
                    {text}
                  </span>
                </p>
              </div>
            </div>

            {/* Sub tagline / Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.objective}
            </p>

            {/* Contact Details Grid */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <MapPin size={16} className="text-ms-blue" />
                <span>{personalInfo.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Code size={16} className="text-ms-blue" />
                <span>{personalInfo.college}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-view-projects-btn"
                onClick={() => scrollToSection("projects")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-ms-blue text-white px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-ms-darkblue transition-all duration-200 shadow-md shadow-ms-blue/20 group cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-contact-btn"
                onClick={() => scrollToSection("contact")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-6 py-3.5 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <span>Contact Me</span>
              </button>

              <button
                id="hero-resume-btn"
                onClick={handlePrintResume}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                title="Print / PDF Resume"
              >
                <FileText size={16} />
                <span>Print Resume</span>
              </button>
            </div>

            {/* Social Coordinates */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 pt-6">
              <a
                id="hero-social-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-500 hover:text-ms-blue dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>
              <a
                id="hero-social-github"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg text-slate-500 hover:text-ms-blue dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5"
                aria-label="GitHub Profile"
              >
                <Github size={18} />
              </a>
              <a
                id="hero-social-email"
                href={`mailto:${personalInfo.email}`}
                className="p-2.5 rounded-lg text-slate-500 hover:text-ms-blue dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:-translate-y-0.5"
                aria-label="Email Contact"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Profile Visualizer Container */}
          <div className="lg:col-span-5 flex justify-center items-center z-10">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 group">
              {/* Microsoft-colored border rotating grids */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#0078d4] via-[#50e6ff] to-[#6366f1] rounded-2xl opacity-30 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-2xl border-2 border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 relative group-hover:scale-[1.02] transition-transform duration-300">
                
                {/* Embedded Grid background inside profile */}
                <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] bg-[radial-gradient(#0078d4_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Microsoft Fluent Logo Elements Grid Mock */}
                <div className="absolute top-4 right-4 grid grid-cols-2 gap-0.5 w-6 h-6 opacity-30 dark:opacity-50">
                  <div className="bg-[#f25022] w-2.5 h-2.5" />
                  <div className="bg-[#7fba00] w-2.5 h-2.5" />
                  <div className="bg-[#00a4ef] w-2.5 h-2.5" />
                  <div className="bg-[#ffb900] w-2.5 h-2.5" />
                </div>

                {/* Abstract Visual Representation of CS & AI (Initial based) */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-white dark:border-slate-950 flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-ms-blue shadow-lg relative z-10 overflow-hidden select-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-ms-blue/20 to-indigo-500/10" />
                  <span className="relative z-10 font-display">YR</span>
                </div>

                {/* Personal Information Tags */}
                <div className="text-center mt-6 space-y-1 z-10">
                  <h3 className="font-display font-semibold text-lg sm:text-xl text-slate-800 dark:text-slate-100">
                    {personalInfo.name}
                  </h3>
                  <p className="text-xs font-mono text-ms-blue dark:text-blue-400 uppercase tracking-wider font-bold">
                    {personalInfo.degree}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    2nd Year Undergraduate | 7.60 CGPA
                  </p>
                </div>

                {/* Simulated Terminal Stats Line */}
                <div className="w-full mt-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 border border-slate-200/40 dark:border-slate-800/40 font-mono text-[10px] text-left text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="flex justify-between">
                    <span className="text-ms-blue">yathish@pc:~$</span>
                    <span className="text-slate-400">status --ready</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-500">DSA Prep: 35 Problems Solved</p>
                  <p className="text-slate-600 dark:text-slate-500">Target: SWE Intern (Summer 2027)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
