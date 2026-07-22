import React, { useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { Settings, Moon, Bell, RefreshCw, Sliders, Lock, Unlock } from 'lucide-react';

export default function SettingsPage() {
  const { isLiveUpdating, setIsLiveUpdating, updateIntervalMs, setUpdateIntervalMs, isDarkMode, setIsDarkMode, isSystemLocked, setIsSystemLocked } = useLiveData();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Platform & Control Settings</h1>
          <p className="text-xs text-slate-400">Configure theme, real-time ticker speed, notifications, and refresh intervals</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* System Lock / Unlock Control */}
        <div className={`p-4 rounded-2xl border transition-all glass-panel flex items-center justify-between ${
          isSystemLocked ? 'bg-red-950/30 border-red-500/50 shadow-[0_0_25px_-5px_rgba(239,68,68,0.3)]' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSystemLocked ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {isSystemLocked ? <Lock className="w-5 h-5 animate-pulse" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                System Lock / Unlock Control
                {isSystemLocked && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-red-500/20 text-red-400 border border-red-500/30">
                    LOCKED
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {isSystemLocked ? 'All connected user IDE windows and systems are currently LOCKED and disabled.' : 'Lock or unlock all connected user windows across all IDE sessions immediately.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSystemLocked(!isSystemLocked)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isSystemLocked
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSystemLocked ? (
              <>
                <Lock className="w-4 h-4" /> System Locked (Unlock All)
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" /> Lock All Systems
              </>
            )}
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Dark Theme Mode</h3>
              <p className="text-xs text-slate-400">CodeSync Control Center high-contrast dark aesthetic (#0B1120)</p>
            </div>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Notification Toggle */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Sound & System Notifications</h3>
              <p className="text-xs text-slate-400">Alert admin on build failures and completed evaluations</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${notificationsEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Auto Refresh Toggle
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <RefreshCw className={`w-5 h-5 ${isLiveUpdating ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Real-time Firebase Listener</h3>
              <p className="text-xs text-slate-400">Stream real-time student evaluation and submission events from Firebase RTDB</p>
            </div>
          </div>
          <button
            onClick={() => setIsLiveUpdating(!isLiveUpdating)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${isLiveUpdating ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isLiveUpdating ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div> */}

        {/* Refresh Interval Dropdown */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 glass-panel flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Polling & Sync Interval</h3>
              <p className="text-xs text-slate-400">Control synchronization cadence for secondary background checkers</p>
            </div>
          </div>
          <select
            value={updateIntervalMs}
            onChange={(e) => setUpdateIntervalMs(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value={1000}>1 Second (Fast)</option>
            <option value={3000}>3 Seconds (Normal)</option>
            <option value={5000}>5 Seconds (Slow)</option>
            <option value={10000}>10 Seconds (Paused Ticker)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
