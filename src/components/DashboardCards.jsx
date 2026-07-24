import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Zap,
  FileCheck,
  Trophy,
  TrendingUp,
  TrendingDown,
  Code2,
  Layers,
  Server,
  ChevronRight,
  CheckCircle2,
  GitBranch
} from 'lucide-react';

export default function DashboardCards() {
  const { kpis, isDarkMode, students } = useLiveData();

  const totalStudents = students?.length || kpis.totalStudents || 0;

  // Compute exact stage percentages
  const devPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.submissionsCount || 0) / totalStudents) * 100)) : 0;
  const integrationPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.integrationPassedCount || 0) / totalStudents) * 100)) : 0;
  const hostPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.successfulDeployments || 0) / totalStudents) * 100)) : 0;

  const flowSteps = [
    {
      id: 'developers',
      name: 'Developers',
      percent: devPercent,
      isComplete: devPercent === 100 || (totalStudents > 0 && kpis.submissionsCount >= totalStudents),
      icon: Code2
    },
    {
      id: 'integration',
      name: 'Integration',
      percent: integrationPercent,
      isComplete: integrationPercent === 100 || (totalStudents > 0 && kpis.integrationPassedCount >= totalStudents),
      icon: Layers
    },
    {
      id: 'host',
      name: 'Host',
      percent: hostPercent,
      isComplete: hostPercent === 100 || (totalStudents > 0 && kpis.successfulDeployments >= totalStudents),
      icon: Server
    }
  ];

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

  return (
    <div className={`space-y-6 transition-all duration-300 ${
      !isDarkMode ? 'p-6 rounded-3xl bg-slate-100/95 border border-slate-300 shadow-2xl shadow-slate-300/60' : ''
    }`}>
      {/* FLOW PIPELINE SECTION (Developers ➔ Integration ➔ Host) */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/50 pb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-wider font-mono text-slate-200">
              System Pipeline Status Flow
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono font-bold">
            Developers ➔ Integration ➔ Host
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isComplete = step.isComplete;

            return (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`relative p-5 rounded-2xl border transition-all duration-500 flex items-center justify-between overflow-hidden group ${
                    isComplete
                      ? 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-950/90 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_35px_-5px_rgba(16,185,129,0.45)]'
                      : (isDarkMode
                          ? 'bg-slate-950/90 border-slate-800/80 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800 shadow-md')
                  }`}
                >
                  {/* Subtle Inner Glow */}
                  {isComplete && (
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
                  )}

                  {/* Left: Stage Name & Icon */}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`p-3 rounded-xl border shrink-0 transition-transform group-hover:scale-110 ${
                      isComplete
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40'
                        : (isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-600')
                    }`}>
                      {isComplete ? <CheckCircle2 className="w-6 h-6 text-slate-950" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className={`text-base font-black tracking-tight uppercase font-mono ${
                        isComplete ? 'text-emerald-300' : (isDarkMode ? 'text-slate-100' : 'text-slate-800')
                      }`}>
                        {step.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase font-mono tracking-wider ${
                        isComplete ? 'text-emerald-400 font-extrabold' : 'text-slate-500'
                      }`}>
                        {isComplete ? 'Stage Complete' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Percentage Only */}
                  <div className="text-right relative z-10">
                    <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                      isComplete
                        ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                        : (isDarkMode ? 'text-slate-100' : 'text-slate-900')
                    }`}>
                      {step.percent}%
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main KPI Overview Cards Grid */}
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
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
