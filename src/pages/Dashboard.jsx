import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Zap } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import ProgressSection from '../components/ProgressSection';

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      {/* First Row: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            Live Event Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor student progress, testing, submissions and evaluations in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Event Running
          </div>
        </div>
      </div>

      {/* KPI Cards (14) */}
      <section>
        <DashboardCards />
      </section>

      {/* Live Event Progress Bar */}
      <section>
        <ProgressSection />
      </section>


    </motion.div>
  );
}
