import React from 'react';
import ReportCards from '../components/ReportCards';
import { FileSpreadsheet } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Export & Audit Reports</h1>
          <p className="text-xs text-slate-400">Generate CSV, Excel, PDF summaries and ZIP archives for grading audits</p>
        </div>
      </div>

      <ReportCards />
    </div>
  );
}
