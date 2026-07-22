import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';
import { Flag, Sparkles, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export default function ProgressSection() {
  const { kpis } = useLiveData();
  const progressPercent = typeof kpis.overallCompletionPercentage === 'number' ? kpis.overallCompletionPercentage : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border border-slate-800/80 glass-panel shadow-xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Flag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">
              Overall Event Progress
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Active Evaluation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time aggregate metric based on unit tests, integration runs, code builds, and submissions.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-3xl font-black text-blue-400 font-mono tracking-tight flex items-center justify-end gap-1">
              {progressPercent}% <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Weighted Completion Score</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-slate-950/80 rounded-full p-0.5 border border-slate-800/80 shadow-inner overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-full shadow-lg shadow-blue-500/30 relative"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Animated glow shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>

      {/* Sub-stat Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Completed: <strong className="text-white font-mono">{kpis.completedCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <PlayCircle className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Active Dev Users: <strong className="text-white font-mono">{kpis.totalActiveUsers}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Active Timers: <strong className="text-white font-mono">{kpis.timerRunningCount}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Submissions: <strong className="text-white font-mono">{kpis.submissionsCount}</strong></span>
        </div>
      </div>
    </motion.div>
  );
}
