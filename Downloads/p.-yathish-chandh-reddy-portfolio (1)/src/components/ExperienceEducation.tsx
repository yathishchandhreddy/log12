import React from "react";
import { GraduationCap, Briefcase, Calendar, MapPin, Award } from "lucide-react";
import { educationHistory, experiences } from "../data";

export default function ExperienceEducation() {
  return (
    <section id="experience" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: PROFESSIONAL EXPERIENCE */}
          {/* ========================================== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400">
                Industry Exposure
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Work Experience
              </h3>
              <div className="h-[3px] w-8 bg-ms-blue rounded-full" />
            </div>

            <div className="space-y-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
                >
                  {/* Visual Accent Tab */}
                  <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-ms-blue" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white group-hover:text-ms-blue transition-colors">
                        {exp.role}
                      </h4>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-ms-blue dark:text-blue-400">
                        <Calendar size={12} />
                        {exp.duration}
                      </span>
                      <span className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />
                        Remote Trainee
                      </span>
                    </div>
                  </div>

                  <ul className="list-none space-y-3 mt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {exp.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-ms-blue mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: EDUCATION TIMELINE */}
          {/* ========================================== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400">
                Academic Background
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Education
              </h3>
              <div className="h-[3px] w-8 bg-ms-blue rounded-full" />
            </div>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 sm:pl-8 space-y-8">
              {educationHistory.map((edu) => (
                <div key={edu.id} className="relative group">
                  
                  {/* Timeline bullet */}
                  <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 bg-white dark:bg-slate-950 border-2 border-ms-blue w-6 h-6 rounded-full flex items-center justify-center shadow-sm group-hover:bg-ms-blue transition-colors">
                    <GraduationCap size={12} className="text-ms-blue group-hover:text-white transition-colors" />
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                      <div>
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                          {edu.institution}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {edu.degree}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end text-right">
                        <span className="inline-block px-2.5 py-1 bg-blue-50 dark:bg-slate-800 text-ms-blue dark:text-blue-400 text-xs font-mono font-bold rounded-lg border border-blue-100/40 dark:border-slate-700">
                          {edu.grade}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-mono font-semibold pt-3 flex items-center gap-1.5">
                      <Calendar size={12} />
                      {edu.duration}
                    </p>

                    {edu.details && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                        {edu.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
