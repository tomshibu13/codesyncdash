import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, AlertTriangle, CheckCircle, Info, Trash2 } from 'lucide-react';

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, setNotifications } = useLiveData();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-16 right-4 z-50 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden p-4 space-y-3"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-slate-100">Notifications</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] text-blue-400 hover:underline font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-center text-slate-500 py-6">No recent notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 transition-colors ${
                  n.unread ? 'bg-blue-950/20 border-blue-500/30' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-bold text-slate-200 flex items-center gap-1.5">
                    {n.severity === 'danger' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                    {n.severity === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {n.severity === 'info' && <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    {n.title}
                  </p>
                  <p className="text-slate-400 truncate text-[11px]">{n.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
