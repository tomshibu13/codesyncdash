import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Zap,
  FileCheck,
  Trophy,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Rocket,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Server,
  Code2,
  Clock
} from 'lucide-react';

export default function DashboardCards() {
  const { kpis, isDarkMode, students } = useLiveData();

  const totalStudents = students?.length || kpis.totalStudents || 0;

  // Stage Completion Logic
  // 1. Developers Stage Complete: when totalStudents > 0 and all developers submitted code
  const isDevComplete = totalStudents > 0 && (kpis.submissionsCount >= totalStudents || kpis.completedCount >= totalStudents);

  // 2. Integration Stage Complete: when totalStudents > 0 and all integration pipelines passed
  const isIntegrationComplete = totalStudents > 0 && kpis.integrationPassedCount >= totalStudents;

  // 3. Host / Deployment Stage Complete: when totalStudents > 0 and all deployments are Live
  const isHostComplete = totalStudents > 0 && kpis.successfulDeployments >= totalStudents;

  // 4. Overall Complete
  const isOverallComplete = isDevComplete && isIntegrationComplete && isHostComplete;

  const devPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.submissionsCount || 0) / totalStudents) * 100)) : 0;
  const integrationPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.integrationPassedCount || 0) / totalStudents) * 100)) : 0;
  const hostPercent = totalStudents > 0 ? Math.min(100, Math.round(((kpis.successfulDeployments || 0) / totalStudents) * 100)) : 0;

  const statusCards = [
    {
      id: "developers",
      title: "Developers Status",
      isComplete: isDevComplete,
      percent: devPercent,
      value: `${kpis.submissionsCount || 0} / ${totalStudents} Submissions`,
      subText: isDevComplete
        ? "100% Developers Code Submitted"
        : `${Math.max(0, totalStudents - (kpis.submissionsCount || 0))} developer(s) pending push`,
      icon: Code2,
      badgeText: isDevComplete ? "Developers Complete" : "Coding Active",
      // Complete: GREEN Card Styling
      completeClassDark: "from-emerald-950/90 via-emerald-900/60 to-slate-900/95 border-2 border-emerald-400 text-slate-100 shadow-[0_0_40px_-5px_rgba(16,185,129,0.45)]",
      completeClassLight: "from-emerald-100 via-emerald-50 to-white border-2 border-emerald-500 text-slate-900 shadow-xl shadow-emerald-200/60",
      completeIconBg: "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40",
      // Incomplete: Amber / Active Styling
      incompleteClassDark: "from-amber-500/15 via-slate-900/80 to-slate-900/90 border border-amber-500/30 text-slate-100 hover:border-amber-500/50 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)]",
      incompleteClassLight: "from-amber-50 via-white to-white border border-amber-300 text-slate-900 shadow-md",
      incompleteIconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      id: "integration",
      title: "Integration Status",
      isComplete: isIntegrationComplete,
      percent: integrationPercent,
      value: `${kpis.integrationPassedCount || 0} / ${totalStudents} Integrated`,
      subText: isIntegrationComplete
        ? "All Integration Pipelines Passed"
        : `${Math.max(0, totalStudents - (kpis.integrationPassedCount || 0))} pipeline(s) running tests`,
      icon: Layers,
      badgeText: isIntegrationComplete ? "Integration Passed" : "Testing Pipeline",
      // Complete: GREEN Card Styling
      completeClassDark: "from-emerald-950/90 via-emerald-900/60 to-slate-900/95 border-2 border-emerald-400 text-slate-100 shadow-[0_0_40px_-5px_rgba(16,185,129,0.45)]",
      completeClassLight: "from-emerald-100 via-emerald-50 to-white border-2 border-emerald-500 text-slate-900 shadow-xl shadow-emerald-200/60",
      completeIconBg: "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40",
      // Incomplete: Blue / Active Styling
      incompleteClassDark: "from-blue-500/15 via-slate-900/80 to-slate-900/90 border border-blue-500/30 text-slate-100 hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)]",
      incompleteClassLight: "from-blue-50 via-white to-white border border-blue-300 text-slate-900 shadow-md",
      incompleteIconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      id: "host",
      title: "Host / Deployment Status",
      isComplete: isHostComplete,
      percent: hostPercent,
      value: `${kpis.successfulDeployments || 0} / ${totalStudents} Hosted Live`,
      subText: isHostComplete
        ? "All Host Deployments Live & Verified"
        : `${Math.max(0, totalStudents - (kpis.successfulDeployments || 0))} host(s) deploying`,
      icon: Server,
      badgeText: isHostComplete ? "Host Live & Verified" : "Deploying Host",
      // Complete: GREEN Card Styling
      completeClassDark: "from-emerald-950/90 via-emerald-900/60 to-slate-900/95 border-2 border-emerald-400 text-slate-100 shadow-[0_0_40px_-5px_rgba(16,185,129,0.45)]",
      completeClassLight: "from-emerald-100 via-emerald-50 to-white border-2 border-emerald-500 text-slate-900 shadow-xl shadow-emerald-200/60",
      completeIconBg: "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40",
      // Incomplete: Purple / Active Styling
      incompleteClassDark: "from-purple-500/15 via-slate-900/80 to-slate-900/90 border border-purple-500/30 text-slate-100 hover:border-purple-500/50 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)]",
      incompleteClassLight: "from-purple-50 via-white to-white border border-purple-300 text-slate-900 shadow-md",
      incompleteIconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    }
  ];

  const kpiMetricsData = [
    {
      title: "Login Active Count",
      value: kpis.loginActiveCount,
      desc: "Dev users logged into IDE",
      icon: UserCheck,
      colorDark: "from-emerald-500/20 via-emerald-600/5 to-transparent",
      colorLight: "from-emerald-500/10 to-white",
      borderDark: "border-emerald-500/30",
      borderLight: "border-emerald-200",
      iconBgDark: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      iconBgLight: "bg-emerald-50 border-emerald-200 text-emerald-600",
    },
    {
      title: "Total Active Users",
      value: kpis.totalActiveUsers,
      desc: "Dev users coding & testing",
      icon: Zap,
      colorDark: "from-purple-500/20 via-purple-600/5 to-transparent",
      colorLight: "from-purple-500/10 to-white",
      borderDark: "border-purple-500/30",
      borderLight: "border-purple-200",
      iconBgDark: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      iconBgLight: "bg-purple-50 border-purple-200 text-purple-600",
    },
    {
      title: "Submissions",
      value: kpis.submissionsCount,
      desc: "Final code repositories pushed",
      icon: FileCheck,
      colorDark: "from-indigo-500/20 via-indigo-600/5 to-transparent",
      colorLight: "from-indigo-500/10 to-white",
      borderDark: "border-indigo-500/30",
      borderLight: "border-indigo-200",
      iconBgDark: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
      iconBgLight: "bg-indigo-50 border-indigo-200 text-indigo-600",
    },
    {
      title: "Completed Benchmarks",
      value: kpis.completedCount,
      desc: "Passed all evaluation criteria",
      icon: Trophy,
      colorDark: "from-amber-500/20 via-amber-600/5 to-transparent",
      colorLight: "from-amber-500/10 to-white",
      borderDark: "border-amber-500/30",
      borderLight: "border-amber-200",
      iconBgDark: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      iconBgLight: "bg-amber-50 border-amber-200 text-amber-600",
    }
  ];

  return (
    <div className={`space-y-8 transition-all duration-300 ${
      !isDarkMode ? 'p-6 rounded-3xl bg-slate-100/95 border border-slate-300 shadow-2xl shadow-slate-300/60' : ''
    }`}>
      {/* SECTION 1: DEVELOPERS, INTEGRATION & HOST STAGE PIPELINE CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-100 uppercase font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Pipeline & Infrastructure Status
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status for Developers, Integration, and Host environments. Cards automatically turn <span className="text-emerald-400 font-bold">GREEN</span> upon stage completion.
            </p>
          </div>
          {isOverallComplete && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase font-mono flex items-center gap-1.5 animate-pulse shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" /> All Systems Green
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statusCards.map((card, index) => {
            const Icon = card.icon;
            const isComplete = card.isComplete;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.15 } }}
                className={`relative p-6 rounded-3xl bg-gradient-to-b overflow-hidden flex flex-col justify-between group transition-all duration-500 min-h-[220px] ${
                  isComplete
                    ? (isDarkMode ? card.completeClassDark : card.completeClassLight)
                    : (isDarkMode ? card.incompleteClassDark : card.incompleteClassLight)
                }`}
              >
                {/* Glow ring inside */}
                <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12 transition-all duration-500 ${
                  isComplete ? 'bg-emerald-400/25 group-hover:scale-150' : 'bg-white/5'
                }`} />

                {/* Top Row: Title + Icon Badge */}
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div>
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${
                      isComplete
                        ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-800')
                        : (isDarkMode ? 'text-slate-300' : 'text-slate-700')
                    }`}>
                      {card.title}
                    </span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-sm ${
                        isComplete
                          ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-extrabold shadow-emerald-500/30 animate-pulse'
                          : (isDarkMode ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-slate-200 text-slate-700 border-slate-300')
                      }`}>
                        {isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" /> : <Clock className="w-3 h-3 text-amber-400" />}
                        {card.badgeText}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isComplete
                      ? card.completeIconBg
                      : (isDarkMode ? card.incompleteIconBg : 'bg-slate-100 border-slate-300 text-slate-700')
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Main Value Display */}
                <div className="my-4 relative z-10">
                  <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                    isComplete
                      ? (isDarkMode ? 'text-emerald-300' : 'text-emerald-950')
                      : (isDarkMode ? 'text-slate-100' : 'text-slate-900')
                  }`}>
                    {card.value}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium ${
                    isComplete
                      ? (isDarkMode ? 'text-emerald-300/80' : 'text-emerald-700')
                      : (isDarkMode ? 'text-slate-400' : 'text-slate-600')
                  }`}>
                    {card.subText}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                    <span className={isComplete ? 'text-emerald-300' : 'text-slate-400'}>
                      {isComplete ? 'Stage 100% Completed' : 'Progress'}
                    </span>
                    <span className={isComplete ? 'text-emerald-300 font-extrabold' : 'text-slate-200'}>
                      {card.percent}%
                    </span>
                  </div>

                  <div className={`w-full h-2.5 rounded-full overflow-hidden p-0.5 border ${
                    isComplete
                      ? 'bg-emerald-950/80 border-emerald-400/50'
                      : (isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300')
                  }`}>
                    <motion.div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isComplete
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-md shadow-emerald-400/50'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${card.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: QUICK METRICS CARDS */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiMetricsData.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 + 0.2 }}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className={`relative p-5 rounded-2xl bg-gradient-to-b ${
                  isDarkMode ? card.colorDark : card.colorLight
                } ${
                  isDarkMode
                    ? 'bg-[#0D0D0D] border text-slate-100'
                    : 'bg-white border shadow-md text-slate-900'
                } ${
                  isDarkMode ? card.borderDark : card.borderLight
                } flex flex-col justify-between overflow-hidden group min-h-[140px] transition-all duration-300`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl border shrink-0 group-hover:scale-110 transition-transform ${
                    isDarkMode ? card.iconBgDark : card.iconBgLight
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-1">
                  <div className={`text-3xl font-black font-mono tracking-tight ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {card.value}
                  </div>
                </div>

                <div className={`flex items-center justify-between text-xs pt-2 border-t mt-2 ${
                  isDarkMode ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span className="leading-tight text-[11px]">{card.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
