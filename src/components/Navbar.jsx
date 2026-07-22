import React, { useState, useEffect } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import {
  Search,
  Bell,
  Clock,
  Menu,
  Radio,
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({ onToggleMobileSidebar, onToggleNotifications }) {
  const { searchTerm, setSearchTerm, notifications, isDarkMode, setIsDarkMode } = useLiveData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className={`sticky top-0 z-30 h-16 border-b px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors duration-300 ${isDarkMode ? 'bg-black border-[#1A1A1A]' : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm'
      }`}>
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-2xl bg-[#111111] text-slate-300 hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students, tasks, statuses, or build logs (Ctrl + K)..."
            className="w-full pl-10 pr-10 py-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C3F53B] transition-all font-mono"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Status, Time, Notifications, Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Live Event Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#1A1A1A] text-[#C3F53B] text-xs font-extrabold uppercase font-mono shadow-sm">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#C3F53B]" />
          <span>Live Event Running</span>
        </div>

        {/* Live System Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] text-white font-mono text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-[#C3F53B]" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>

        {/* Global Website Theme Switcher */}
        <div className={`flex items-center p-1 rounded-2xl border transition-all ${isDarkMode
          ? 'bg-[#111111] border-[#1A1A1A] text-slate-300'
          : 'bg-slate-100 border-slate-300 shadow-sm text-slate-700'
          }`}>
          <button
            onClick={() => setIsDarkMode(true)}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${isDarkMode
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
              : 'hover:text-slate-900'
              }`}
            title="Dark Theme Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Dark</span>
          </button>
          <button
            onClick={() => setIsDarkMode(false)}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all ${!isDarkMode
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black scale-105'
              : 'hover:text-slate-200'
              }`}
            title="Light Theme Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono">Light</span>
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative p-2.5 rounded-2xl bg-[#111111] border border-[#1A1A1A] text-slate-300 hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF8C00] text-[10px] font-black text-black ring-2 ring-black">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1A1A1A]">
          <img
            src="https://www.ajce.in/ece/alumni/images/Binumon.jpg"
            alt="Admin Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#C3F53B] cursor-pointer hover:opacity-90 transition-opacity"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white">Binumon Joseph</p>
            <p className="text-[10px] text-[#C3F53B] font-mono font-bold">Control Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
