import React, { useState } from "react";
import { AnalysisResult } from "../types";
import { Copy, Check, Download, AlertOctagon, ShieldAlert, Sparkles, Terminal, FileText, Share2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface IncidentReportViewProps {
  result: AnalysisResult | null;
  onBackToExplorer: () => void;
  rawLogContent: string;
}

export const IncidentReportView: React.FC<IncidentReportViewProps> = ({
  result,
  onBackToExplorer,
  rawLogContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  if (!result) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-10 rounded-2xl text-center max-w-lg">
          <div className="w-16 h-16 rounded-full bg-[#adc6ff]/10 text-[#adc6ff] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">psychology</span>
          </div>
          <h3 className="font-headline text-3xl text-white mb-2">No Incident Report Active</h3>
          <p className="font-body text-sm text-[#c1c6d7] mb-6">
            Paste your log output in the Log Explorer or choose a recent scenario session to generate an AI SRE report.
          </p>
          <button
            onClick={onBackToExplorer}
            className="px-6 py-3 bg-[#adc6ff] text-[#002e69] font-body text-xs font-bold rounded-full uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
          >
            Go to Log Explorer
          </button>
        </div>
      </div>
    );
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(result.reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([result.reportMarkdown], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `incident-report-${result.filename.replace(/\.[^/.]+$/, "")}-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyCodeBlock = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Process markdown into structured sections for rich interactive rendering
  const renderFormattedMarkdown = (markdown: string) => {
    // Split lines
    const lines = markdown.split("\n");
    const renderedElements: React.ReactNode[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeIndex = 0;

    lines.forEach((line, i) => {
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Closing code block
          const codeString = currentCodeBlock.join("\n");
          const idx = codeIndex++;
          renderedElements.push(
            <div key={`code-${i}`} className="my-4 relative group">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => copyCodeBlock(codeString, idx)}
                  className="px-3 py-1 rounded bg-[#222a3d] hover:bg-[#2d3449] text-xs font-mono text-[#adc6ff] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCodeIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-[#060e20] border border-white/10 rounded-xl p-4 font-code text-xs md:text-sm text-[#adc6ff] overflow-x-auto leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          currentCodeBlock = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        currentCodeBlock.push(line);
        return;
      }

      // Headers
      if (line.startsWith("# ")) {
        renderedElements.push(
          <div key={`h1-${i}`} className="mb-6 pb-4 border-b border-white/10">
            <span className="text-xs font-body font-semibold text-[#adc6ff] tracking-widest uppercase block mb-1">
              INCIDENT REPORT SUMMARY
            </span>
            <h1 className="font-headline text-3xl md:text-4xl text-white font-light">
              {line.replace("# ", "")}
            </h1>
          </div>
        );
      } else if (line.startsWith("## ")) {
        const title = line.replace("## ", "");
        renderedElements.push(
          <div key={`h2-${i}`} className="mt-8 mb-3 flex items-center gap-2">
            <div className="w-2 h-5 rounded bg-[#4b8eff]"></div>
            <h2 className="font-headline text-xl md:text-2xl text-[#d8e2ff]">
              {title}
            </h2>
          </div>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        const content = line.replace(/^[-*]\s+/, "");
        renderedElements.push(
          <li key={`li-${i}`} className="font-body text-sm md:text-base text-[#c1c6d7] ml-4 mb-2 leading-relaxed list-disc">
            {content}
          </li>
        );
      } else if (/^\d+\.\s+/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, "");
        renderedElements.push(
          <div key={`num-${i}`} className="flex items-start gap-3 my-2 p-3 rounded-lg bg-[#171f33]/40 border border-white/5">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#adc6ff]/20 text-[#adc6ff] font-code text-xs flex items-center justify-center font-bold">
              {line.match(/^\d+/)?.[0]}
            </span>
            <span className="font-body text-sm md:text-base text-[#dae2fd] leading-relaxed pt-0.5">
              {content}
            </span>
          </div>
        );
      } else if (line.trim().length > 0) {
        renderedElements.push(
          <p key={`p-${i}`} className="font-body text-sm md:text-base text-[#c1c6d7] mb-3 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return renderedElements;
  };

  const risk = result.metrics.riskLevel;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-20 flex flex-col items-center">
      {/* Top Bar Navigation & Actions */}
      <div className="w-full mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <button
          onClick={onBackToExplorer}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#171f33] border border-white/10 text-[#c1c6d7] hover:text-white hover:border-[#adc6ff]/30 transition-all text-xs font-body uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Terminal</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#222a3d] border border-white/10 text-[#adc6ff] hover:bg-[#2d3449] transition-all text-xs font-body uppercase tracking-wider cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied Markdown" : "Copy Report"}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#adc6ff] text-[#002e69] font-bold hover:bg-white transition-all text-xs font-body uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(173,198,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* Main Report Layout */}
      <div className="w-full grid grid-cols-12 gap-8">
        {/* Left Column: Markdown Report Output (8 columns) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="glass-panel-deep rounded-2xl p-6 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-6 text-xs font-code text-[#8b90a0] border-b border-white/5 pb-3">
              <span>SOURCE: {result.filename}</span>
              <span>PARSED {result.metrics.linesParsed} LINES</span>
            </div>

            <div className="prose prose-invert max-w-none">
              {renderFormattedMarkdown(result.reportMarkdown)}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Summary & Raw Logs Inspector (4 columns) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Severity Overview Card */}
          <div className="glass-panel rounded-2xl p-6 border-l-4 border-[#adc6ff]">
            <span className="font-body text-xs font-semibold text-[#8b90a0] tracking-widest block mb-3 uppercase">
              SEVERITY EVALUATION
            </span>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-4 py-1.5 rounded-full font-code text-xs font-bold tracking-wider uppercase ${
                  risk === "CRITICAL"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : risk === "HIGH"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : risk === "ELEVATED"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {risk} SEVERITY
              </span>
              <span className="text-xs text-[#8b90a0]">
                {result.aiUsed ? "AI Studio Gemini Model" : "Rule Engine"}
              </span>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-[#c1c6d7]">
              <div className="flex justify-between">
                <span>Error Lines:</span>
                <span className="font-code text-red-400 font-bold">{result.metrics.errorCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Warning Lines:</span>
                <span className="font-code text-yellow-400 font-bold">{result.metrics.warnCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Clusters:</span>
                <span className="font-code text-[#68d3ff]">{result.metrics.activeClusters}</span>
              </div>
            </div>
          </div>

          {/* Quick Raw Log Inspector */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-[380px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-xs font-semibold text-[#8b90a0] tracking-widest uppercase">
                  RAW LOG EXCERPT
                </span>
                <span className="text-[11px] font-code text-[#adc6ff]">Read-Only</span>
              </div>

              <div className="bg-[#060e20] border border-white/5 rounded-xl p-4 font-code text-[11px] text-[#adc6ff]/80 h-[280px] overflow-y-auto leading-relaxed scrollbar-thin">
                <pre>{rawLogContent || "No raw log content available."}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
