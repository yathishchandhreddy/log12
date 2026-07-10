import React, { useState } from "react";
import { BookOpen, Sparkles, Code2, Database, Wrench, GraduationCap } from "lucide-react";
import { skillGroups } from "../data";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Programming Languages", "Web Development", "Database & Core CS", "Tools & Developer Workflows", "Currently Learning & Core Fundamentals"];

  const filteredGroups = activeCategory === "All" 
    ? skillGroups 
    : skillGroups.filter(g => g.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Programming Languages":
        return <Code2 size={18} className="text-ms-blue" />;
      case "Web Development":
        return <Sparkles size={18} className="text-ms-blue" />;
      case "Database & Core CS":
        return <Database size={18} className="text-ms-blue" />;
      case "Tools & Developer Workflows":
        return <Wrench size={18} className="text-ms-blue" />;
      default:
        return <GraduationCap size={18} className="text-ms-blue" />;
    }
  };

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400 mb-2">
            My Toolbox
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skills & Core Competencies
          </h3>
          <div className="h-[3px] w-12 bg-ms-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`skill-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-ms-blue text-white shadow-md shadow-ms-blue/15"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {filteredGroups.map((group, groupIdx) => (
            <div
              key={group.category}
              className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-6"
            >
              <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  {getCategoryIcon(group.category)}
                </div>
                <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  {group.category}
                </h4>
              </div>

              <div className="space-y-5">
                {group.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                    {/* Visual Animated Skill Level Bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-ms-blue to-[#50e6ff] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Section: Currently Learning Goals */}
        <div className="mt-16 bg-gradient-to-tr from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-blue-300">
                <BookOpen size={12} />
                <span>Currently Specializing</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                Mastering Computer Science Foundations & DSA
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Currently deep diving into Data Structures & Algorithms (Arrays, Linked Lists, Trees, Sorting, Searching), Object-Oriented Programming (OOP) design patterns, Operating System processes, and advanced full-stack architectures. Preparing strictly to excel in technical screening.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-end">
              {["DSA (Java)", "DBMS / MySQL", "OOP", "Operating Systems", "Full Stack (React)"].map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-mono rounded-lg hover:border-ms-blue transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
