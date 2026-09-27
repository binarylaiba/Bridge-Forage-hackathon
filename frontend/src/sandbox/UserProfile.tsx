import React from 'react';
import { useSync } from '../context/SyncContext';
import { AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw, Cpu, UserCheck } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { syncStage, triggerBackendDrift, startBobSync } = useSync();

  // Simulated backend response data based on sync state
  const isHealthy = syncStage === 'healthy';
  const isBroken = syncStage === 'drift_detected' || syncStage === 'planning' || syncStage === 'subagents_running';
  const isSynced = syncStage === 'synced';

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Contract Status Banner */}
      {isHealthy && (
        <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>API Contract in Sync: <code>GET /api/v1/users/101</code></span>
          </div>
          <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">HTTP 200 OK</span>
        </div>
      )}

      {isBroken && (
        <div className="mb-4 p-4 rounded-xl bg-red-950/50 border border-red-500/60 text-red-200 text-sm pulse-glow-red">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-300 text-base">
                ⚠️ API Contract Drift Detected!
              </div>
              <p className="mt-1 text-xs text-red-200/90 font-mono">
                TypeError: Cannot read properties of undefined (reading 'firstName')
              </p>
              <div className="mt-2 text-xs bg-red-950/80 p-2.5 rounded border border-red-800/60 font-mono space-y-1">
                <div>Backend payload sent: <code className="text-amber-300">"given_name": "Alex"</code></div>
                <div>Component expected: <code className="text-red-400">"firstName": string</code></div>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={startBobSync}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center space-x-1.5 shadow-md shadow-blue-900/50 transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Launch IBM Bob 2.0 Auto-Sync</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSynced && (
        <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-300 text-sm">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Auto-Repaired via <strong>IBM Bob Subagent 1</strong></span>
          </div>
          <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded text-cyan-300 font-mono">
            user.given_name binding active
          </span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className={`relative bg-slate-900/90 rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xl ${
        isBroken 
          ? 'border-red-500/50 bg-slate-900/95 ring-1 ring-red-500/30' 
          : isSynced 
          ? 'border-cyan-500/50 ring-1 ring-cyan-500/30' 
          : 'border-slate-800'
      }`}>
        {/* Card Header Background */}
        <div className={`h-24 transition-colors duration-500 ${
          isBroken 
            ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950' 
            : isSynced 
            ? 'bg-gradient-to-r from-blue-900/80 via-indigo-900/60 to-cyan-900/80' 
            : 'bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950'
        }`}>
          <div className="p-3 flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${isBroken ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>{isBroken ? 'COMPONENT CRASH' : 'PROFILE SERVICE'}</span>
            </span>
            <span>ID: USR-101</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-1 shadow-xl ${
                isBroken ? 'from-red-600 to-amber-500' : ''
              }`}>
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                    alt="Alex Johnson"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isBroken ? 'opacity-30 grayscale' : 'opacity-90'}`}
                  />
                </div>
              </div>
              <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                isBroken ? 'bg-red-500' : 'bg-emerald-400'
              }`} />
            </div>

            {/* Quick Action in Sandbox */}
            {isHealthy && (
              <button
                onClick={triggerBackendDrift}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
                title="Simulates saving UserController.java with given_name rename"
              >
                <RefreshCw className="w-3 h-3 text-amber-400" />
                <span>Simulate Backend Save</span>
              </button>
            )}
          </div>

          {/* User Name & Details */}
          <div className="space-y-1">
            {isBroken ? (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                    undefined
                  </span>
                  <span className="text-2xl font-bold text-slate-400">Johnson</span>
                </div>
                <p className="text-xs text-red-400 flex items-center space-x-1 font-mono">
                  <span>❌ Failed JSX binding: <code>{'{user.firstName}'}</code> evaluates to undefined</span>
                </p>
              </div>
            ) : isSynced ? (
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Alex Johnson</h1>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                    <span>given_name synced</span>
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">
                  ✓ Validated JSX binding: <code>{'{user.given_name}'}</code>
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Alex Johnson</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Active JSX binding: <code>{'{user.firstName}'}</code>
                </p>
              </div>
            )}

            <p className="text-sm text-slate-400 font-medium pt-1">Senior Cloud Architect • Core Platform</p>
          </div>

          {/* Metadata Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[11px] mb-1">Corporate Email</span>
              <span className="text-slate-200 font-mono">alex.johnson@enterprise.ibm</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-500 block text-[11px] mb-1">Authorization Clearance</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <span>Tier-3 Admin</span>
              </span>
            </div>
          </div>

          {/* Under-the-hood Contract View */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px]">
            <div className="text-slate-500 mb-1.5 flex justify-between items-center">
              <span>ACTIVE DATA CONTRACT BINDING</span>
              <span className="text-[10px] text-slate-400">UserProfile.tsx (Line 29)</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto p-1">
              {isBroken 
                ? `<h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2> // ERROR: null`
                : isSynced 
                ? `<h2 className="text-xl font-bold">{user.given_name} {user.lastName}</h2> // SYNCHRONIZED` 
                : `<h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2> // HEALTHY`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
