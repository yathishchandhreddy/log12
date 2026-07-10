import React from "react";
import { Award, CheckCircle2, ShieldCheck, Cpu, MonitorPlay, Milestone } from "lucide-react";
import { certifications, achievements } from "../data";

export default function CertificationsAchievements() {
  const getCertIcon = (placeholderText: string) => {
    switch (placeholderText) {
      case "AI":
        return <Cpu size={24} className="text-ms-blue dark:text-blue-400" />;
      case "Web":
        return <MonitorPlay size={24} className="text-ms-blue dark:text-blue-400" />;
      default:
        return <Award size={24} className="text-[#0078d4] dark:text-[#50e6ff]" />;
    }
  };

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ========================================== */}
          {/* LEFT SIDE: MILESTONES & ACHIEVEMENTS */}
          {/* ========================================== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400">
                Key Accomplishments
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Achievements & Progress
              </h3>
              <div className="h-[3px] w-8 bg-ms-blue rounded-full" />
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm space-y-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-mono uppercase tracking-wider font-semibold">
                🏁 Track Record of Dedication:
              </p>
              
              <div className="space-y-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 group">
                    <CheckCircle2 size={18} className="text-green-500 dark:text-green-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      {ach}
                    </span>
                  </div>
                ))}
              </div>

              {/* Extra Encouraging Recruiter Quote Block */}
              <div className="mt-8 p-4 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/60 rounded-xl flex items-start space-x-3">
                <Milestone size={24} className="text-ms-blue dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <span className="block text-xs font-mono font-bold text-slate-400">Continuous Growth Metric</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    "Solving challenges consistently on tech channels. Constantly building to improve data structure speeds and modular frontends."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT SIDE: CERTIFICATIONS */}
          {/* ========================================== */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400">
                Credentials verified
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Certifications
              </h3>
              <div className="h-[3px] w-8 bg-ms-blue rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Visual Stamp Card Placeholder */}
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                      {getCertIcon(cert.imagePlaceholderText)}
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono font-semibold text-ms-blue dark:text-blue-400 uppercase tracking-widest">
                        {cert.issuer}
                      </span>
                      <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-ms-blue transition-colors">
                        {cert.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/30 dark:border-slate-800/30">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {cert.date}
                    </span>
                    <a
                      id={`cert-credential-link-${cert.id}`}
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-ms-blue hover:text-ms-darkblue transition-colors"
                    >
                      <span>Verify</span>
                      <ShieldCheck size={12} />
                    </a>
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
