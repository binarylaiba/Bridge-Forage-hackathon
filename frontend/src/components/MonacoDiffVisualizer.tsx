import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { useSync } from '../context/SyncContext';
import { CODE_DIFF_FILES } from '../data/mockCodeFiles';
import { 
  FileCode, 
  SplitSquareVertical, 
  Layers, 
  Sparkles, 
  Check, 
  Copy,
  Info
} from 'lucide-react';

export const MonacoDiffVisualizer: React.FC = () => {
  const { selectedDiffFile, setSelectedDiffFile, syncStage } = useSync();
  const [renderSideBySide, setRenderSideBySide] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const currentFile = CODE_DIFF_FILES[selectedDiffFile] || CODE_DIFF_FILES['UserProfile.tsx'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.afterCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getLanguageForMonaco = (lang: string) => {
    if (lang === 'typescript') return 'typescript';
    if (lang === 'java') return 'java';
    if (lang === 'markdown') return 'markdown';
    return 'plaintext';
  };

  return (
    <div className="bg-slate-900/95 rounded-xl border border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* File Selector Tabs & Options */}
      <div className="bg-[#0b0f19] px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        {/* File Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          {Object.keys(CODE_DIFF_FILES).map((fileName) => {
            const file = CODE_DIFF_FILES[fileName];
            const isSelected = selectedDiffFile === fileName;

            return (
              <button
                key={fileName}
                onClick={() => setSelectedDiffFile(fileName)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500/70 text-cyan-300 font-medium'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{fileName}</span>
                <span className={`text-[10px] px-1 rounded ${
                  file.layer === 'Backend' ? 'bg-amber-950 text-amber-300' :
                  file.layer === 'Frontend' ? 'bg-blue-950 text-cyan-300' :
                  file.layer === 'Documentation' ? 'bg-purple-950 text-purple-300' :
                  'bg-emerald-950 text-emerald-300'
                }`}>
                  {file.layer}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Options & Actions */}
        <div className="flex items-center space-x-2">
          {/* Toggle Side-by-side / Inline */}
          <button
            onClick={() => setRenderSideBySide(!renderSideBySide)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
            title="Toggle Side-by-Side vs Inline"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{renderSideBySide ? 'Side-by-Side' : 'Inline'}</span>
          </button>

          {/* Copy Rewritten Output */}
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Diff Metadata Bar */}
      <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-slate-400 truncate">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Path:</span>
          <span className="text-slate-200 truncate">{currentFile.displayPath}</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <span className="text-slate-400 text-[11px] flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{currentFile.subagentName}</span>
          </span>
          <span className="text-emerald-400 font-bold">+{currentFile.linesAdded}</span>
          <span className="text-red-400 font-bold">-{currentFile.linesRemoved}</span>
        </div>
      </div>

      {/* Monaco Diff Editor Container */}
      <div className="flex-1 min-h-[380px] w-full relative bg-[#1e1e1e]">
        <DiffEditor
          height="100%"
          language={getLanguageForMonaco(currentFile.language)}
          original={currentFile.beforeCode}
          modified={currentFile.afterCode}
          theme="vs-dark"
          options={{
            renderSideBySide: renderSideBySide,
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            smoothScrolling: true,
            diffWordWrap: 'on',
          }}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 space-x-2 font-mono text-xs">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
              <span>Loading Monaco Diff Engine...</span>
            </div>
          }
        />
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="line-clamp-1">{currentFile.summary}</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500 shrink-0">
          IBM Bob 2.0 Agent Mode AST Diff
        </div>
      </div>
    </div>
  );
};
