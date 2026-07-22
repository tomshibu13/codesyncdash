import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { Rocket, AlertTriangle, CheckCircle, Terminal, ExternalLink } from 'lucide-react';

export default function BuildDeployment() {
  const { students, setSelectedLogsModal } = useLiveData();

  const successBuilds = students.filter(s => s.buildStatus === 'Successful').length;
  const failedBuilds = students.filter(s => s.buildStatus === 'Failed').length;
  const deploySuccess = students.filter(s => s.deploymentStatus === 'Live').length;
  const deployFailed = students.filter(s => s.deploymentStatus === 'Failed').length;

  return (
    <div className="space-y-4">
      {/* Large Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 matte-card border-[#C3F53B]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Successful Builds</p>
            <p className="text-2xl font-black text-[#C3F53B] font-mono mt-1">{successBuilds}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#C3F53B]/10 text-[#C3F53B]">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 matte-card border-[#FF8C00]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Failed Builds</p>
            <p className="text-2xl font-black text-[#FF8C00] font-mono mt-1">{failedBuilds}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#FF8C00]/10 text-[#FF8C00]">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 matte-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Deployment Success</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{deploySuccess}</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 text-white">
            <Rocket className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 matte-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Deployment Failed</p>
            <p className="text-2xl font-black text-slate-400 font-mono mt-1">{deployFailed}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#1E1E22] text-slate-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="matte-card p-5 space-y-3">
        <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">
          LIVE DEPLOYMENT ENVIRONMENTS
        </h4>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E1E22] text-slate-400 border-b border-[#2A2A30] uppercase tracking-wider font-extrabold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Build Status</th>
                <th className="py-3 px-4">Deployment Status</th>
                <th className="py-3 px-4">Live URL</th>
                <th className="py-3 px-4 text-right">Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222226]">
              {students.slice(0, 8).map((student) => (
                <tr key={student.id} className="hover:bg-[#1E1E22]/50">
                  <td className="py-3 px-4 font-bold text-white font-sans">{student.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      student.buildStatus === 'Successful' ? 'bg-[#C3F53B] text-black' :
                      student.buildStatus === 'Failed' ? 'bg-[#FF8C00] text-black' : 'bg-[#1E1E22] text-slate-400'
                    }`}>
                      {student.buildStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      student.deploymentStatus === 'Live' ? 'bg-white text-black' : 'bg-[#1E1E22] text-slate-400'
                    }`}>
                      {student.deploymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#C3F53B]">
                    <a href={student.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      {student.liveUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedLogsModal(student)}
                      className="px-3 py-1.5 rounded-xl bg-[#1E1E22] hover:bg-[#28282E] text-white text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border border-[#2A2A30]"
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#FF8C00]" /> Logs
                    </button>
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
