export interface Product {
  id: string;
  title?: string;
  productName?: string;
  price: number;
}

export type ProductInput = {
  title?: string;
  productName?: string;
  price: number;
};

export type ActiveContractField = 'title' | 'productName';

export type SyncStage = 
  | 'healthy'           // Baseline: frontend and backend both match
  | 'drift_detected'   // Breaking change: backend renamed field, frontend broke
  | 'planning'         // IBM Bob 2.0 Plan Mode running
  | 'subagents_running'// Parallel subagents rewriting files
  | 'synced';          // Successfully synchronized

export type ViewMode = 'split' | 'catalog' | 'visualizer';

export interface SubagentState {
  id: string;
  name: string;
  role: string;
  targetFile: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  tokenCount: number;
  tokensPerSec: number;
  currentAction: string;
  logs: string[];
}

export interface FileDiffItem {
  id: string;
  filename: string;
  displayPath: string;
  language: 'javascript' | 'typescript' | 'markdown' | 'json';
  layer: 'Backend' | 'Frontend' | 'Documentation' | 'OpenAPI';
  subagentName: string;
  impactLevel: 'Source' | 'High' | 'Medium';
  beforeCode: string;
  afterCode: string;
  summary: string;
  linesAdded: number;
  linesRemoved: number;
}

export interface DemoStepItem {
  index: number;
  timeCode: string;
  title: string;
  subtitle: string;
  scriptNarrative: string;
  keyAction: string;
  syncStage: SyncStage;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  source: 'SYSTEM' | 'BACKEND' | 'WATCHER' | 'WATCHDOG' | 'BOB_CORE' | 'PLAN_MODE' | 'SUBAGENT_1' | 'SUBAGENT_2' | 'SUBAGENT_3';
  level: 'info' | 'warn' | 'success' | 'bob';
  text: string;
}

export interface BlastRadiusNode {
  id: string;
  label: string;
  type: 'source' | 'target';
  layer: string;
  status: 'clean' | 'drift' | 'fixing' | 'synced';
  details: string;
}
