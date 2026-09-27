import React, { useState } from 'react';
import { SyncProvider, useSync } from './context/SyncContext';
import { Navbar } from './components/Navbar';
import { DemoTimelineBar } from './components/DemoTimelineBar';
import { BlastRadiusGraph } from './components/BlastRadiusGraph';
import { BobPlanViewer } from './components/BobPlanViewer';
import { SubagentsMonitor } from './components/SubagentsMonitor';
import { MonacoDiffVisualizer } from './components/MonacoDiffVisualizer';
import { ActivityLogTerminal } from './components/ActivityLogTerminal';
import { VideoScriptGuideModal } from './components/VideoScriptGuideModal';
import { ProductCatalogApp } from './components/ProductCatalogApp';
import { Network, FileCode2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    viewMode, 
    clientBindingField, 
    setClientBindingField, 
    startBobSync, 
    syncStage 
  } = useSync();
  const [activeVisualizerTab, setActiveVisualizerTab] = useState<'blast' | 'plan'>('blast');

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans">
      <Navbar />
      <DemoTimelineBar />

      <main className="flex-1 p-3 md:p-4 lg:p-5 overflow-hidden">
        {/* Split Screen Mode (Specially created for 3-minute video presentation) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 h-[calc(100vh-140px)]">
            {/* Left Side: BridgeForge Orchestrator & IBM Bob 2.0 (7 Cols) */}
            <div className="xl:col-span-7 flex flex-col space-y-4 overflow-y-auto pr-1 scrollbar-thin">
              {/* Parallel Subagents Monitor */}
              <SubagentsMonitor />

              {/* Toggleable Blast Radius vs Bob Plan Mode Viewer */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 bg-slate-900/60 p-1 rounded-lg border border-slate-800 w-fit text-xs font-mono">
                  <button
                    onClick={() => setActiveVisualizerTab('blast')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                      activeVisualizerTab === 'blast'
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Blast Radius Topology</span>
                  </button>
                  <button
                    onClick={() => setActiveVisualizerTab('plan')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                      activeVisualizerTab === 'plan'
                        ? 'bg-purple-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>.bob/plans/sync-plan.md</span>
                  </button>
                </div>

                {activeVisualizerTab === 'blast' ? <BlastRadiusGraph /> : <BobPlanViewer />}
              </div>

              {/* Monaco Diff Viewer */}
              <div className="flex-1 min-h-[380px]">
                <MonacoDiffVisualizer />
              </div>
            </div>

            {/* Right Side: Live Product Catalog App + Activity Terminal (5 Cols) */}
            <div className="xl:col-span-5 flex flex-col space-y-4 h-full">
              <div className="flex-1 min-h-[460px] overflow-hidden">
                <ProductCatalogApp
                  clientBindingField={clientBindingField}
                  setClientBindingField={setClientBindingField}
                  onTriggerBobSync={startBobSync}
                  isSyncing={syncStage === 'subagents_running' || syncStage === 'planning'}
                />
              </div>
              <div className="h-44 shrink-0">
                <ActivityLogTerminal />
              </div>
            </div>
          </div>
        )}

        {/* Full Product Catalog Mode */}
        {viewMode === 'catalog' && (
          <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <ProductCatalogApp
              clientBindingField={clientBindingField}
              setClientBindingField={setClientBindingField}
              onTriggerBobSync={startBobSync}
              isSyncing={syncStage === 'subagents_running' || syncStage === 'planning'}
            />
          </div>
        )}

        {/* Full Visualizer / Diffs Mode */}
        {viewMode === 'visualizer' && (
          <div className="max-w-7xl mx-auto space-y-5 overflow-y-auto pb-10">
            {/* Top: Blast Radius & Subagents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BlastRadiusGraph />
              <BobPlanViewer />
            </div>

            {/* Middle: Parallel Subagents Monitor */}
            <SubagentsMonitor />

            {/* Bottom: Diff Editor & Logs */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 min-h-[480px]">
                <MonacoDiffVisualizer />
              </div>
              <div className="min-h-[480px]">
                <ActivityLogTerminal />
              </div>
            </div>
          </div>
        )}
      </main>

      <VideoScriptGuideModal />
    </div>
  );
};

export function App() {
  return (
    <SyncProvider>
      <MainLayout />
    </SyncProvider>
  );
}

export default App;
