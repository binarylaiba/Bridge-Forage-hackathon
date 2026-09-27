import React from 'react';
import { useSync } from '../context/SyncContext';
import { DEMO_STEPS } from '../data/demoNarrative';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Flame, 
  Cpu, 
  CheckCircle, 
  Info,
  Clock
} from 'lucide-react';

export const DemoTimelineBar: React.FC = () => {
  const { 
    currentStepIndex, 
    goToDemoStep, 
    autoPlay, 
    toggleAutoPlay,
    currentStep
  } = useSync();

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Info className="w-3.5 h-3.5" />;
      case 1:
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 2:
        return <Flame className="w-3.5 h-3.5 text-red-400" />;
      case 3:
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 4:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-[#0e1424] border-b border-slate-800/90 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Indicators */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {DEMO_STEPS.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            const isPassed = currentStepIndex > idx;

            return (
              <button
                key={step.title}
                onClick={() => goToDemoStep(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-left whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-blue-600/30 border-blue-500/70 text-white font-medium shadow-sm'
                    : isPassed
                    ? 'bg-slate-900 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-400'
                }`}
              >
                <span className={`p-0.5 rounded ${isActive ? 'text-blue-400' : ''}`}>
                  {getStepIcon(idx)}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {step.timeCode.split(' - ')[0]}
                </span>
                <span className="font-medium text-xs">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Narrative Prompter & Auto-Play Controls */}
        <div className="flex items-center space-x-3 justify-between md:justify-end">
          {/* Active Speaking Cue */}
          <div className="hidden lg:flex items-center space-x-2 text-slate-400 max-w-md truncate">
            <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-800 px-1.5 py-0.5 rounded text-blue-400 font-semibold shrink-0">
              Script Cue
            </span>
            <span className="italic text-slate-300 text-xs truncate">
              {currentStep.scriptNarrative}
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToDemoStep(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={toggleAutoPlay}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                autoPlay
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
              title="Automatically run the entire 3-minute video progression"
            >
              {autoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{autoPlay ? 'Pause Demo' : 'Auto-Run'}</span>
            </button>

            <button
              onClick={() => goToDemoStep(Math.min(DEMO_STEPS.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
