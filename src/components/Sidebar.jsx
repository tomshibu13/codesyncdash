import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileCheck,
  TestTube,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  Terminal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Submissions', path: '/submissions', icon: FileCheck },
  { name: 'Logs History', path: '/logs', icon: Terminal },
  { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const { isDarkMode } = useLiveData();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
          } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isDarkMode ? 'bg-black border-r border-[#1A1A1A]' : 'bg-white border-r border-slate-200 shadow-xl'
          }`}
      >
        {/* Header / Logo */}
        <div className={`h-16 flex items-center justify-between px-4 border-b ${isDarkMode ? 'border-[#1A1A1A]' : 'border-slate-200'
          }`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative p-2 rounded-xl bg-[#111111] text-[#C3F53B] border border-[#1A1A1A] shadow-md">
              <Terminal className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3F53B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C3F53B]"></span>
              </span>
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className={`font-extrabold tracking-wider text-base uppercase font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                  Code<span className="text-[#C3F53B]">Sync</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 font-mono">
                  <Zap className="w-2.5 h-2.5 text-[#FF8C00]" /> Live Platform
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-[#111111] text-slate-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu with original icons and original text labels */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 ${isActive
                    ? 'bg-[#C3F53B] text-black shadow-lg shadow-[#C3F53B]/20 font-extrabold'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-[#111111]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : isDarkMode ? 'text-slate-300' : 'text-slate-500'}`} />
                {!collapsed && (
                  <span className="truncate tracking-wider uppercase font-mono text-[11px]">{item.name}</span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute right-2 w-1.5 h-4 bg-black rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section: Admin Profile */}
        <div className={`p-3 border-t ${isDarkMode ? 'border-[#1A1A1A] bg-black' : 'border-slate-200 bg-white'}`}>
          <div className={`flex items-center gap-3 p-2.5 rounded-2xl border ${isDarkMode ? 'bg-[#0D0D0D] border-[#1A1A1A]' : 'bg-slate-100 border-slate-200'
            }`}>
            <div className="relative shrink-0">
              <img
                src="https://www.ajce.in/ece/alumni/images/Binumon.jpg"
                alt="Admin Avatar"
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#C3F53B]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C3F53B] border-2 border-[#0A0A0C] rounded-full" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                  Administrator <ShieldCheck className="w-3.5 h-3.5 text-[#C3F53B] shrink-0" />
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate">Lead Evaluator</p>
              </div>
            )}

            {!collapsed && (
              <button
                className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-slate-400 hover:text-[#FF8C00] hover:bg-[#1E1E22]' : 'text-slate-500 hover:text-[#FF8C00] hover:bg-slate-200'
                  }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
