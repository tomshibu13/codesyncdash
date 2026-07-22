import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, CheckCircle2, Loader2 } from 'lucide-react';

export default function ReportCards() {
  const [downloading, setDownloading] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const handleExport = (type) => {
    setDownloading(type);
    setTimeout(() => {
      setDownloading(null);
      setSuccessToast(`${type} generated and saved to downloads!`);
      setTimeout(() => setSuccessToast(''), 4000);
    }, 1500);
  };

  const reports = [
    { title: "Export CSV Data", desc: "Raw student scores & test metrics", icon: FileSpreadsheet, type: "CSV Export", border: "border-[#C3F53B]/40" },
    { title: "Export Excel Workbook", desc: "Formatted spreadsheets with pivot tabs", icon: FileSpreadsheet, type: "Excel File", border: "border-[#FF8C00]/40" },
    { title: "Generate PDF Audit", desc: "Official CodeSync evaluation summary", icon: FileText, type: "PDF Audit Report", border: "border-white/40" },
    { title: "Download Full Report", desc: "Complete ZIP package with source logs", icon: Download, type: "ZIP Archive", border: "border-[#222226]" }
  ];

  return (
    <div className="space-y-4">
      {successToast && (
        <div className="p-3 rounded-2xl bg-[#C3F53B]/20 border border-[#C3F53B] text-[#C3F53B] text-xs font-bold flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4" /> {successToast}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((r) => {
          const Icon = r.icon;
          const isLoading = downloading === r.type;
          return (
            <div key={r.title} className={`p-5 matte-card ${r.border} space-y-3 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-white uppercase font-mono">{r.title}</span>
                  <Icon className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400 font-sans">{r.desc}</p>
              </div>

              <button
                onClick={() => handleExport(r.type)}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#1E1E22] hover:bg-[#28282E] text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-[#2A2A30] disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-[#C3F53B]" />}
                {isLoading ? 'Generating...' : 'Download UI'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
