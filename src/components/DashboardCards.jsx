import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Zap,
  CheckSquare,
  FileCheck,
  Trophy,
  Timer,
  TestTube2,
  CheckCircle,
  Layers,
  ShieldCheck,
  Rocket,
  AlertTriangle,
  Percent,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function DashboardCards() {
  const { kpis, isDarkMode, setIsDarkMode } = useLiveData();

  const mainCardsData = [
    {
      title: "Login Active Count",
      value: kpis.loginActiveCount,
      desc: "Dev users logged into IDE",
      icon: UserCheck,
      trendUp: true,
      colorDark: "from-emerald-500/25 via-emerald-600/10 to-transparent",
      colorLight: "from-emerald-500/15 via-emerald-500/5 to-white",
      borderDark: "border-emerald-500/40",
      borderLight: "border-emerald-300",
      iconBgDark: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      iconBgLight: "bg-emerald-50 border-emerald-200 text-emerald-600",
      glowClass: "hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.35)]"
    },
    {
      title: "Total Active Users",
      value: kpis.totalActiveUsers,
      desc: "Dev users coding & testing",
      icon: Zap,
      trendUp: true,
      colorDark: "from-purple-500/25 via-purple-600/10 to-transparent",
      colorLight: "from-purple-500/15 via-purple-500/5 to-white",
      borderDark: "border-purple-500/40",
      borderLight: "border-purple-300",
      iconBgDark: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      iconBgLight: "bg-purple-50 border-purple-200 text-purple-600",
      glowClass: "hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.35)]"
    },
    {
      title: "Submissions",
      value: kpis.submissionsCount,
      desc: "Final code repositories pushed",
      icon: FileCheck,
      trendUp: true,
      colorDark: "from-indigo-500/25 via-indigo-600/10 to-transparent",
      colorLight: "from-indigo-500/15 via-indigo-500/5 to-white",
      borderDark: "border-indigo-500/40",
      borderLight: "border-indigo-300",
      iconBgDark: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
      iconBgLight: "bg-indigo-50 border-indigo-200 text-indigo-600",
      glowClass: "hover:shadow-[0_0_35px_-5px_rgba(99,102,241,0.35)]"
    },
    {
      title: "Completed",
      value: kpis.completedCount,
      desc: "Passed all evaluation benchmarks",
      icon: Trophy,
      trendUp: true,
      colorDark: "from-amber-500/25 via-amber-600/10 to-transparent",
      colorLight: "from-amber-500/15 via-amber-500/5 to-white",
      borderDark: "border-amber-500/40",
      borderLight: "border-amber-300",
      iconBgDark: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      iconBgLight: "bg-amber-50 border-amber-200 text-amber-600",
      glowClass: "hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.35)]"
    }
  ];

  const otherCardsData = [
  
  ];

  return (
    <div className={`space-y-6 transition-all duration-300 ${
      !isDarkMode ? 'p-6 rounded-3xl bg-slate-100/95 border border-slate-300 shadow-2xl shadow-slate-300/60' : ''
    }`}>
      {/* Top Header & Theme Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        
      </div>

      {/* Main Cards Grid (Prominent, Larger size) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {mainCardsData.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -5, transition: { duration: 0.15 } }}
              className={`relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${
                isDarkMode ? card.colorDark : card.colorLight
              } ${
                isDarkMode 
                  ? 'bg-[#0D0D0D]/90 border text-slate-100' 
                  : 'bg-white border shadow-xl shadow-slate-300/40 text-slate-900'
              } ${
                isDarkMode ? card.borderDark : card.borderLight
              } ${card.glowClass} flex flex-col justify-between overflow-hidden group min-h-[200px] transition-all duration-300`}
            >
              {/* Subtle top glow ring inside */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />

              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
                <span className={`text-sm font-bold uppercase tracking-wider leading-snug ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-700'
                }`}>
                  {card.title}
                </span>
                <div className={`p-3 rounded-2xl border shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md ${
                  isDarkMode ? card.iconBgDark : card.iconBgLight
                }`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              {/* Main Value */}
              <div className="my-2 relative z-10">
                <div className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {card.value}
                </div>
              </div>

              {/* Footer / Trend */}
              <div className={`flex items-center justify-between text-xs pt-3.5 border-t mt-3 gap-2 relative z-10 ${
                isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}>
                <span className="leading-tight font-medium">{card.desc}</span>
                <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg shrink-0 shadow-sm ${
                  card.trendUp 
                    ? (isDarkMode ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300')
                    : (isDarkMode ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-red-100 text-red-800 border border-red-300')
                }`}>
                  {card.trendUp ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                  {card.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Subheader for Other Cards */}
      <div className={`flex items-center justify-between pt-5 pb-2 border-b ${
        isDarkMode ? 'border-slate-800/80' : 'border-slate-300'
      }`}>
        
      </div>

      {/* Other Cards Grid (All exact same size: standard compact cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {otherCardsData.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 + 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className={`relative p-4 rounded-2xl bg-gradient-to-b ${
                isDarkMode ? card.colorDark : card.colorLight
              } ${
                isDarkMode 
                  ? 'bg-[#0D0D0D] border text-slate-100' 
                  : 'bg-white border shadow-md shadow-slate-200/60 text-slate-900'
              } ${
                isDarkMode ? card.borderDark : card.borderLight
              } flex flex-col justify-between overflow-hidden group min-h-[140px] transition-all duration-300`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wider leading-snug ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl border shrink-0 group-hover:scale-110 transition-transform ${
                  isDarkMode ? card.iconBgDark : card.iconBgLight
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Main Value */}
              <div className="my-1">
                <div className={`text-2xl font-black tracking-tight font-mono ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {card.value}
                </div>
              </div>

              {/* Footer / Trend */}
              <div className={`flex items-center justify-between text-xs pt-2 border-t mt-2 gap-2 ${
                isDarkMode ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}>
                <span className="leading-tight">{card.desc}</span>
                <span className={`inline-flex items-center gap-0.5 font-medium text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                  card.trendUp 
                    ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                    : (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-800')
                }`}>
                  {card.trendUp ? <TrendingUp className="w-2.5 h-2.5 shrink-0" /> : <TrendingDown className="w-2.5 h-2.5 shrink-0" />}
                  {card.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

