import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveData } from '../context/LiveDataContext';
import { Link, CheckCircle, UploadCloud, Layers, Clock } from 'lucide-react';

export default function IntegrationPage() {
  const {
    isDarkMode,
    integrationData,
    updateIntegrationData
  } = useLiveData();

  const [localUrl, setLocalUrl] = useState(integrationData?.integrationUrl || '');

  // Sync if integrationData changes from RTDB
  useEffect(() => {
    if (integrationData?.integrationUrl && !localUrl) {
      setLocalUrl(integrationData.integrationUrl);
    }
  }, [integrationData?.integrationUrl]);

  const handleUpload = () => {
    if (!localUrl) return;
    updateIntegrationData({
      hostingComplete: true,
      integrationUrl: localUrl,
      hostingTimestamp: Date.now()
    });
  };

  const handleComplete = () => {
    updateIntegrationData({
      integrationComplete: true,
      integrationTimestamp: Date.now()
    });
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <Layers className="w-8 h-8 text-emerald-500" />
            System Integration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure external URLs and manage integration status.
          </p>
        </div>
      </div>

      <div className={`p-8 rounded-3xl border transition-all duration-300 max-w-2xl ${isDarkMode ? 'bg-slate-900/80 border-slate-800/80 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
        }`}>
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Integration Configuration</h2>

        <div className="space-y-8">

          {/* Section 1: Mark Integration Completed */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D0D0D] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Step 1: Integration Status</h3>
            <p className="text-xs text-slate-400 mb-4">Mark the integration stage as 100% complete.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleComplete}
                disabled={integrationData?.integrationComplete}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-lg transition-all duration-200 ${integrationData?.integrationComplete
                    ? 'bg-emerald-500/50 cursor-not-allowed text-white shadow-none'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 transform hover:-translate-y-0.5'
                  }`}
              >
                <CheckCircle className="w-5 h-5" />
                {integrationData?.integrationComplete ? 'Completed' : 'Mark Completed'}
              </button>
              {integrationData?.integrationTimestamp && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(integrationData.integrationTimestamp)}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Hosting URL */}
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#0D0D0D] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Step 2: Hosting Configuration</h3>
            <p className="text-xs text-slate-400 mb-4">Upload the hosting URL to mark the Host stage as 100% complete.</p>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className={`h-5 w-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <input
                type="url"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                disabled={integrationData?.hostingComplete}
                placeholder="https://api.example.com/webhook"
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-sm transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none ${isDarkMode
                    ? 'bg-[#1A1A1A] border-slate-700 text-slate-100 placeholder-slate-600 focus:border-emerald-500 disabled:opacity-50'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500 disabled:opacity-50'
                  }`}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleUpload}
                disabled={integrationData?.hostingComplete}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-lg transition-all duration-200 ${integrationData?.hostingComplete
                    ? 'bg-[#C3F53B]/50 text-black cursor-not-allowed shadow-none'
                    : 'bg-[#C3F53B] hover:bg-[#aee623] text-black shadow-[#C3F53B]/20 transform hover:-translate-y-0.5'
                  }`}
              >
                <UploadCloud className="w-5 h-5" />
                {integrationData?.hostingComplete ? 'URL Uploaded' : 'Upload URL'}
              </button>
              {integrationData?.hostingTimestamp && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(integrationData.hostingTimestamp)}
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
