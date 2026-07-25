import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, CheckCircle, X, ExternalLink } from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import ProgressSection from '../components/ProgressSection';
import { useLiveData } from '../context/LiveDataContext';

export default function Dashboard() {
  const { isDarkMode, integrationData } = useLiveData();
  const [showIntegrationPopup, setShowIntegrationPopup] = useState(false);

  useEffect(() => {
    if (integrationData?.hostingComplete && integrationData?.integrationUrl) {
      const hasSeen = sessionStorage.getItem(`seen_integration_${integrationData.hostingTimestamp}`);
      if (!hasSeen) {
        setShowIntegrationPopup(true);
      }
    }
  }, [integrationData?.hostingComplete, integrationData?.integrationUrl, integrationData?.hostingTimestamp]);

  const closePopup = () => {
    setShowIntegrationPopup(false);
    if (integrationData?.hostingTimestamp) {
      sessionStorage.setItem(`seen_integration_${integrationData.hostingTimestamp}`, 'true');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12 relative"
    >
      {/* First Row: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
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

      {/* Integration Popup */}
      <AnimatePresence>
        {showIntegrationPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden p-8 sm:p-12 text-center ${
                isDarkMode ? 'bg-[#0D0D0D] border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-300'
              }`}
            >
              <button
                onClick={closePopup}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
                  isDarkMode ? 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto w-20 h-20 mb-6 bg-[#C3F53B]/10 rounded-2xl flex items-center justify-center border border-[#C3F53B]/20 relative">
                <div className="absolute inset-0 rounded-2xl bg-[#C3F53B]/20 animate-ping opacity-20"></div>
                <CheckCircle className="w-10 h-10 text-[#C3F53B]" />
              </div>

              <h2 className={`text-3xl sm:text-4xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Mission Complete
              </h2>

              <p className={`text-sm sm:text-base mb-8 max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                The integration URL has been successfully captured. The project is now actively hosted and available on the platform.
              </p>

              <div className={`mx-auto p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-col min-w-0 text-left w-full pl-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Active URL
                  </span>
                  <span className={`text-sm sm:text-base font-mono truncate mt-0.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {integrationData.integrationUrl}
                  </span>
                </div>
                <a
                  href={integrationData.integrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 flex-shrink-0 ${
                    isDarkMode ? 'bg-[#C3F53B] text-black hover:bg-[#aee623] shadow-lg shadow-[#C3F53B]/10' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit URL
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
