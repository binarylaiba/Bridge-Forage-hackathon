import React, { useState } from 'react';
import { UserProfile } from './UserProfile';
import { useSync } from '../context/SyncContext';
import { Users, Server, Shield, Activity, RefreshCw, Terminal, CheckCircle2, AlertOctagon } from 'lucide-react';

export const DummyApp: React.FC = () => {
  const { syncStage, triggerBackendDrift, startBobSync, resetToHealthy } = useSync();
  const [showJsonInspector, setShowJsonInspector] = useState<boolean>(true);

  const isHealthy = syncStage === 'healthy';
  const isBroken = syncStage === 'drift_detected' || syncStage === 'planning' || syncStage === 'subagents_running';
  const isSynced = syncStage === 'synced';

  return (
    <div className="flex flex-col h-full bg-[#0d121f] text-slate-200 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Sandbox Header / App Bar */}
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30">
            EP
          </div>
          <div>
            <div className="font-semibold text-sm text-white flex items-center space-x-2">
              <span>Enterprise Portal (Dummy Target App)</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-700">
                v2.1-sandbox
              </span>
            </div>
            <div className="text-xs text-slate-400">
              React Frontend Client consuming Spring Boot <code>UserController.java</code>
            </div>
          </div>
        </div>

        {/* Action Controls in Sandbox */}
        <div className="flex items-center space-x-2">
          {isHealthy && (
            <button
              onClick={triggerBackendDrift}
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Break API (Change to given_name)</span>
            </button>
          )}

          {isBroken && (
            <button
              onClick={startBobSync}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-md shadow-blue-600/40 transition-all pulse-glow-blue"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>Invoke IBM Bob 2.0</span>
            </button>
          )}

          {isSynced && (
            <button
              onClick={resetToHealthy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Scenario</span>
            </button>
          )}

          <button
            onClick={() => setShowJsonInspector(!showJsonInspector)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              showJsonInspector
                ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showJsonInspector ? 'Hide Payload' : 'Inspect JSON'}
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Mini Sidebar */}
        <div className="w-48 bg-slate-950/80 border-r border-slate-800/80 p-3 hidden md:flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase px-2 mb-2">Portal Navigation</div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 font-medium text-xs">
              <Users className="w-4 h-4" />
              <span>User Profile</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-900 text-xs">
              <Server className="w-4 h-4" />
              <span>Microservices</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-900 text-xs">
              <Shield className="w-4 h-4" />
              <span>Access Control</span>
            </div>
          </div>

          {/* Backend Connection Status */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Spring Boot</span>
              {isBroken ? (
                <span className="text-red-400 flex items-center space-x-1">
                  <AlertOctagon className="w-3 h-3" />
                  <span>DRIFT</span>
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ONLINE</span>
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[10px] truncate">
              localhost:8080/api/v1
            </div>
          </div>
        </div>

        {/* Center Content: UserProfile Component */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center items-center bg-radial-gradient">
          <UserProfile />
        </div>

        {/* Right Panel: API Payload Inspector */}
        {showJsonInspector && (
          <div className="w-72 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-slate-400 flex items-center space-x-1.5 text-xs font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Backend Response</span>
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
                  JSON
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mb-2">
                GET /api/v1/users/101
              </div>

              <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-[11px] leading-relaxed overflow-x-auto">
                <pre className="text-slate-300">
{`{
  "id": "101",`}
{isHealthy ? (
  <span className="text-emerald-400 font-bold block bg-emerald-950/40 px-1 rounded">
{`  "firstName": "Alex",`}
  </span>
) : (
  <span className="text-amber-400 font-bold block bg-amber-950/40 px-1 rounded animate-pulse">
{`  "given_name": "Alex",`}
  </span>
)}
{`  "lastName": "Johnson",
  "email": "alex.johnson@ibm",
  "role": "Senior Architect",
  "status": "ACTIVE"
}`}
                </pre>
              </div>

              <div className="mt-3 text-[10px] text-slate-400 leading-normal">
                {isHealthy && (
                  <span className="text-emerald-400">✓ Contract matching: <code>firstName</code> matches <code>UserProfile.tsx</code>.</span>
                )}
                {isBroken && (
                  <span className="text-red-400 font-medium">❌ Contract mismatch: <code>given_name</code> received, frontend component looking for <code>firstName</code>.</span>
                )}
                {isSynced && (
                  <span className="text-cyan-400 font-medium">✓ Contract synced: <code>UserProfile.tsx</code> updated to accept <code>given_name</code>.</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
              Source: <code className="text-slate-400">UserController.java:18</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
