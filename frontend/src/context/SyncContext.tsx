import React, { createContext, useContext, useState, useRef } from 'react';
import { SyncStage, ViewMode, SubagentState, LogMessage, DemoStepItem, ActiveContractField } from '../types';
import { DEMO_STEPS } from '../data/demoNarrative';

interface SyncContextType {
  syncStage: SyncStage;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentStepIndex: number;
  currentStep: DemoStepItem;
  subagents: SubagentState[];
  logs: LogMessage[];
  selectedDiffFile: string;
  setSelectedDiffFile: (file: string) => void;
  clientBindingField: ActiveContractField;
  setClientBindingField: (field: ActiveContractField) => void;
  autoPlay: boolean;
  triggerBackendDrift: () => void;
  startBobSync: () => void;
  resetToHealthy: () => void;
  goToDemoStep: (index: number) => void;
  toggleAutoPlay: () => void;
  showScriptGuide: boolean;
  setShowScriptGuide: (show: boolean) => void;
}

const INITIAL_SUBAGENTS: SubagentState[] = [
  {
    id: 'subagent-1',
    name: 'Subagent 1: React UI',
    role: 'Frontend UI Specialist',
    targetFile: 'frontend/src/api/products.ts',
    status: 'idle',
    progress: 0,
    tokenCount: 0,
    tokensPerSec: 0,
    currentAction: 'Waiting for plan authorization...',
    logs: []
  },
  {
    id: 'subagent-2',
    name: 'Subagent 2: API Docs',
    role: 'Documentation Synchronizer',
    targetFile: 'docs/API.md',
    status: 'idle',
    progress: 0,
    tokenCount: 0,
    tokensPerSec: 0,
    currentAction: 'Waiting for plan authorization...',
    logs: []
  },
  {
    id: 'subagent-3',
    name: 'Subagent 3: OpenAPI Spec',
    role: 'Swagger 3.0 Contract Author',
    targetFile: 'docs/openapi.json',
    status: 'idle',
    progress: 0,
    tokenCount: 0,
    tokensPerSec: 0,
    currentAction: 'Waiting for plan authorization...',
    logs: []
  }
];

