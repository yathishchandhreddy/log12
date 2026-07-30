export type NavigationTab = "explorer" | "dashboard" | "report" | "health";

export type RiskLevel = "NOMINAL" | "ELEVATED" | "HIGH" | "CRITICAL";

export interface LogMetrics {
  linesParsed: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  traceCount: number;
  activeClusters: number;
  clusterNames?: string[];
  riskLevel: RiskLevel;
}

export interface RecentSession {
  id: string;
  title: string;
  time: string;
  filename: string;
  risk: RiskLevel;
  content: string;
  reportMarkdown?: string;
}

export interface AnalysisResult {
  reportMarkdown: string;
  aiUsed: boolean;
  filename: string;
  timestampRange: { start: string; end: string };
  metrics: LogMetrics;
}

export interface SystemSettings {
  autoAnalyzeOnPaste: boolean;
  riskThreshold: RiskLevel;
  aiTemperature: number;
  defaultFilename: string;
  memoryUsagePercent: number;
  activeClusterCount: number;
}
