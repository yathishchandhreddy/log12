import React from "react";
import { BookOpen, Award, Target, BrainCircuit, Landmark, Heart } from "lucide-react";
import { personalInfo } from "../data";

export default function About() {
  const bentoCards = [
    {
      icon: <Landmark className="text-ms-blue dark:text-blue-400" size={24} />,
      title: "Academic Focus",
      subtitle: "B.E. CSE (AI & ML)",
      description: "2nd Year Undergraduate at VSB Engineering College. Cultivating strong computer science foundations and cutting-edge machine learning principles.",
    },
    {
      icon: <BrainCircuit className="text-ms-blue dark:text-blue-400" size={24} />,
      title: "Data Structures & Algos",
      subtitle: "Problem Solving",
      description: "Actively solving algorithmic and logical challenges. Developing an analytical mindset to build highly optimized, production-ready systems.",
    },
    {
      icon: <Target className="text-[#0078d4] dark:text-[#50e6ff]" size={24} />,
      title: "Microsoft Internship",
      subtitle: "Primary Goal",
      description: "Structuring academic path, building scalable web applications, and refining core engineering skills to qualify as a Software Engineering Intern.",
    },
    {
      icon: <Award className="text-ms-blue dark:text-blue-400" size={24} />,
      title: "Academic Grade",
      subtitle: "7.60 CGPA",
      description: "Consistent performance in engineering curriculum with solid marks in Programming, Math, and Core Computer Science fundamentals.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-900 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400 mb-2">
            Who I Am
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            About Me
          </h3>
          <div className="h-[3px] w-12 bg-ms-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Introduction Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
              Passionate Computer Science student on a path to design robust systems.
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              I am currently in my 2nd Year of pursuing a Bachelor of Engineering in{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                Computer Science and Engineering, specializing in Artificial Intelligence & Machine Learning
              </strong>{" "}
              at VSB Engineering College. 
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              My core interests sit at the intersection of full-stack engineering and algorithmic reasoning. 
              I am highly enthusiastic about mastering{" "}
              <strong className="text-slate-950 dark:text-white font-semibold">
                Data Structures & Algorithms (DSA)
              </strong>
              , Object-Oriented Design, and developing clean responsive user interfaces.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              My ultimate aim is to join a forward-thinking technology giant like{" "}
              <strong className="text-ms-blue dark:text-blue-400 font-bold">Microsoft</strong>, where I can build
              impactful, secure, and globally scaling solutions. I continuously hone my coding rigor through
              hands-on web development projects and dynamic programming training.
            </p>

            {/* Quick Stats Block */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-2xl font-display font-extrabold text-ms-blue">2nd Year</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono">Curriculum</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <span className="block text-2xl font-display font-extrabold text-ms-blue">7.60</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono">Current CGPA</span>
              </div>
            </div>
          </div>

          {/* Bento Grid layout */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bentoCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950/45 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono font-semibold text-ms-blue uppercase">
                    {card.subtitle}
                  </span>
                  <h5 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
                    {card.title}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
