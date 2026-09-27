import React from 'react';
import { useSync } from '../context/SyncContext';
import { BOB_SYNC_PLAN_MD } from '../data/syncPlanData';
import { FileCode, Sparkles, CheckCircle2, Play, ExternalLink } from 'lucide-react';

export const BobPlanViewer: React.FC = () => {
  const { syncStage, startBobSync } = useSync();

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col h-full font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-200">
            .bob/plans/sync-plan.md
          </span>
          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded">
            IBM Bob 2.0 Plan Mode
          </span>
        </div>

        {syncStage === 'drift_detected' && (
          <button
            onClick={startBobSync}
            className="flex items-center space-x-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-sans font-medium transition-all shadow-md shadow-purple-600/30"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Generate & Execute Plan</span>
          </button>
        )}
      </div>

      {/* Markdown Content Viewer */}
      <div className="flex-1 bg-slate-950 rounded-lg p-4 border border-slate-800/80 overflow-y-auto leading-relaxed text-slate-300 text-xs font-mono scrollbar-thin">
        <div className="space-y-4">
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-lg text-purple-200">
            <div className="flex items-center space-x-2 font-bold text-sm text-white font-sans">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>IBM Bob 2.0 • Plan Mode Autonomous Resolution</span>
            </div>
            <div className="text-[11px] text-purple-300/80 mt-1">
              Deterministic blast radius mapping & subagent orchestration schema.
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase text-slate-400 mb-1">Target Event</h4>
            <p className="text-slate-300">File save on <code>UserController.java</code>. Payload contract delta: <code>firstName -&gt; given_name</code>.</p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase text-slate-400 mb-1">Downstream Blast Radius</h4>
            <ul className="space-y-1 list-disc list-inside text-slate-300">
              <li><code className="text-cyan-400">src/components/UserProfile.tsx</code>: TypeScript interface + JSX render binding</li>
              <li><code className="text-purple-400">docs/api/user-service/api-contract.md</code>: Schema definition and sample payload</li>
              <li><code className="text-emerald-400">tests/e2e/specs/user-e2e.test.ts</code>: Playwright response contract assertion</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase text-slate-400 mb-2">Subagent Delegation Table</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="p-2">Subagent</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Target</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-2 font-semibold text-cyan-300">Subagent 1</td>
                    <td className="p-2 text-slate-300">React UI</td>
                    <td className="p-2 text-slate-400">UserProfile.tsx</td>
                    <td className="p-2 text-emerald-400">Verified</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-purple-300">Subagent 2</td>
                    <td className="p-2 text-slate-300">API Docs</td>
                    <td className="p-2 text-slate-400">api-contract.md</td>
                    <td className="p-2 text-emerald-400">Verified</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-emerald-300">Subagent 3</td>
                    <td className="p-2 text-slate-300">E2E Tests</td>
                    <td className="p-2 text-slate-400">user-e2e.test.ts</td>
                    <td className="p-2 text-emerald-400">Verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>AST AST3-Graph Validation: PASSED</span>
            </span>
            <span>Generated in 180ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
