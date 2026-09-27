import React from 'react';
import { useSync } from '../context/SyncContext';
import { 
  Bot, 
  CheckCircle2, 
  Cpu, 
  ExternalLink, 
  Clock, 
  Flame, 
  Activity, 
  FileCode
} from 'lucide-react';

export const SubagentsMonitor: React.FC = () => {
  const { subagents, syncStage, selectedDiffFile, setSelectedDiffFile } = useSync();

  const getSubagentTargetFilename = (subId: string) => {
    switch (subId) {
      case 'subagent-1': return 'UserProfile.tsx';
      case 'subagent-2': return 'api-contract.md';
      case 'subagent-3': return 'user-e2e.test.ts';
      default: return 'UserProfile.tsx';
    }
  };

  const getSubagentTheme = (index: number) => {
    switch (index) {
      case 0:
        return {
          border: 'border-cyan-500/30',
          bg: 'bg-cyan-950/20',
          accent: 'text-cyan-400',
          bar: 'bg-gradient-to-r from-blue-500 to-cyan-400'
        };
      case 1:
        return {
          border: 'border-purple-500/30',
          bg: 'bg-purple-950/20',
          accent: 'text-purple-400',
          bar: 'bg-gradient-to-r from-purple-500 to-pink-400'
        };
      case 2:
        return {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-950/20',
          accent: 'text-emerald-400',
          bar: 'bg-gradient-to-r from-emerald-500 to-teal-400'
        };
      default:
        return {
          border: 'border-blue-500/30',
          bg: 'bg-blue-950/20',
          accent: 'text-blue-400',
          bar: 'bg-blue-500'
        };
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            IBM Bob 2.0 • Parallel Agent Mode Execution
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center space-x-1">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>3 Subagents Concurrent</span>
          </span>
        </div>
      </div>

      {/* Subagent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {subagents.map((sub, index) => {
          const theme = getSubagentTheme(index);
          const targetFile = getSubagentTargetFilename(sub.id);
          const isSelected = selectedDiffFile === targetFile;
          const isRunning = sub.status === 'running';
          const isDone = sub.status === 'completed' || syncStage === 'synced';

          return (
            <div
              key={sub.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${theme.border} ${theme.bg} ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping-slow" />
                    <span className={`font-mono text-xs font-bold ${theme.accent}`}>
                      {sub.name}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETE</span>
                    </span>
                  ) : isRunning ? (
                    <span className="flex items-center space-x-1 text-[10px] font-mono text-cyan-300 bg-blue-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      <Cpu className="w-3 h-3 animate-spin" />
                      <span>{sub.progress}%</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                      IDLE
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-300 font-medium">
                  {sub.role}
                </div>

                <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">
                  Target: <span className="text-slate-200">{sub.targetFile}</span>
                </div>
              </div>

              {/* Progress Bar & Details */}
              <div className="mt-3 space-y-2">
                {/* Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${theme.bar}`}
                    style={{ width: `${isDone ? 100 : sub.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-[150px]">
                    {isDone ? 'Validation Passed' : isRunning ? sub.currentAction : 'Ready'}
                  </span>
                  <span className="text-slate-300 font-bold shrink-0">
                    {isDone ? '840 tok' : isRunning ? `${sub.tokensPerSec} tok/s` : '0 tok'}
                  </span>
                </div>

                {/* Inspect Diff Button */}
                <button
                  onClick={() => setSelectedDiffFile(targetFile)}
                  className="w-full mt-1.5 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white flex items-center justify-center space-x-1 transition-colors"
                >
                  <FileCode className="w-3 h-3 text-cyan-400" />
                  <span>Inspect Diff in Monaco</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
