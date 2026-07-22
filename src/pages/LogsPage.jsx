import React, { useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Search,
  Filter,
  Download,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  Rocket,
  User,
  Copy,
  Check,
  FileCode,
  Radio,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

export default function LogsPage() {
  const { activities, students, isDarkMode } = useLiveData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'terminal' | 'submissions'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [isPaused, setIsPaused] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Combine all activities and student logs into a rich unified history feed
  const unifiedLogs = [];

  // Add all activities
  activities.forEach((act, idx) => {
    unifiedLogs.push({
      id: `act-${act.id || idx}`,
      timestamp: act.time || 'Recent',
      category: act.type === 'submit' ? 'SUBMIT' : act.type === 'deploy' ? 'DEPLOY' : act.type === 'test' ? 'TEST' : 'SYSTEM',
      message: act.text,
      user: act.text.split(' ')[0] || 'System',
      file: act.fileName || '',
      url: act.r2Url || '',
      raw: act
    });
  });

  // Add individual student log lines
  students.forEach(student => {
    (student.logs || []).forEach((logLine, idx) => {
      let category = 'INFO';
      if (logLine.includes('[SUBMIT]')) category = 'SUBMIT';
      else if (logLine.includes('[SYSTEM]')) category = 'SYSTEM';
      else if (logLine.includes('[ERROR]')) category = 'ERROR';
      else if (logLine.includes('[DEPLOY]')) category = 'DEPLOY';

      unifiedLogs.push({
        id: `log-${student.id}-${idx}`,
        timestamp: student.loginTime || 'Active',
        category,
        message: logLine.replace(/^\[[A-Z]+\]\s*/, ''),
        user: student.name,
        file: student.lastSubmissionFile || '',
        url: student.liveUrl || '',
        raw: logLine
      });
    });
  });

  // Filter unified logs
  const filteredLogs = unifiedLogs.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterType === 'All' || item.category === filterType;
    return matchesSearch && matchesCategory;
  });

  // All submissions across students
  const allSubmissionsList = students.flatMap(s => (s.userSubmissions || []).map(sub => ({
    ...sub,
    studentName: s.name,
    studentAvatar: s.avatar,
    studentEmail: s.email
  })));

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp,Category,User,Message,File,URL\n'];
    const rows = filteredLogs.map(l => `"${l.timestamp}","${l.category}","${l.user}","${l.message.replace(/"/g, '""')}","${l.file}","${l.url}"`);
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codesync_logs_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getBadgeStyle = (cat) => {
    switch (cat) {
      case 'SUBMIT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'DEPLOY':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'SYSTEM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ERROR':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#111111] text-[#C3F53B] border border-[#1A1A1A] shadow-md">
            <Terminal className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight font-mono">
                CodeSync Logs & Complete History
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#C3F53B]/20 text-[#C3F53B] text-[10px] font-extrabold uppercase font-mono border border-[#C3F53B]/30">
                Live RTDB Feed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time audit trail of all student coding sessions, archive submissions (`ticket*.zip`), and system events
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono inline-flex items-center gap-2 border transition-all ${
              isPaused
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            <span>{isPaused ? 'Stream Paused' : 'Live Streaming'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#1E1E22] hover:bg-[#28282E] text-white text-xs font-bold font-mono inline-flex items-center gap-2 border border-[#2A2A30] transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-[#C3F53B]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 matte-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Total History Events</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{unifiedLogs.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 matte-card border-[#C3F53B]/40 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Recorded Submissions</p>
            <p className="text-2xl font-black text-[#C3F53B] font-mono mt-1">{allSubmissionsList.length || activities.filter(a => a.type === 'submit').length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#C3F53B]/10 text-[#C3F53B]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 matte-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Active Students Logged</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{students.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 matte-card flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono uppercase">Database Status</p>
            <p className="text-lg font-black text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Synchronized
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Radio className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('stream')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
            activeTab === 'stream'
              ? 'bg-[#C3F53B] text-black shadow-md shadow-[#C3F53B]/20'
              : 'bg-[#111111] text-slate-400 hover:text-white border border-[#1A1A1A]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Unified Event Stream ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
            activeTab === 'terminal'
              ? 'bg-[#C3F53B] text-black shadow-md shadow-[#C3F53B]/20'
              : 'bg-[#111111] text-slate-400 hover:text-white border border-[#1A1A1A]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Per-Student Console Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'bg-[#C3F53B] text-black shadow-md shadow-[#C3F53B]/20'
              : 'bg-[#111111] text-slate-400 hover:text-white border border-[#1A1A1A]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete Submissions Archive ({allSubmissionsList.length})</span>
        </button>
      </div>

      {/* TAB 1: UNIFIED EVENT STREAM */}
      {activeTab === 'stream' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history by student name, log message, or filename..."
                className="w-full pl-10 pr-4 py-2 bg-[#141416] border border-[#222226] rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#C3F53B]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#141416] border border-[#222226] text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="SUBMIT">Submissions Only</option>
                <option value="SYSTEM">System Events</option>
                <option value="INFO">Console Info</option>
                <option value="DEPLOY">Deployments</option>
              </select>
            </div>
          </div>

          {/* Unified Logs Table / List */}
          <div className="matte-card overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1E1E22] text-slate-400 border-b border-[#2A2A30] uppercase tracking-wider font-extrabold">
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">User / Student</th>
                    <th className="py-3.5 px-4">Event Description / Log Output</th>
                    <th className="py-3.5 px-4">Archive File</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222226]">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 font-sans">
                        No log entries found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1E1E22]/50 transition-colors">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{item.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getBadgeStyle(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white font-sans">{item.user}</td>
                        <td className="py-3 px-4 text-slate-200 font-sans">{item.message}</td>
                        <td className="py-3 px-4 text-[#C3F53B]">
                          {item.file ? (
                            <span className="px-2 py-0.5 rounded bg-[#1A1A1A] text-[11px] font-mono border border-[#2A2A30]">
                              {item.file}
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-[#141416] hover:bg-[#222226] text-[#C3F53B] border border-[#222226] inline-flex items-center gap-1 text-[11px]"
                                title="Download / Open R2 URL"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleCopy(`${item.timestamp} [${item.category}] ${item.user}: ${item.message}`, item.id)}
                              className="p-1.5 rounded-lg bg-[#141416] hover:bg-[#222226] text-slate-300 border border-[#222226]"
                              title="Copy log entry"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PER-STUDENT CONSOLE TERMINAL */}
      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Student Selector Sidebar */}
          <div className="lg:col-span-1 matte-card p-4 space-y-3 h-fit">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">
              Select Student Console
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {students.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudentId(st.id)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all font-sans ${
                    selectedStudent?.id === st.id
                      ? 'bg-[#C3F53B] text-black font-extrabold shadow-md shadow-[#C3F53B]/20'
                      : 'bg-[#141416] text-slate-300 hover:bg-[#1E1E22] border border-[#222226]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={st.avatar} alt={st.name} className="w-6 h-6 rounded-lg object-cover" />
                    <span className="text-xs truncate">{st.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    selectedStudent?.id === st.id ? 'bg-black/20 text-black font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {(st.logs || []).length} logs
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Box */}
          <div className="terminal-box lg:col-span-3 matte-card p-5 bg-[#0D0D0D] border border-[#222226] space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#222226] pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-bold text-slate-300">
                  codesync_console — {selectedStudent?.name || 'Student'} ({selectedStudent?.id})
                </span>
              </div>
              <span className="text-[11px] text-[#C3F53B] bg-[#C3F53B]/10 px-2.5 py-1 rounded-lg border border-[#C3F53B]/20 font-bold">
                Status: {selectedStudent?.status}
              </span>
            </div>

            <div className="terminal-box bg-black/90 p-4 rounded-xl border border-[#1A1A1A] min-h-[360px] max-h-[500px] overflow-y-auto space-y-2 text-xs leading-relaxed">
              <p className="text-slate-500">// Connected to CodeSync Realtime Debugger session for {selectedStudent?.name}</p>
              <p className="text-slate-500">// Assigned Task: {selectedStudent?.assignedTask}</p>
              <div className="border-t border-[#1A1A1A] my-2 pt-2" />

              {(selectedStudent?.logs || []).length === 0 ? (
                <p className="text-slate-600 italic">No console logs outputted by student yet.</p>
              ) : (
                (selectedStudent?.logs || []).map((logLine, idx) => (
                  <div key={idx} className="flex items-start gap-3 hover:bg-white/[0.03] p-1 rounded transition-colors">
                    <span className="text-slate-600 select-none font-bold">[{idx + 1}]</span>
                    <span className={`flex-1 ${
                      logLine.includes('[SUBMIT]') ? 'text-[#C3F53B] font-bold' :
                      logLine.includes('[ERROR]') ? 'text-red-400 font-bold' :
                      logLine.includes('[SYSTEM]') ? 'text-blue-400' : 'text-slate-300'
                    }`}>
                      {logLine}
                    </span>
                  </div>
                ))
              )}
            </div>

            {selectedStudent?.liveUrl && (
              <div className="p-3 rounded-xl bg-[#141416] border border-[#222226] flex items-center justify-between text-xs">
                <span className="text-slate-400">Recorded Submission Link:</span>
                <a href={selectedStudent.liveUrl} target="_blank" rel="noreferrer" className="text-[#C3F53B] hover:underline flex items-center gap-1 font-bold">
                  {selectedStudent.liveUrl} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETE SUBMISSIONS ARCHIVE */}
      {activeTab === 'submissions' && (
        <div className="matte-card p-5 space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#222226] pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Complete Submissions Archive (`ticket*.zip` / Repositories)
            </h3>
            <span className="text-slate-400">Total: {allSubmissionsList.length} files</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1E1E22] text-slate-400 border-b border-[#2A2A30] uppercase tracking-wider font-extrabold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Task ID / Challenge</th>
                  <th className="py-3 px-4">Submitted File</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-right">Download Archive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222226]">
                {allSubmissionsList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500 font-sans">
                      No complete file archives recorded in Firebase RTDB (`logs/all_submissions`).
                    </td>
                  </tr>
                ) : (
                  allSubmissionsList.map((sub, i) => (
                    <tr key={sub.id || i} className="hover:bg-[#1E1E22]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-white font-sans flex items-center gap-2">
                        <img src={sub.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt="" className="w-6 h-6 rounded-lg object-cover" />
                        <span>{sub.studentName || sub.displayName || 'Student'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans">{sub.taskId || 'Task'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded bg-[#C3F53B]/10 text-[#C3F53B] font-bold border border-[#C3F53B]/30 inline-flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5" /> {sub.fileName || 'archive.zip'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {sub.durationSeconds ? `${Math.floor(sub.durationSeconds / 60)}m ${sub.durationSeconds % 60}s` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {sub.submittedAtISO ? new Date(sub.submittedAtISO).toLocaleString() : 'Recent'}
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        {sub.r2Url ? (
                          <a
                            href={sub.r2Url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-[#C3F53B] hover:bg-[#b0df32] text-black text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-md"
                          >
                            Download <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">No Link</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
