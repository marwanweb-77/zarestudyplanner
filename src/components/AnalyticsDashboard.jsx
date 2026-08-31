import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  BookOpen,
  Trash2,
  CheckCircle,
  Zap
} from 'lucide-react';

export default function AnalyticsDashboard({ analytics, sessions, onDeleteSession, onJumpToSyllabus }) {
  if (!analytics) {
    return (
      <div className="w-full glass-panel rounded-3xl p-8 text-center text-slate-400">
        Loading analytics engine...
      </div>
    );
  }

  const {
    totalHours,
    todayHours,
    targetHoursDaily,
    streakDays,
    subjectBreakdown,
    topicStats,
    last14Days,
    weakTopics,
    profile
  } = analytics;

  const physicsHrs = subjectBreakdown?.physicsHours || 0;
  const chemHrs = subjectBreakdown?.chemistryHours || 0;
  const mathsHrs = subjectBreakdown?.mathsHours || 0;
  const totalSubHrs = physicsHrs + chemHrs + mathsHrs || 1;

  const phyPct = Math.round((physicsHrs / totalSubHrs) * 100);
  const chemPct = Math.round((chemHrs / totalSubHrs) * 100);
  const mathPct = Math.round((mathsHrs / totalSubHrs) * 100);

  // Daily target progress
  const targetProgress = Math.min(100, Math.round((todayHours / targetHoursDaily) * 100));

  // Find max daily hours for scaling bars
  const maxDayHours = Math.max(...last14Days.map(d => d.totalHours), 5);

  return (
    <div className="space-y-8 mb-8">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Hours */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Studied</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{totalHours}</span>
            <span className="text-sm font-semibold text-slate-400">hours</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Cumulative Grade 11 focus time</p>
        </div>

        {/* Card 2: Today's Goal Progress */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Target</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{todayHours}</span>
            <span className="text-sm font-semibold text-slate-400">/ {targetHoursDaily} hrs</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
        </div>

        {/* Card 3: Study Streak */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{streakDays}</span>
            <span className="text-sm font-semibold text-amber-400">consecutive days</span>
          </div>
          <p className="text-[11px] text-amber-400/80 mt-2">
            {streakDays > 0 ? 'Momentum is strong • Keep it rolling!' : 'Start your first focus session today to build momentum!'}
          </p>
        </div>

        {/* Card 4: Level & XP */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scholar Rank</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white">{profile?.level || 'Quantum Initiate'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">{profile?.xp || 0} Total XP Earned</p>
        </div>

      </div>

      {/* Main Charts Row: 14-Day Hours Bar Chart + Subject Ratio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Study Hours Histogram (8 Cols) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Daily Study Hours (Last 14 Days)</span>
              </h3>
              <p className="text-xs text-slate-400">Track your daily study consistency and subject allocations</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400" /> Physics</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-400" /> Chemistry</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> Maths</span>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-800">
            {last14Days.map((day, idx) => {
              const heightPct = Math.min(100, Math.round((day.totalHours / maxDayHours) * 100));
              const phyH = day.totalHours ? (day.physics / day.totalHours) * 100 : 0;
              const chemH = day.totalHours ? (day.chemistry / day.totalHours) * 100 : 0;
              const mathH = day.totalHours ? (day.maths / day.totalHours) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 bg-slate-900 border border-slate-700 px-2 py-1 rounded-md text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    <strong>{day.label}:</strong> {day.totalHours.toFixed(1)} hrs
                  </div>

                  {/* Stacked Bar */}
                  <div
                    className="w-full max-w-[28px] rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-500 group-hover:brightness-125 shadow-lg"
                    style={{ height: `${Math.max(4, heightPct)}%` }}
                  >
                    {day.physics > 0 && (
                      <div className="bg-cyan-400" style={{ height: `${phyH}%` }} />
                    )}
                    {day.chemistry > 0 && (
                      <div className="bg-purple-400" style={{ height: `${chemH}%` }} />
                    )}
                    {day.maths > 0 && (
                      <div className="bg-emerald-400" style={{ height: `${mathH}%` }} />
                    )}
                    {day.totalHours === 0 && (
                      <div className="bg-slate-800 h-full w-full opacity-40" />
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 mt-2 truncate w-full text-center">
                    {day.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Subject Ratio & Mastery Meter (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Subject Time Split</h3>
            <p className="text-xs text-slate-400 mb-6">Proportional hours across Grade 11 syllabus</p>

            <div className="space-y-4">
              
              {/* Physics */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <span>🔭 Physics</span>
                  </span>
                  <span className="font-mono text-slate-300">{physicsHrs}h ({phyPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${phyPct}%` }} />
                </div>
              </div>

              {/* Chemistry */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <span>⚗️ Chemistry</span>
                  </span>
                  <span className="font-mono text-slate-300">{chemHrs}h ({chemPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${chemPct}%` }} />
                </div>
              </div>

              {/* Maths */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>📐 Mathematics</span>
                  </span>
                  <span className="font-mono text-slate-300">{mathsHrs}h ({mathPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${mathPct}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Overall NCERT Mastery:</span>
              <strong className="text-cyan-400 font-mono font-bold text-sm">
                {topicStats?.overallMasteryPct || 0}%
              </strong>
            </div>
            <p className="text-[11px] text-slate-500">
              {topicStats?.totalMastered || 0} of {topicStats?.totalTopics || 37} topics marked Mastered
            </p>
          </div>
        </div>

      </div>

      {/* Weak Areas Radar & Retention Alerts */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              Zare's Retention Alert Queue (Topics Needing Revision)
            </h3>
          </div>
          <button
            onClick={onJumpToSyllabus}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View Full Matrix →
          </button>
        </div>

        {weakTopics.length === 0 ? (
          <div className="text-xs text-emerald-400 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Zero critical weak topics detected! Your active recall schedule is optimal.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakTopics.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {item.subject}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.chapter}</span>
                  </div>
                  <h5 className="text-xs font-bold text-white mb-2">{item.title}</h5>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Confidence: {item.confidence || 1}/5</span>
                  <button
                    onClick={onJumpToSyllabus}
                    className="text-cyan-400 font-semibold hover:underline"
                  >
                    Review Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session History Log Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800/80 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Logged Study Sessions</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{sessions.length} sessions total</span>
        </div>

        {sessions.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No study sessions logged yet. Start your first session in the Studio!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Chapter & Topic</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {sessions.slice(0, 10).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400">{s.date}</td>
                    <td className="py-3 px-3 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.subject === 'physics' ? 'badge-phy' : s.subject === 'chemistry' ? 'badge-chem' : 'badge-math'
                      }`}>
                        {s.subject}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{s.chapterName}</div>
                      <div className="text-[11px] text-slate-400">{s.topicTitle}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {s.durationMinutes} mins
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      {s.notes || '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteSession && onDeleteSession(s.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete Session Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
