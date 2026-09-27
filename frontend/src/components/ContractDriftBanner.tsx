import React from 'react';
import { ActiveContractField } from '../types';
import { AlertTriangle, CheckCircle2, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';

interface ContractDriftBannerProps {
  clientBindingField: ActiveContractField;
  backendField: 'title' | 'productName' | 'unknown';
  onAutoSync: () => void;
  onReset: () => void;
  isSyncing: boolean;
}

export const ContractDriftBanner: React.FC<ContractDriftBannerProps> = ({
  clientBindingField,
  backendField,
  onAutoSync,
  onReset,
  isSyncing
}) => {
  const isDrift = backendField !== 'unknown' && clientBindingField !== backendField;

  if (isDrift) {
    return (
      <div className="mb-4 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs shadow-lg pulse-glow-red">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-300 text-sm">
                API Contract Drift Detected: <code>{clientBindingField}</code> → <code>{backendField}</code>
              </div>
              <p className="mt-1 text-slate-300">
                Backend <code>/api/products</code> returned <code>"{backendField}"</code>, but React frontend component is hardcoded to render <code>item.{clientBindingField}</code>.
              </p>
              <div className="mt-2 text-[11px] font-mono text-red-300 bg-red-950/70 p-2 rounded border border-red-800/60 inline-block">
                Missing property error: <code>item.{clientBindingField} === undefined</code>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <button
              onClick={onAutoSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-600/40 transition-all pulse-glow-blue"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isSyncing ? 'IBM Bob Syncing...' : 'Auto-Sync via Bob 2.0'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between font-mono">
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>API Contract in Sync: Backend & React client both use <code>"{clientBindingField}"</code></span>
      </div>
      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Vite Proxy: /api → :3001
        </span>
      </div>
    </div>
  );
};