const INITIAL_LOGS: LogMessage[] = [
  {
    id: 'log-1',
    timestamp: '00:00:01',
    source: 'SYSTEM',
    level: 'info',
    text: 'BridgeForge Orchestrator online. Workspace: Bridge-Forage-hackathon'
  },
  {
    id: 'log-2',
    timestamp: '00:00:02',
    source: 'BACKEND',
    level: 'info',
    text: 'Express backend listening on http://localhost:3001. Swagger UI at /api-docs'
  },
  {
    id: 'log-3',
    timestamp: '00:00:03',
    source: 'WATCHER',
    level: 'info',
    text: 'Chokidar watcher active on backend/routes/products.js (prompt: update-docs.md)'
  }
];

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncStage, setSyncStage] = useState<SyncStage>('healthy');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [subagents, setSubagents] = useState<SubagentState[]>(INITIAL_SUBAGENTS);
  const [logs, setLogs] = useState<LogMessage[]>(INITIAL_LOGS);
  const [selectedDiffFile, setSelectedDiffFile] = useState<string>('frontend/src/api/products.ts');
  const [clientBindingField, setClientBindingField] = useState<ActiveContractField>('title');
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [showScriptGuide, setShowScriptGuide] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<number | null>(null);

  const addLog = (source: LogMessage['source'], level: LogMessage['level'], text: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        source,
        level,
        text
      }
    ]);
  };

  const triggerBackendDrift = () => {
    setSyncStage('drift_detected');
    setClientBindingField('title'); // Client expects title
    setCurrentStepIndex(2);
    addLog('WATCHDOG', 'warn', 'Change detected: backend/routes/products.js ("title" -> "productName")');
    addLog('BACKEND', 'warn', 'API CONTRACT DRIFT DETECTED: POST /api/products returns "productName" instead of "title"');
    addLog('SYSTEM', 'warn', 'React ProductList broken: item.title evaluated to undefined');
  };

  const startBobSync = () => {
    setSyncStage('planning');
    setCurrentStepIndex(3);
    addLog('BOB_CORE', 'bob', 'IBM Bob 2.0 executing Plan Mode (/plan)...');
    addLog('PLAN_MODE', 'bob', 'Generated .bob/plans/sync-plan.md (Blast Radius: products.ts, API.md, openapi.json)');

    setTimeout(() => {
      setSyncStage('subagents_running');
      addLog('BOB_CORE', 'bob', 'Launching 3 parallel subagents to repair downstream consumers...');

      setSubagents((prev) =>
        prev.map((sub) => ({
          ...sub,
          status: 'running',
          progress: 10,
          tokenCount: 50,
          tokensPerSec: 130 + Math.floor(Math.random() * 40),
          currentAction: `Updating ${sub.targetFile}...`
        }))
      );

      let currentProgress = 15;
      const interval = setInterval(() => {
        currentProgress += 14;

        setSubagents((prev) =>
          prev.map((sub, idx) => {
            const p = Math.min(100, currentProgress + (idx * 3));
            let action = sub.currentAction;
            let status: SubagentState['status'] = 'running';

            if (p > 30 && p < 75) {
              if (idx === 0) action = 'Rewriting frontend Product interface and JSX bindings...';
              if (idx === 1) action = 'Overwriting docs/API.md request/response tables...';
              if (idx === 2) action = 'Updating docs/openapi.json schemas for Swagger UI...';
            } else if (p >= 75 && p < 100) {
              action = 'Validating schema compatibility...';
            } else if (p >= 100) {
              action = 'File successfully rewritten and committed.';
              status = 'completed';
            }

            return {
              ...sub,
              status,
              progress: p,
              tokenCount: Math.min(840, Math.floor(p * 8.4)),
              tokensPerSec: p >= 100 ? 0 : 140 + Math.floor(Math.random() * 20),
              currentAction: action
            };
          })
        );

        if (currentProgress >= 100) {
          clearInterval(interval);
          completeSync();
        }
      }, 350);
    }, 1200);
  };

  const completeSync = () => {
    setSyncStage('synced');
    setClientBindingField('productName'); // Client seamlessly synced to productName!
    setCurrentStepIndex(4);
    addLog('SUBAGENT_1', 'success', 'frontend/src/api/products.ts updated to "productName". React UI restored.');
    addLog('SUBAGENT_2', 'success', 'docs/API.md regenerated with current schema.');
    addLog('SUBAGENT_3', 'success', 'docs/openapi.json updated. Swagger UI now live at /api-docs.');
    addLog('BOB_CORE', 'success', 'ALL DOWNSTREAM CONSUMERS AUTO-SYNCED IN 2.6s. Zero downtime!');
  };

  const resetToHealthy = () => {
    setSyncStage('healthy');
    setClientBindingField('productName');
    setCurrentStepIndex(1);
    setSubagents(INITIAL_SUBAGENTS);
    setLogs(INITIAL_LOGS);
    setAutoPlay(false);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
  };

  const goToDemoStep = (index: number) => {
    setCurrentStepIndex(index);
    if (index === 0 || index === 1) {
      setSyncStage('healthy');
      setClientBindingField('productName');
      setSubagents(INITIAL_SUBAGENTS);
    } else if (index === 2) {
      triggerBackendDrift();
    } else if (index === 3) {
      startBobSync();
    } else if (index === 4) {
      completeSync();
    }
  };

  const toggleAutoPlay = () => {
    if (autoPlay) {
      setAutoPlay(false);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    } else {
      setAutoPlay(true);
      resetToHealthy();
      autoPlayTimerRef.current = window.setTimeout(() => {
        triggerBackendDrift();
        autoPlayTimerRef.current = window.setTimeout(() => {
          startBobSync();
        }, 3500);
      }, 3000);
    }
  };

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];

  return (
    <SyncContext.Provider
      value={{
        syncStage,
        viewMode,
        setViewMode,
        currentStepIndex,
        currentStep,
        subagents,
        logs,
        selectedDiffFile,
        setSelectedDiffFile,
        clientBindingField,
        setClientBindingField,
        autoPlay,
        triggerBackendDrift,
        startBobSync,
        resetToHealthy,
        goToDemoStep,
        toggleAutoPlay,
        showScriptGuide,
        setShowScriptGuide
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
