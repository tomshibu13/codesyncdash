import React, { useState, useEffect } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Server,
  Users,
  CheckCircle2,
  FileCode,
  Activity,
  Cpu,
  Wifi,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Check,
  X,
  Edit3
} from 'lucide-react';

export default function RightPanel() {
  const {
    kpis,
    isDarkMode,
    eventTimeRemaining = 4820,
    setEventTimeRemaining,
    isTimerRunning = true,
    setIsTimerRunning
  } = useLiveData();

  const [collapsed, setCollapsed] = useState(false);
  const [isEditingTimer, setIsEditingTimer] = useState(false);

  const [editHours, setEditHours] = useState(1);
  const [editMinutes, setEditMinutes] = useState(20);
  const [editSeconds, setEditSeconds] = useState(20);

  const handleOpenEdit = () => {
    const hours = Math.floor(eventTimeRemaining / 3600);
    const mins = Math.floor((eventTimeRemaining % 3600) / 60);
    const s = eventTimeRemaining % 60;
    setEditHours(hours);
    setEditMinutes(mins);
    setEditSeconds(s);
    setIsEditingTimer(true);
  };

  const handleSaveTimer = () => {
    const totalSeconds = (parseInt(editHours, 10) || 0) * 3600 +
      (parseInt(editMinutes, 10) || 0) * 60 +
      (parseInt(editSeconds, 10) || 0);
    if (setEventTimeRemaining) {
      setEventTimeRemaining(Math.max(0, totalSeconds));
    }
    setIsEditingTimer(false);
  };

  const handleAddMinutes = (minsToAdd) => {
    if (setEventTimeRemaining) {
      setEventTimeRemaining(prev => Math.max(0, prev + minsToAdd * 60));
    }
  };

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <aside
      className={`hidden xl:block shrink-0 transition-all duration-300 ${
        collapsed ? 'w-12' : 'w-72'
      } relative`}
    >
      <div className={`sticky top-20 p-5 space-y-5 shadow-2xl rounded-[20px] transition-colors border ${
        isDarkMode
          ? 'matte-card text-slate-100 border-[#1A1A1A] bg-[#0D0D0D]'
          : 'bg-white border-slate-200 shadow-slate-300/60 text-slate-900'
      }`}>
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -left-3 top-4 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border transition-colors z-10 ${
            isDarkMode
              ? 'bg-[#111111] text-[#C3F53B] border-[#1A1A1A] hover:bg-[#1A1A1A]'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
          }`}
        >
          {collapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {collapsed ? (
          <div className="flex flex-col items-center gap-6 py-4 text-slate-400">
            <Server className="w-5 h-5 text-[#C3F53B] animate-pulse" />
            <Activity className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
            <Users className="w-5 h-5 text-[#FF8C00]" />
          </div>
        ) : (
          <>
            {/* Header / Event Clock Area */}
            <div className={`border-b pb-3.5 ${isDarkMode ? 'border-[#222226]' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                <span className="flex items-center gap-1.5 text-[#C3F53B]">
                  <Clock className="w-3.5 h-3.5" /> Event Countdown
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#C3F53B]/20 text-[#C3F53B] text-[10px] font-bold">
                    {isTimerRunning ? 'Live' : 'Paused'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <div className={`text-2xl font-black font-mono tracking-tight flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {formatTime(eventTimeRemaining)}
                </div>

                {/* Quick Action Buttons for Timer */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsTimerRunning && setIsTimerRunning(!isTimerRunning)}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isTimerRunning
                        ? (isDarkMode ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25' : 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200')
                        : (isDarkMode ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 animate-pulse' : 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200 animate-pulse')
                    }`}
                    title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleOpenEdit}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isEditingTimer
                        ? 'bg-[#C3F53B] text-black border-[#C3F53B] font-extrabold shadow-md'
                        : isDarkMode
                          ? 'bg-[#111111] border-[#1A1A1A] text-slate-300 hover:text-white hover:border-[#C3F53B]'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                    }`}
                    title="Edit Timer Configuration"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline Timer Editing Panel */}
              <AnimatePresence>
                {isEditingTimer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-dashed border-slate-700/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase font-mono text-[#C3F53B]">Configure Timer</span>
                      <button
                        onClick={() => setIsEditingTimer(false)}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Time Input Boxes (HH : MM : SS) */}
                    <div className="grid grid-cols-3 gap-2 font-mono text-center">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-1">Hrs</label>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={editHours}
                          onChange={(e) => setEditHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                          className={`w-full py-1.5 px-2 rounded-xl border text-center font-bold text-sm focus:outline-none focus:border-[#C3F53B] transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-1">Mins</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={editMinutes}
                          onChange={(e) => setEditMinutes(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                          className={`w-full py-1.5 px-2 rounded-xl border text-center font-bold text-sm focus:outline-none focus:border-[#C3F53B] transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase block mb-1">Secs</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={editSeconds}
                          onChange={(e) => setEditSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                          className={`w-full py-1.5 px-2 rounded-xl border text-center font-bold text-sm focus:outline-none focus:border-[#C3F53B] transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Quick Add / Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddMinutes(5)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-slate-300 hover:border-[#C3F53B] hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          +5m
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddMinutes(15)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-slate-300 hover:border-[#C3F53B] hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          +15m
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddMinutes(30)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-slate-300 hover:border-[#C3F53B] hover:text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          +30m
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditHours(1);
                            setEditMinutes(20);
                            setEditSeconds(20);
                            if (setEventTimeRemaining) setEventTimeRemaining(4820);
                          }}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold border flex items-center gap-1 transition-colors ${
                            isDarkMode
                              ? 'bg-[#111111] border-[#222226] text-amber-400 hover:border-amber-400'
                              : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSaveTimer}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-[#C3F53B] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-[#b0df32] transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" /> Save Timer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTimer(false)}
                        className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                          isDarkMode
                            ? 'bg-[#111111] border-[#222226] text-slate-300 hover:bg-[#1A1A1A]'
                            : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Metrics Stack */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono">Live Metrics</h4>
              
              <div className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                isDarkMode ? 'bg-[#111111] border-[#1A1A1A]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#C3F53B]/10 text-[#C3F53B]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Dev Users Online</p>
                    <p className={`text-sm font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {kpis.loginActiveCount} / {kpis.devUsersCount || kpis.totalStudents}
                    </p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#C3F53B] animate-ping" />
              </div>

              <div className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                isDarkMode ? 'bg-[#111111] border-[#1A1A1A]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Tasks Remaining</p>
                    <p className={`text-sm font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {kpis.totalStudents - kpis.completedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                isDarkMode ? 'bg-[#111111] border-[#1A1A1A]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#FF8C00]/10 text-[#FF8C00]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Submissions</p>
                    <p className={`text-sm font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {kpis.submissionsCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Progress Gauge */}
            <div className={`p-3.5 rounded-2xl border space-y-2 transition-colors ${
              isDarkMode ? 'bg-[#111111] border-[#1A1A1A]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>Overall Completion</span>
                <span className="text-[#C3F53B]">{kpis.overallCompletionPercentage}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-slate-200'}`}>
                <motion.div
                  className="h-full bg-[#C3F53B] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${kpis.overallCompletionPercentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Server Status Section with Green Blinking Signal */}
            <div className={`pt-2 border-t space-y-2 ${isDarkMode ? 'border-[#222226]' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#C3F53B]" /> Cluster Health
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3F53B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C3F53B]"></span>
                  </span>
                  <span className="text-[#C3F53B] font-bold text-[11px]">100% Operational</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  isDarkMode ? 'bg-[#0A0A0C] border-[#222226]' : 'bg-slate-100 border-slate-300'
                }`}>
                  <Cpu className="w-3 h-3 text-[#C3F53B]" />
                  <span>CPU: 34%</span>
                </div>
                <div className={`p-2 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  isDarkMode ? 'bg-[#0A0A0C] border-[#222226]' : 'bg-slate-100 border-slate-300'
                }`}>
                  <Wifi className="w-3 h-3 text-[#FF8C00]" />
                  <span>14ms Latency</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
