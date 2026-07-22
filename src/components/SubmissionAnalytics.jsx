import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SubmissionAnalytics() {
  const { students, activities } = useLiveData();

  const totalSubmitted = students.filter(s => s.submissionStatus === 'Submitted').length;
  const pending = students.filter(s => s.submissionStatus === 'Pending').length;
  const late = students.filter(s => s.submissionStatus === 'Late').length;

  // Compute real average duration from Firebase submissions
  const allSubs = students.flatMap(s => s.userSubmissions || []);
  const avgSeconds = allSubs.length > 0 ? Math.round(allSubs.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / allSubs.length) : 0;
  const avgTimeFormatted = avgSeconds > 0 ? `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60}s` : 'N/A';

  // Build dynamic chart timeline from real activities / submissions
  const submissionTimeline = [];
  let cumulativeCount = 0;
  const sortedSubs = [...allSubs].sort((a, b) => (a.submittedAt || 0) - (b.submittedAt || 0));
  
  if (sortedSubs.length === 0) {
    submissionTimeline.push({ time: 'Start', submissions: 0, cumulative: 0 });
  } else {
    sortedSubs.forEach(sub => {
      cumulativeCount += 1;
      const timeLabel = sub.submittedAtISO ? new Date(sub.submittedAtISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
      submissionTimeline.push({
        time: timeLabel,
        submissions: 1,
        cumulative: cumulativeCount
      });
    });
  }

  return (
    <div className="space-y-4">
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 matte-card">
          <p className="text-xs font-semibold text-slate-400 font-mono">Total Submitted</p>
          <p className="text-2xl font-black text-[#C3F53B] font-mono mt-1">{totalSubmitted}</p>
        </div>
        <div className="p-4 matte-card">
          <p className="text-xs font-semibold text-slate-400 font-mono">Pending Review</p>
          <p className="text-2xl font-black text-white font-mono mt-1">{pending}</p>
        </div>
        <div className="p-4 matte-card border-[#FF8C00]/40">
          <p className="text-xs font-semibold text-slate-400 font-mono">Late Submissions</p>
          <p className="text-2xl font-black text-[#FF8C00] font-mono mt-1">{late}</p>
        </div>
        <div className="p-4 matte-card">
          <p className="text-xs font-semibold text-slate-400 font-mono">Avg Submission Time</p>
          <p className="text-2xl font-black text-white font-mono mt-1">{avgTimeFormatted}</p>
        </div>
      </div>

      {/* Area Chart */}
      <div className="matte-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-widest font-mono">
            SUBMISSIONS OVER TIME
          </h4>
          <span className="text-xs text-slate-400 font-mono">Cumulative count</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={submissionTimeline}>
              <defs>
                <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C3F53B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#C3F53B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#141416', borderColor: '#222226', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="cumulative" stroke="#C3F53B" strokeWidth={3} fillOpacity={1} fill="url(#submissionGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
