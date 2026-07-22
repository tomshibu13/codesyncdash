import React from 'react';
import { useLiveData } from '../context/LiveDataContext';

export default function IntegrationPanel() {
  const { students } = useLiveData();

  const started = students.filter(s => s.integrationStarted).length;
  const completed = students.filter(s => s.integrationPassed && !s.integrationPassed.startsWith('0')).length;
  const passed = completed;
  const failed = students.filter(s => s.integrationStarted && s.integrationPassed.startsWith('0')).length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 matte-card">
          <p className="text-xs font-semibold text-slate-400 font-mono">Integration Started</p>
          <p className="text-2xl font-black text-white font-mono mt-1">{started}</p>
        </div>
        <div className="p-4 matte-card">
          <p className="text-xs font-semibold text-slate-400 font-mono">Completed Suites</p>
          <p className="text-2xl font-black text-[#C3F53B] font-mono mt-1">{completed}</p>
        </div>
        <div className="p-4 matte-card border-[#C3F53B]/40">
          <p className="text-xs font-semibold text-slate-400 font-mono">Suites Passed</p>
          <p className="text-2xl font-black text-[#C3F53B] font-mono mt-1">{passed}</p>
        </div>
        <div className="p-4 matte-card border-[#FF8C00]/40">
          <p className="text-xs font-semibold text-slate-400 font-mono">Suites Failed</p>
          <p className="text-2xl font-black text-[#FF8C00] font-mono mt-1">{failed}</p>
        </div>
      </div>

      {/* Table */}
      <div className="matte-card p-5 space-y-3">
        <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">
          INTEGRATION BENCHMARK EXECUTION
        </h4>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E1E22] text-slate-400 border-b border-[#2A2A30] uppercase tracking-wider font-extrabold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222226]">
              {students.slice(0, 8).map((student) => (
                <tr key={student.id} className="hover:bg-[#1E1E22]/50">
                  <td className="py-3 px-4 font-bold text-white font-sans">{student.name}</td>
                  <td className="py-3 px-4 text-slate-400">{student.integrationStarted ? '10:30 AM' : 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-400">{student.status === 'Completed' ? '10:48 AM' : 'In Progress'}</td>
                  <td className="py-3 px-4 text-slate-300">18m 24s</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      student.integrationStarted ? 'bg-[#C3F53B] text-black' : 'bg-[#1E1E22] text-slate-400'
                    }`}>
                      {student.integrationStarted ? 'Passed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
