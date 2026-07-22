import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  AreaChart, Area,
  RadialBarChart, RadialBar
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export default function Charts() {
  const { students, kpis } = useLiveData();

  // 1. Student Status Distribution
  const statusCounts = students.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const statusPieData = [
    { name: 'Completed', value: statusCounts['Completed'] || 0, color: '#22C55E' },
    { name: 'Submitted', value: statusCounts['Submitted'] || 0, color: '#3B82F6' },
    { name: 'Testing', value: statusCounts['Testing'] || 0, color: '#8B5CF6' },
    { name: 'Coding', value: statusCounts['Coding'] || 0, color: '#F59E0B' },
    { name: 'Logged In', value: statusCounts['Logged In'] || 0, color: '#64748B' },
    { name: 'Offline', value: statusCounts['Offline'] || 0, color: '#334155' },
  ];

  // 2. Task Difficulty Distribution
  const diffCounts = students.reduce((acc, curr) => {
    acc[curr.difficulty] = (acc[curr.difficulty] || 0) + 1;
    return acc;
  }, {});

  const difficultyBarData = [
    { difficulty: 'Easy', count: diffCounts['Easy'] || 0, color: '#22C55E' },
    { difficulty: 'Medium', count: diffCounts['Medium'] || 0, color: '#F59E0B' },
    { difficulty: 'Hard', count: diffCounts['Hard'] || 0, color: '#EF4444' },
  ];

  // 3. Logins Throughout Event
  const loginLineData = [
    { time: '10:00 AM', logins: 12 },
    { time: '10:10 AM', logins: 28 },
    { time: '10:20 AM', logins: 42 },
    { time: '10:30 AM', logins: 47 },
    { time: '10:40 AM', logins: 50 },
  ];

  // 4. Submission Timeline
  const submissionTimelineData = [
    { time: '10:15 AM', count: 2 },
    { time: '10:30 AM', count: 8 },
    { time: '10:45 AM', count: 19 },
    { time: '11:00 AM', count: 32 },
  ];

  // 5. Radial Progress Chart
  const radialData = [
    { name: 'Overall Completion', value: kpis.overallCompletionPercentage, fill: '#3B82F6' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Event Analytics & Metrics</h3>
            <p className="text-xs text-slate-400">Recharts visual data distributions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Pie Chart */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 glass-panel space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            Student Status Distribution
            <PieIcon className="w-4 h-4 text-emerald-400" />
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bar Chart */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 glass-panel space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            Task Difficulty Distribution
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="difficulty" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {difficultyBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Line Chart */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 glass-panel space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            Logins Throughout Event
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loginLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="logins" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Area Chart */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 glass-panel space-y-2">
          <h4 className="text-sm font-bold text-slate-200">Submission Timeline</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={submissionTimelineData}>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="count" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Radial Progress Chart */}
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 glass-panel space-y-2 md:col-span-2 lg:col-span-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center justify-between">
            Radial Progress Chart - Event Completion Rate
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h4>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" barSize={15} data={radialData}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} fill="#3B82F6" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center font-mono pr-8">
              <span className="text-3xl font-black text-blue-400">{kpis.overallCompletionPercentage}%</span>
              <p className="text-xs text-slate-400 font-sans">Target: 100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
