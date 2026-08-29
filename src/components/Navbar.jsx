import React from 'react';
import { 
  Atom, 
  FlaskConical, 
  Pi, 
  Flame, 
  Clock, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  Bot, 
  Zap,
  Bookmark
} from 'lucide-react';
import AmbientSound from './AmbientSound';

export default function Navbar({ activeTab, setActiveTab, analytics, onOpenZareAssessment }) {
  const streak = analytics?.profile?.streak ?? 6;
  const totalHours = analytics?.totalHours ?? 14.5;
  const level = analytics?.profile?.level ?? 'Quantum Adept';

  const navItems = [
    { id: 'studio', label: 'Study Studio', icon: Zap },
    { id: 'syllabus', label: 'NCERT Matrix', icon: BookOpen },
    { id: 'analytics', label: 'Hours & Analytics', icon: BarChart3 },
    { id: 'zare', label: 'Zare Assessor', icon: Bot, isHighlight: true },
    { id: 'formulas', label: 'Formula Vault', icon: Bookmark }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-violet-500 to-amber-400 p-[1.5px] shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300 text-lg">Z</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-lg">ZARE</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">Grade 11 NCERT</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Physics • Chemistry • Mathematics</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? item.isHighlight
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? (item.isHighlight ? 'text-slate-950' : 'text-cyan-400') : ''}`} />
                  {item.label}
                  {item.isHighlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2.5">
            {/* Ambient Sound Synthesizer */}
            <AmbientSound />

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-950/30 border border-amber-500/30 px-2.5 py-1.5 rounded-full text-xs font-bold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{streak}d</span>
            </div>

            {/* Total Hours Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{totalHours}h</span>
            </div>

            {/* Zare Quick Diagnostic Button */}
            <button
              onClick={onOpenZareAssessment}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">Assess Studies</span>
              <span className="sm:hidden">Assess</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
