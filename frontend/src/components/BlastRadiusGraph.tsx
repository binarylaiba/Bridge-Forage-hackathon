import React from 'react';
import { useSync } from '../context/SyncContext';
import { BLAST_RADIUS_NODES } from '../data/syncPlanData';
import { 
  Network, 
  FileCode2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  ArrowRight,
  Database
} from 'lucide-react';

export const BlastRadiusGraph: React.FC = () => {
  const { syncStage, selectedDiffFile, setSelectedDiffFile } = useSync();

  const isDrift = syncStage === 'drift_detected';
  const isFixing = syncStage === 'planning' || syncStage === 'subagents_running';
  const isSynced = syncStage === 'synced';

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'backend':
        return <FileCode2 className="w-5 h-5 text-amber-400" />;
      case 'frontend':
        return <FileCode2 className="w-5 h-5 text-blue-400" />;
      case 'docs':
        return <FileText className="w-5 h-5 text-purple-400" />;
      case 'openapi':
        return <Database className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileCode2 className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTargetFilename = (id: string) => {
    switch (id) {
      case 'frontend': return 'frontend/src/api/products.ts';
      case 'docs': return 'docs/API.md';
      case 'openapi': return 'docs/openapi.json';
      case 'backend': return 'backend/routes/products.js';
      default: return 'frontend/src/api/products.ts';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            BridgeForge • Blast Radius Topology
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Express /products Schema
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            3 Consumers
          </span>
        </div>
      </div>

      {/* Visual Topology Diagram */}
      <div className="py-4 my-2 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Source Node: Backend */}
          <div 
            onClick={() => setSelectedDiffFile('backend/routes/products.js')}
            className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
              selectedDiffFile === 'backend/routes/products.js'
                ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                Delta Origin
              </span>
              {getNodeIcon('backend')}
            </div>
            <div className="font-semibold text-xs text-slate-100 font-mono truncate">
              products.js
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Express Route Handler
            </div>
            <div className="mt-2 text-[10px] font-mono text-amber-300/90 bg-amber-950/50 px-2 py-1 rounded border border-amber-500/30">
              {isDrift || isFixing || isSynced ? 'Δ title -> productName' : 'Baseline Contract'}
            </div>
          </div>

          {/* Target Nodes: 3 Consumers */}
          {BLAST_RADIUS_NODES.filter(n => n.type === 'target').map((node) => {
            const filename = getTargetFilename(node.id);
            const isSelected = selectedDiffFile === filename;

            let statusColor = 'text-slate-400 border-slate-800 bg-slate-950';
            let statusLabel = 'Clean';
            let statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;

            if (isDrift) {
              statusColor = 'text-red-300 border-red-500/40 bg-red-950/20';
              statusLabel = 'Contract Broken';
              statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
            } else if (isFixing) {
              statusColor = 'text-cyan-300 border-cyan-500/40 bg-blue-950/30';
              statusLabel = 'Bob Syncing...';
              statusIcon = <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
            } else if (isSynced) {
              statusColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/20';
              statusLabel = 'Auto-Synced';
              statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            }

            return (
              <div
                key={node.id}
                onClick={() => setSelectedDiffFile(filename)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-500/10'
                    : 'hover:border-slate-700'
                } ${statusColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-semibold">
                    {node.layer}
                  </span>
                  {getNodeIcon(node.id)}
                </div>
                <div className="font-semibold text-xs text-slate-100 font-mono truncate">
                  {node.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {node.details}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-slate-800/60">
                  <div className="flex items-center space-x-1">
                    {statusIcon}
                    <span>{statusLabel}</span>
                  </div>
                  <span className="text-slate-500 hover:text-blue-400 flex items-center">
                    Diff <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block">AFFECTED REPOSITORIES</span>
          <span className="text-slate-200 font-bold">1 Monorepo / 3 Targets</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block">AST CONFLICTS</span>
          <span className="text-cyan-400 font-bold">3 Destructure Points</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
          <span className="text-slate-500 text-[10px] block">ESTIMATED BOB REPAIR</span>
          <span className="text-emerald-400 font-bold">~2.6 Seconds</span>
        </div>
      </div>
    </div>
  );
};
