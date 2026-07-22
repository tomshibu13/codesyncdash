import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Copy, Download } from 'lucide-react';

export default function LogsViewerModal() {
  const { selectedLogsModal, setSelectedLogsModal, isDarkMode } = useLiveData();

  if (!selectedLogsModal) return null;
  const s = selectedLogsModal;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden p-5 space-y-4 font-mono transition-colors ${
            isDarkMode ? 'bg-[#090D16] border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/80'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b pb-3 font-sans ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>Terminal Build & Test Output</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{s.name} ({s.id})</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedLogsModal(null)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Log Window */}
          <div className="terminal-box bg-[#030712] rounded-xl border border-slate-800 p-4 max-h-96 overflow-y-auto space-y-1.5 text-xs text-slate-300 scrollbar-thin">
            {s.logs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-600 select-none">{idx + 1}</span>
                <span className={
                  log.includes('[ERR]') ? 'text-red-400 font-bold' :
                  log.includes('[WARN]') ? 'text-amber-400' :
                  log.includes('[SUBMIT]') ? 'text-emerald-400 font-bold' :
                  'text-slate-300'
                }>
                  {log}
                </span>
              </div>
            ))}
          </div>

          {/* Modal Footer */}
          <div className={`flex items-center justify-between pt-2 border-t font-sans ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Log stream active • Target: evaluation-runner-01</span>
            <button
              onClick={() => setSelectedLogsModal(null)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              Close Console
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
