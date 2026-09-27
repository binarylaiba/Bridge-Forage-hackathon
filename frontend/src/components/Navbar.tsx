import React from 'react';
import { useSync } from '../context/SyncContext';
import { ViewMode } from '../types';
import { 
  GitBranch, 
  Activity, 
  Layers, 
  LayoutTemplate, 
  FileText, 
  Sparkles,
  RefreshCw,
  Cpu,
  Package
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    syncStage, 
    viewMode, 
    setViewMode, 
    resetToHealthy, 
    setShowScriptGuide,
    clientBindingField
  } = useSync();

  const getStatusBadge = () => {
    switch (syncStage) {
      case 'healthy':
        return (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>CONTRACTS IN SYNC ({clientBindingField})</span>
          </div>
        );
      case 'drift_detected':
        return (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>DRIFT: EXPECTED "{clientBindingField}"</span>
          </div>
        );
      case 'planning':
        return (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono">
            <Cpu className="w-3 h-3 text-purple-400 animate-spin" />
            <span>BOB PLAN MODE ACTIVE</span>
          </div>
        );
      case 'subagents_running':
        return (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-cyan-300 text-xs font-mono">
            <Activity className="w-3 h-3 text-cyan-400 animate-bounce" />
            <span>3 SUBAGENTS REWRITING</span>
          </div>
        );
      case 'synced':
        return (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AUTO-SYNCED TO "{clientBindingField}"</span>
          </div>
        );
    }
  };

  return (
    <header className="bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-6 py-2.5 flex items-center justify-between">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                BridgeForge
              </span>
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30">
                IBM Bob 2.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              The Cross-Stack Auto-Sync Tool • Product Catalog Sandbox
            </div>
          </div>
        </div>

        {/* Dynamic Engine Status Pill */}
        <div className="hidden sm:block">
          {getStatusBadge()}
        </div>
      </div>

      {/* Middle View Selector */}
      <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'split'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Best for 3-minute video presentation"
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Split Screen</span>
          <span className="text-[10px] bg-blue-700/50 px-1 rounded ml-1 font-mono">Demo</span>
        </button>

        <button
          onClick={() => setViewMode('catalog')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'catalog'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Product Catalog</span>
        </button>

        <button
          onClick={() => setViewMode('visualizer')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'visualizer'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Diff Visualizer</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowScriptGuide(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">3-Min Pitch Guide</span>
        </button>

        <button
          onClick={resetToHealthy}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs transition-all"
          title="Reset Demo State"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
