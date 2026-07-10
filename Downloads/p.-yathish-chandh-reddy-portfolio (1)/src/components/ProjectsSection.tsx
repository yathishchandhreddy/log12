import React, { useState, useRef, useEffect } from "react";
import { Github, ExternalLink, Sparkles, X, Play, Palette, Search, Map, RefreshCw } from "lucide-react";
import { projects } from "../data";

export default function ProjectsSection() {
  const [activeProjectDemo, setActiveProjectDemo] = useState<string | null>(null);

  // Drawing Canvas state & refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#0078d4"); // Microsoft Blue
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // College Counseling search state
  const [counselingSearch, setCounselingSearch] = useState("");
  const [counselingFilter, setCounselingFilter] = useState("All");

  // Transit Tracker simulation state
  const [transitBuses, setTransitBuses] = useState([
    { id: "Bus 101", route: "Central Station ➔ Technology Park", speed: "42 km/h", eta: 4, coords: { x: 30, y: 40 } },
    { id: "Bus 204", route: "VSB Campus ➔ Downtown Hub", speed: "35 km/h", eta: 12, coords: { x: 65, y: 75 } },
    { id: "Bus 308", route: "Industrial Zone ➔ Airport Express", speed: "55 km/h", eta: 1, coords: { x: 10, y: 85 } },
  ]);
  const [transitLogs, setTransitLogs] = useState<string[]>([]);

  // 1. Drawing Application Interactive Setup
  useEffect(() => {
    if (activeProjectDemo === "drawing-app" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Default brush settings
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [activeProjectDemo]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = isEraser ? "#ffffff" : brushColor;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // 2. College Counselling Data and Filter
  const collegesData = [
    { name: "VSB Engineering College", location: "Karur, Tamil Nadu", rating: "4.5★", courses: ["CSE", "AI & ML", "ECE", "IT"], cutoff: "185.0" },
    { name: "PSG College of Technology", location: "Coimbatore", rating: "4.8★", courses: ["CSE", "IT", "Mechanical", "ECE"], cutoff: "198.5" },
    { name: "Coimbatore Institute of Technology", location: "Coimbatore", rating: "4.6★", courses: ["CSE", "AI & ML", "Chemical"], cutoff: "193.0" },
    { name: "Government College of Technology", location: "Coimbatore", rating: "4.4★", courses: ["CSE", "Civil", "EEE", "ECE"], cutoff: "190.5" },
    { name: "Thiagarajar College of Engineering", location: "Madurai", rating: "4.7★", courses: ["CSE", "AI & ML", "IT", "EEE"], cutoff: "195.0" },
  ];

  const filteredColleges = collegesData.filter((col) => {
    const matchesSearch = col.name.toLowerCase().includes(counselingSearch.toLowerCase()) ||
                          col.location.toLowerCase().includes(counselingSearch.toLowerCase());
    const matchesCourse = counselingFilter === "All" || col.courses.includes(counselingFilter);
    return matchesSearch && matchesCourse;
  });

  // 3. Transit Tracking simulation ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeProjectDemo === "transit-tracking") {
      setTransitLogs(["[SYSTEM] Tracking online...", "[GPS] Satellite lock acquired on buses."]);
      
      interval = setInterval(() => {
        // Randomly update coordinates slightly to simulate live GPS movement
        setTransitBuses((prev) =>
          prev.map((bus) => {
            const movementX = (Math.random() - 0.5) * 4;
            const movementY = (Math.random() - 0.5) * 4;
            const nextX = Math.min(Math.max(bus.coords.x + movementX, 5), 95);
            const nextY = Math.min(Math.max(bus.coords.y + movementY, 5), 95);
            const nextEta = Math.max(bus.eta - (Math.random() > 0.7 ? 1 : 0), 1);
            return {
              ...bus,
              coords: { x: nextX, y: nextY },
              eta: nextEta,
            };
          })
        );

        // Generate logs occasionally
        if (Math.random() > 0.4) {
          const events = [
            "Bus 101 cleared Technology Park signals.",
            "Bus 204 ETA updated due to light traffic.",
            "Bus 308 approaching Airport Terminal 1.",
            "Telemetry ping response: 24ms."
          ];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          setTransitLogs((prev) => [
            `[${new Date().toLocaleTimeString()}] ${randomEvent}`,
            ...prev.slice(0, 4),
          ]);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeProjectDemo]);

  const triggerLiveDemo = (projectId: string) => {
    setActiveProjectDemo(projectId);
  };

  return (
    <section id="projects" className="py-20 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-ms-blue dark:text-blue-400 mb-2">
            My Creations
          </h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Featured Projects
          </h3>
          <div className="h-[3px] w-12 bg-ms-blue mx-auto mt-4 rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {/* Visual Placeholder / Mock Badge */}
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/50 h-40 rounded-xl mb-6 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-ms-blue/10 to-indigo-500/5" />
                  
                  {proj.id === "drawing-app" && (
                    <div className="flex flex-col items-center space-y-2 z-10">
                      <Palette size={40} className="text-ms-blue dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">interactive whiteboard</span>
                    </div>
                  )}

                  {proj.id === "counselling-website" && (
                    <div className="flex flex-col items-center space-y-2 z-10">
                      <Search size={40} className="text-ms-blue dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">admission matcher</span>
                    </div>
                  )}

                  {proj.id === "transit-tracking" && (
                    <div className="flex flex-col items-center space-y-2 z-10">
                      <Map size={40} className="text-ms-blue dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">ai tracking mockup</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-ms-blue uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <h4 className="font-display font-extrabold text-xl text-slate-900 dark:text-slate-50 group-hover:text-ms-blue transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Tech Stack tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-slate-200/40 dark:border-slate-800/40">
                <a
                  id={`project-github-${proj.id}`}
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>

                <button
                  id={`project-demo-btn-${proj.id}`}
                  onClick={() => triggerLiveDemo(proj.id)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-ms-blue hover:bg-ms-darkblue text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-ms-blue/10 cursor-pointer"
                >
                  <Play size={12} className="fill-white" />
                  <span>Interactive Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE PLAYGROUND MODAL PREVIEW FOR EXTRA RECRUITER ENGAGEMENT */}
        {/* ========================================================================= */}
        {activeProjectDemo && (
          <div
            id="interactive-demo-modal"
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {activeProjectDemo === "drawing-app" && "Drawing Application - Interactive Sandbox"}
                    {activeProjectDemo === "counselling-website" && "College Counselling Portal - Search Engine"}
                    {activeProjectDemo === "transit-tracking" && "Transit Tracking System - Concept Map Simulation"}
                  </h4>
                </div>
                <button
                  id="close-demo-modal-btn"
                  onClick={() => setActiveProjectDemo(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Sandbox Screens */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-900">
                
                {/* SCREEN 1: DRAWING APPLICATION */}
                {activeProjectDemo === "drawing-app" && (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between shadow-sm">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Brush Color:</span>
                        {["#0078d4", "#2563eb", "#ea580c", "#16a34a", "#dc2626", "#000000"].map((color) => (
                          <button
                            key={color}
                            id={`color-picker-${color.replace('#', '')}`}
                            onClick={() => {
                              setBrushColor(color);
                              setIsEraser(false);
                            }}
                            className={`w-6 h-6 rounded-full border-2 ${
                              brushColor === color && !isEraser ? "border-slate-800 dark:border-white scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Stroke:</span>
                          <input
                            id="brush-size-input"
                            type="range"
                            min="2"
                            max="20"
                            value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))}
                            className="w-20 accent-ms-blue"
                          />
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{brushSize}px</span>
                        </div>

                        <button
                          id="eraser-toggle-btn"
                          onClick={() => setIsEraser(!isEraser)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            isEraser
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          Eraser
                        </button>

                        <button
                          id="clear-canvas-btn"
                          onClick={clearCanvas}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 shadow-sm"
                        >
                          Clear Canvas
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md flex justify-center">
                      {/* Live Drawing Board Canvas */}
                      <canvas
                        ref={canvasRef}
                        id="interactive-canvas"
                        width={700}
                        height={380}
                        className="bg-white cursor-crosshair max-w-full"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-mono">
                      Draw with your mouse/pointer above. Fully implements HTML5 Canvas API in React!
                    </p>
                  </div>
                )}

                {/* SCREEN 2: COLLEGE COUNSELLING PORTAL */}
                {activeProjectDemo === "counselling-website" && (
                  <div className="space-y-4">
                    {/* Controls */}
                    <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                      <div className="relative w-full sm:w-72">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                          <Search size={16} />
                        </span>
                        <input
                          id="counseling-search-input"
                          type="text"
                          placeholder="Search college or location..."
                          value={counselingSearch}
                          onChange={(e) => setCounselingSearch(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-ms-blue"
                        />
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <span className="text-xs font-mono text-slate-400 flex items-center whitespace-nowrap">Filter Course:</span>
                        <select
                          id="counseling-filter-select"
                          value={counselingFilter}
                          onChange={(e) => setCounselingFilter(e.target.value)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-sm"
                        >
                          <option value="All">All Courses</option>
                          <option value="CSE">CSE</option>
                          <option value="AI & ML">AI & ML</option>
                          <option value="IT">IT</option>
                        </select>
                      </div>
                    </div>

                    {/* Results Display */}
                    <div className="space-y-3">
                      {filteredColleges.length > 0 ? (
                        filteredColleges.map((col, idx) => (
                          <div
                            key={idx}
                            className="bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm"
                          >
                            <div className="space-y-1">
                              <h5 className="font-display font-bold text-base text-slate-900 dark:text-white">
                                {col.name}
                              </h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{col.location}</p>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {col.courses.map((course) => (
                                  <span
                                    key={course}
                                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-[10px] rounded font-mono text-slate-600 dark:text-slate-400"
                                  >
                                    {course}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-3 sm:mt-0 text-left sm:text-right flex sm:flex-col gap-4 sm:gap-1.5 justify-between w-full sm:w-auto">
                              <div>
                                <span className="text-xs font-mono text-slate-400 block">TNEA Cutoff</span>
                                <span className="font-mono text-sm font-bold text-ms-blue dark:text-blue-400">{col.cutoff}</span>
                              </div>
                              <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 rounded-md">
                                {col.rating} Ratings
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white dark:bg-slate-950 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                          No matching colleges found. Try refining search query.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SCREEN 3: PUBLIC TRANSPORT TRACKING */}
                {activeProjectDemo === "transit-tracking" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Simulated Radar/Map representation */}
                    <div className="md:col-span-8 bg-slate-950 rounded-2xl h-80 relative border border-slate-800 overflow-hidden shadow-md">
                      {/* Grid background overlay */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0078d4_1px,transparent_1px),linear-gradient(to_bottom,#0078d4_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      {/* Mock Bus points */}
                      {transitBuses.map((bus, idx) => (
                        <div
                          key={bus.id}
                          className="absolute w-5 h-5 bg-ms-blue text-white rounded-full flex items-center justify-center font-mono font-bold text-[9px] shadow-lg shadow-ms-blue/50 transition-all duration-1000"
                          style={{ left: `${bus.coords.x}%`, top: `${bus.coords.y}%` }}
                          title={`${bus.id}: ${bus.route}`}
                        >
                          🚌
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 text-slate-200 text-[8px] font-mono px-1 rounded">
                            {bus.id} ({bus.eta}m)
                          </span>
                        </div>
                      ))}

                      {/* Map info bar */}
                      <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 text-slate-200 p-2 rounded-lg font-mono text-[9px] space-y-0.5">
                        <p className="text-xs text-ms-blue font-bold">📡 SIMULATION MAP</p>
                        <p>Status: LIVE FEED ACTIVE</p>
                        <p>Bus Fleet Target: 3 Registered</p>
                      </div>
                    </div>

                    {/* Simulation Console log */}
                    <div className="md:col-span-4 flex flex-col gap-3">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between font-mono text-xs">
                        <div className="space-y-2">
                          <p className="text-xs text-green-400 font-bold border-b border-slate-800 pb-1.5 flex justify-between items-center">
                            <span>TELEMETRY FEED</span>
                            <RefreshCw size={11} className="animate-spin text-green-400" />
                          </p>
                          <div className="space-y-1.5 max-h-52 overflow-y-auto text-[10px] text-slate-400">
                            {transitLogs.map((log, idx) => (
                              <p key={idx}>{log}</p>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 space-y-2 text-[10px] text-slate-400">
                          {transitBuses.map((bus) => (
                            <div key={bus.id} className="flex justify-between">
                              <span className="text-white font-bold">{bus.id}</span>
                              <span>Speed: {bus.speed}</span>
                              <span className="text-ms-blue">ETA: {bus.eta}m</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end space-x-3">
                <button
                  id="modal-close-action-btn"
                  onClick={() => setActiveProjectDemo(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-lg"
                >
                  Close Sandbox
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
