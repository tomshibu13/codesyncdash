import React, { useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  Clock,
  ExternalLink,
  ChevronDown,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Edit3,
  Check,
  X
} from 'lucide-react';

export default function StudentTable({ limit }) {
  const {
    students,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    taskFilter,
    setTaskFilter,
    submissionFilter,
    setSubmissionFilter,
    sortBy,
    setSortBy,
    setSelectedStudentModal,
    setSelectedLogsModal,
    updateStudentTimer,
    isDarkMode
  } = useLiveData();

  const [page, setPage] = useState(1);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentEditMins, setStudentEditMins] = useState(20);
  const pageSize = limit || 10;

  // Filter logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.assignedTask.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesTask = taskFilter === 'All' || student.assignedTask.includes(taskFilter);
    const matchesSubmission = submissionFilter === 'All' || student.submissionStatus === submissionFilter;

    return matchesSearch && matchesStatus && matchesTask && matchesSubmission;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'progress') return b.progress - a.progress;
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'timer') return a.timerRemaining - b.timerRemaining;
    return 0;
  });

  const paginatedStudents = limit ? sortedStudents.slice(0, limit) : sortedStudents.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedStudents.length / pageSize);

  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Submitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Testing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Coding':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Logged In':
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const formatTimer = (secs) => {
    if (secs <= 0) return <span className="text-red-400 font-bold">Expired</span>;
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleSaveStudentTimer = (studentId) => {
    if (updateStudentTimer) {
      updateStudentTimer(studentId, Math.max(0, studentEditMins * 60));
    }
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-4">
      {/* Filters & Control Bar */}
      {!limit && (
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 transition-colors ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800/80 glass-panel' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Status Filter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`bg-transparent focus:outline-none cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
              >
                <option value="All">All Statuses</option>
                <option value="Offline">Offline</option>
                <option value="Logged In">Logged In</option>
                <option value="Coding">Coding</option>
                <option value="Testing">Testing</option>
                <option value="Submitted">Submitted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Submission Filter */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-slate-400 font-medium">Submission:</span>
              <select
                value={submissionFilter}
                onChange={(e) => setSubmissionFilter(e.target.value)}
                className={`bg-transparent focus:outline-none cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
              >
                <option value="All">All Submissions</option>
                <option value="Submitted">Submitted</option>
                <option value="Pending">Pending</option>
                <option value="Late">Late</option>
              </select>
            </div>

            {/* Sort By */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`bg-transparent focus:outline-none cursor-pointer ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
              >
                <option value="name">Name</option>
                <option value="progress">Highest Progress</option>
                <option value="score">Highest Score</option>
                <option value="timer">Remaining Time</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className={isDarkMode ? 'text-slate-100 font-bold' : 'text-slate-900 font-bold'}>{sortedStudents.length}</span> students
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors ${
        isDarkMode ? 'border-slate-800/80 bg-slate-900/60 backdrop-blur-xl' : 'border-slate-200 bg-white shadow-slate-200/60'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`uppercase tracking-wider font-semibold border-b transition-colors ${
                isDarkMode ? 'bg-slate-900/90 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Login Time</th>
                <th className="py-3.5 px-4">Assigned Task</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timer</th>
                <th className="py-3.5 px-4">Submission</th>
                <th className="py-3.5 px-4 text-right">Actions & Logs</th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedLogsModal(student)}
                    className={`transition-colors group cursor-pointer ${
                      isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className={`font-bold transition-colors group-hover:text-blue-500 ${
                            isDarkMode ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {student.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">{student.id} • {student.email}</span>
                            <span className="px-1.5 py-0.2 rounded bg-[#C3F53B]/10 text-[#C3F53B] font-mono text-[9px] font-bold border border-[#C3F53B]/30 uppercase">
                              {student.role || 'dev'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Login Time */}
                    <td className={`py-3 px-4 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {student.loginTime}
                    </td>

                    {/* Task */}
                    <td className="py-3 px-4">
                      <span className={`font-medium block truncate max-w-[180px] ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {student.assignedTask}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getStatusChip(student.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {student.status}
                      </span>
                    </td>

                    {/* Remaining Time & Edit */}
                    <td className="py-3 px-4 font-mono">
                      {editingStudentId === student.id ? (
                        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                          <input
                            type="number"
                            min="0"
                            max="600"
                            value={studentEditMins}
                            onChange={(e) => setStudentEditMins(Math.max(0, parseInt(e.target.value, 10) || 0))}
                            className="w-12 py-0.5 px-1 rounded bg-black text-white text-center text-xs border border-slate-600 focus:outline-none focus:border-[#C3F53B]"
                            title="Minutes"
                          />
                          <span className="text-[10px] text-slate-400">m</span>
                          <button
                            onClick={() => handleSaveStudentTimer(student.id)}
                            className="p-1 rounded bg-[#C3F53B] text-black hover:bg-[#b0df32]"
                            title="Save Timer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingStudentId(null)}
                            className="p-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatTimer(student.timerRemaining)}
                          </div>
                          <button
                            onClick={() => {
                              setEditingStudentId(student.id);
                              setStudentEditMins(Math.floor((student.timerRemaining || 0) / 60));
                            }}
                            className={`p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-all ${
                              isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-[#C3F53B]' : 'hover:bg-slate-200 text-slate-600 hover:text-blue-600'
                            }`}
                            title="Adjust Student Timer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Submission */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${student.submissionStatus === 'Submitted'
                        ? 'bg-blue-500/10 text-blue-400'
                        : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {student.submissionStatus}
                      </span>
                    </td>

                    {/* Actions & Logs */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLogsModal(student)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isDarkMode
                              ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300'
                          }`}
                          title="View Login & Console Logs"
                        >
                          <Terminal className="w-3.5 h-3.5" /> View Logs
                        </button>
                        <button
                          onClick={() => setSelectedStudentModal(student)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                            isDarkMode
                              ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300'
                          }`}
                          title="Open Evaluation Form"
                        >
                          <Eye className="w-3.5 h-3.5" /> Evaluate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!limit && totalPages > 1 && (
          <div className={`p-3 border-t flex items-center justify-between text-xs transition-colors ${
            isDarkMode ? 'border-slate-800/80 bg-slate-900/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={`px-3 py-1 rounded-lg disabled:opacity-50 font-medium transition-colors ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800'
                }`}
              >
                Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={`px-3 py-1 rounded-lg disabled:opacity-50 font-medium transition-colors ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
