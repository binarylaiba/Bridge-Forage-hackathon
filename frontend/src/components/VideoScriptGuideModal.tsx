import React from 'react';
import { useSync } from '../context/SyncContext';
import { DEMO_STEPS } from '../data/demoNarrative';
import { X, Play, Clock, Sparkles, CheckCircle2, Video } from 'lucide-react';

export const VideoScriptGuideModal: React.FC = () => {
  const { showScriptGuide, setShowScriptGuide, currentStepIndex, goToDemoStep } = useSync();

  if (!showScriptGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                3-Minute Demo Video Script & Teleprompter
              </h3>
              <p className="text-xs text-slate-400">
                Lablab.ai Rubric Alignment • 50% of Total Hackathon Grade
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScriptGuide(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {DEMO_STEPS.map((step, idx) => {
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.title}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {step.timeCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">
                      Step {idx + 1}: {step.title}
                    </h4>
                    <span className="text-xs text-slate-400">— {step.subtitle}</span>
                  </div>

                  <button
                    onClick={() => {
                      goToDemoStep(idx);
                      setShowScriptGuide(false);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isCurrent ? 'Current' : 'Jump'}</span>
                  </button>
                </div>

                {/* Spoken Narrative */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 mb-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono block mb-1">
                    Spoken Script:
                  </span>
                  <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
                    {step.scriptNarrative}
                  </p>
                </div>

                {/* Actionable Cue */}
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span><strong>Visual Cue:</strong> {step.keyAction}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Remember: Minimum 90 seconds of active screen demo required.</span>
          <button
            onClick={() => setShowScriptGuide(false)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
          >
            Got it, Let's Record
          </button>
        </div>
      </div>
    </div>
  );
};
