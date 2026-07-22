import React from 'react';
import StudentTable from '../components/StudentTable';
import { Users } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Student Directory & Live Monitoring</h1>
          <p className="text-xs text-slate-400">Detailed student evaluation directory, status filters, and live search</p>
        </div>
      </div>

      <StudentTable />
    </div>
  );
}
