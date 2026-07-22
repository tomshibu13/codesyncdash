import React from 'react';
import { useLiveData } from '../context/LiveDataContext';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Award, Flame } from 'lucide-react';

export default function Leaderboard() {
  const { students } = useLiveData();

  // Top 10 sorted by score
  const top10 = [...students].sort((a, b) => b.score - a.score).slice(0, 10);
  const top3 = top10.slice(0, 3);
  // Reorder top 3 for podium display: [Silver (2nd), Gold (1st), Bronze (3rd)]
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl glass-panel space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Live CodeSync Leaderboard</h3>
            <p className="text-xs text-slate-400">Top performers evaluated by test passing rate & execution speed</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> Top 10
        </span>
      </div>

      {/* Top 3 Animated Podium */}
      <div className="grid grid-cols-3 gap-3 items-end pt-6 pb-2 px-2">
        {/* Silver - Rank 2 */}
        {podiumOrder[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-700/60 text-center relative"
          >
            <div className="absolute -top-4 p-1.5 rounded-full bg-slate-700 text-slate-300 shadow-md">
              <Medal className="w-5 h-5" />
            </div>
            <img
              src={podiumOrder[0].avatar}
              alt={podiumOrder[0].name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-400 mb-2 mt-2"
            />
            <p className="font-bold text-xs text-slate-200 truncate w-full">{podiumOrder[0].name}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{podiumOrder[0].score} pts</p>
            <div className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-700/50 text-slate-300 text-[10px] font-bold">
              2nd Place
            </div>
          </motion.div>
        )}

        {/* Gold - Rank 1 (Tallest) */}
        {podiumOrder[1] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-800 to-slate-900 border border-amber-500/50 text-center relative glow-purple scale-105 z-10"
          >
            <div className="absolute -top-5 p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg animate-bounce">
              <Crown className="w-6 h-6" />
            </div>
            <img
              src={podiumOrder[1].avatar}
              alt={podiumOrder[1].name}
              className="w-14 h-14 rounded-xl object-cover ring-4 ring-amber-400 mb-2 mt-2"
            />
            <p className="font-extrabold text-sm text-amber-300 truncate w-full">{podiumOrder[1].name}</p>
            <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">{podiumOrder[1].score} pts</p>
            <div className="mt-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              1st Champion
            </div>
          </motion.div>
        )}

        {/* Bronze - Rank 3 */}
        {podiumOrder[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-amber-900/20 to-slate-900 border border-amber-700/40 text-center relative"
          >
            <div className="absolute -top-4 p-1.5 rounded-full bg-amber-800 text-amber-300 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <img
              src={podiumOrder[2].avatar}
              alt={podiumOrder[2].name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-600/60 mb-2 mt-2"
            />
            <p className="font-bold text-xs text-slate-200 truncate w-full">{podiumOrder[2].name}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{podiumOrder[2].score} pts</p>
            <div className="mt-2 px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-400 text-[10px] font-bold">
              3rd Place
            </div>
          </motion.div>
        )}
      </div>

      {/* Ranks 4 to 10 Table */}
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">Assigned Task</th>
              <th className="py-2.5 px-3">Score</th>
              <th className="py-2.5 px-3 text-right">Completion Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {top10.slice(3).map((student, idx) => (
              <tr key={student.id} className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-400">#{idx + 4}</td>
                <td className="py-2.5 px-3 font-bold text-slate-200 flex items-center gap-2">
                  <img src={student.avatar} alt={student.name} className="w-6 h-6 rounded-lg object-cover" />
                  {student.name}
                </td>
                <td className="py-2.5 px-3 text-slate-400 truncate max-w-[160px]">{student.assignedTask}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{student.score} pts</td>
                <td className="py-2.5 px-3 font-mono text-slate-400 text-right">38m 40s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
