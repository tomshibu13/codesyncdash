import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Terminal, CheckCircle2, AlertTriangle, Rocket, UserCheck, Code } from 'lucide-react';

export default function ActivityFeed() {
  const { activities } = useLiveData();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'submit':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'deploy':
        return <Rocket className="w-4 h-4 text-purple-400" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'test':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case 'login':
        return <UserCheck className="w-4 h-4 text-slate-400" />;
      default:
        return <Code className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl glass-panel space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Live Activity Feed</h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time Ticker
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {activities.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/60 flex items-start gap-2.5 hover:bg-slate-800/70 transition-colors"
            >
              <div className="mt-0.5 p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                {getActivityIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-snug font-medium">{item.text}</p>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
