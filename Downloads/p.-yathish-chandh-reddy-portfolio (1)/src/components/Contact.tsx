import React, { useState } from "react";
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { personalInfo } from "../data";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate Network Latency
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmittedMessage({ ...formData, date: new Date().toLocaleTimeString() });
      
      // Save to LocalStorage to prove state mechanics
      const previousInquiries = JSON.parse(localStorage.getItem("recruiterInquiries") || "[]");
      localStorage.setItem(
        "recruiterInquiries",
        JSON.stringify([...previousInquiries, { ...formData, date: new Date().toISOString() }])
      );

      // Reset Form fields
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400 mb-2">
            Get In Touch
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact Me
          </h3>
          <div className="h-[3px] w-12 bg-ms-blue mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: CONTACT DETAILS & INFO */}
          {/* ========================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h4 className="text-xl font-display font-extrabold text-slate-900 dark:text-white leading-snug">
                Let's discuss internship roles or collaborative coding projects.
              </h4>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                I am actively seeking software engineering and developer internship opportunities (especially Microsoft, cloud networks, and full stack workflows). If you have openings, projects, or just want to chat algorithms, reach out!
              </p>
            </div>

            {/* Coordinates list */}
            <div className="space-y-4">
              <a
                id="contact-coord-email"
                href={`mailto:${personalInfo.email}`}
                className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:border-ms-blue dark:hover:border-ms-blue hover:shadow-sm transition-all"
              >
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-950 text-ms-blue">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-semibold text-slate-400 uppercase">Email Me Directly</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{personalInfo.email}</span>
                </div>
              </a>

              <a
                id="contact-coord-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:border-ms-blue dark:hover:border-ms-blue hover:shadow-sm transition-all"
              >
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-950 text-ms-blue">
                  <Linkedin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-semibold text-slate-400 uppercase">LinkedIn Profile</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">P. Yathish Chandh Reddy</span>
                </div>
              </a>

              <a
                id="contact-coord-github"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80 hover:border-ms-blue dark:hover:border-ms-blue hover:shadow-sm transition-all"
              >
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-950 text-ms-blue">
                  <Github size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-semibold text-slate-400 uppercase">GitHub Profile</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">yathish-chandh-reddy</span>
                </div>
              </a>

              <div className="flex items-center space-x-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-950 text-ms-blue">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="block text-[10px] font-mono font-semibold text-slate-400 uppercase">Location</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{personalInfo.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: RECRUITER CONTACT FORM */}
          {/* ========================================== */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm h-full flex flex-col justify-between">
              
              {!isSuccess ? (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                  <h4 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <MessageSquare size={20} className="text-ms-blue" />
                    <span>Send a Message</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-ms-blue"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                        Your Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="johndoe@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-ms-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-subject" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="Internship opportunity / Coding project"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-ms-blue"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-message" className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Message Body *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Hi Yathish, we reviewed your drawing app and DSA training track..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-ms-blue resize-none"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-ms-blue hover:bg-ms-darkblue text-white py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-ms-blue/15 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Transmission in progress...</span>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div id="contact-success-panel" className="flex flex-col items-center justify-center text-center space-y-6 py-8 animate-fade-in-up">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-800 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircle2 size={36} />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                      Message Received Successfully!
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                      Thank you for reaching out. The message has been logged in your local storage engine. Yathish will receive your notification.
                    </p>
                  </div>

                  {/* Mock Inquiry Receipt display */}
                  <div className="w-full bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/50 dark:border-slate-800 rounded-xl text-left font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="text-ms-blue font-bold">📄 INQUIRY TELEMETRY REPORT:</p>
                    <p><span className="font-bold">Sender:</span> {submittedMessage?.name} ({submittedMessage?.email})</p>
                    <p><span className="font-bold">Subject:</span> {submittedMessage?.subject || "N/A"}</p>
                    <p className="line-clamp-2"><span className="font-bold">Message:</span> "{submittedMessage?.message}"</p>
                    <p className="text-[10px] text-slate-400">Timestamp: {submittedMessage?.date}</p>
                  </div>

                  <button
                    id="contact-send-another-btn"
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    Send another message
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
