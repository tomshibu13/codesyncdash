import React, { useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, ShieldCheck, Terminal, Award, ExternalLink } from 'lucide-react';

export default function StudentEvaluationModal() {
  const { selectedStudentModal, setSelectedStudentModal, setStudents, isDarkMode } = useLiveData();
  const [gradeScore, setGradeScore] = useState(selectedStudentModal?.score || 90);
  const [successMsg, setSuccessMsg] = useState('');

  if (!selectedStudentModal) return null;
  const s = selectedStudentModal;

  const handleSaveEvaluation = () => {
    setStudents(prev => prev.map(item => item.id === s.id ? { ...item, score: Number(gradeScore), status: 'Completed' } : item));
    setSuccessMsg('Evaluation grade updated and saved!');
    setTimeout(() => {
      setSuccessMsg('');
      setSelectedStudentModal(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden p-6 space-y-5 transition-colors ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800 shadow-slate-300/80'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500" />
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{s.name}</h3>
                <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {s.id} • {s.email} • <span className="text-[#C3F53B] uppercase font-bold">[{s.role || 'dev'}]</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStudentModal(null)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 block">Assigned Task</span>
              <span className="font-bold text-slate-200 truncate block mt-0.5">{s.assignedTask}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 block">Difficulty</span>
              <span className="font-bold text-amber-400 block mt-0.5">{s.difficulty}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 block">Unit Tests</span>
              <span className="font-bold text-emerald-400 block mt-0.5">{s.unitTestPassed}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400 block">Integration</span>
              <span className="font-bold text-blue-400 block mt-0.5">{s.integrationPassed}</span>
            </div>
          </div>

          {/* Live Preview link */}
          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Deployment Preview:</span>
            <a href={s.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-mono">
              {s.liveUrl} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Live Console & Login Logs */}
          <div className={`space-y-1.5 pt-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <Terminal className="w-4 h-4 text-emerald-400" /> Live Console & Login Logs:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Stream Active
              </span>
            </div>
            <div className="terminal-box bg-[#030712] rounded-xl border border-slate-800 p-3 max-h-36 overflow-y-auto space-y-1 text-xs font-mono text-slate-300 scrollbar-thin">
              {(s.logs || []).map((log, idx) => (
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
          </div>

          {/* Manual Grade Adjustment Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Evaluation Final Score:
              </span>
              <span className="font-mono text-lg font-black text-blue-400">{gradeScore} / 100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={gradeScore}
              onChange={(e) => setGradeScore(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {successMsg && (
            <p className="text-xs text-emerald-400 font-semibold text-center">{successMsg}</p>
          )}

          {/* Actions */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setSelectedStudentModal(null)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEvaluation}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25"
            >
              Save & Approve Evaluation
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
