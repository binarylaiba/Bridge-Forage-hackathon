import React, { useRef, useEffect } from 'react';
import { useSync } from '../context/SyncContext';
import { Terminal, Shield, Cpu, RefreshCw, Trash2 } from 'lucide-react';

export const ActivityLogTerminal: React.FC = () => {
  const { logs, triggerBackendDrift } = useSync();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'WATCHDOG':
        return <span className="text-amber-400 bg-amber-950/60 px-1 rounded">[WATCHDOG]</span>;
      case 'BOB_CORE':
        return <span className="text-purple-400 bg-purple-950/60 px-1 rounded">[IBM_BOB]</span>;
      case 'PLAN_MODE':
        return <span className="text-cyan-400 bg-cyan-950/60 px-1 rounded">[PLAN_MODE]</span>;
      case 'SUBAGENT_1':
        return <span className="text-blue-400 bg-blue-950/60 px-1 rounded">[SUBAGENT_1]</span>;
      case 'SUBAGENT_2':
        return <span className="text-purple-300 bg-purple-950/60 px-1 rounded">[SUBAGENT_2]</span>;
      case 'SUBAGENT_3':
        return <span className="text-emerald-400 bg-emerald-950/60 px-1 rounded">[SUBAGENT_3]</span>;
      default:
        return <span className="text-slate-400 bg-slate-800 px-1 rounded">[SYSTEM]</span>;
    }
  };

  const getTextColor = (level: string) => {
    switch (level) {
      case 'warn': return 'text-red-300';
      case 'success': return 'text-emerald-300';
      case 'bob': return 'text-cyan-200';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-full font-mono text-xs overflow-hidden shadow-xl">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200 text-xs">
            BridgeForge Orchestrator Console
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow ml-2" />
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
          <span>Python 3.14 Watchdog • PID 4821</span>
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-1.5 scrollbar-thin bg-[#0a0e17]">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2 leading-relaxed hover:bg-slate-900/40 p-0.5 rounded">
            <span className="text-slate-600 text-[10px] shrink-0 font-mono select-none">
              {log.timestamp}
            </span>
            <span className="text-[10px] shrink-0 font-mono">
              {getSourceBadge(log.source)}
            </span>
            <span className={`text-xs break-all ${getTextColor(log.level)}`}>
              {log.text}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
