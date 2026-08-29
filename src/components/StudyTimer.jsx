import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Sparkles, 
  Star,
  AlertCircle,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudyTimer({ syllabus, onSessionSaved, initialMode }) {
  const [timerType, setTimerType] = useState('pomodoro'); // 'pomodoro', 'stopwatch', 'target'
  const [targetMinutes, setTargetMinutes] = useState(45);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [distractions, setDistractions] = useState(0);

  // Subject & Topic Selector
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const timerRef = useRef(null);

  // Initialize chapters when syllabus loads or subject changes
  const chapters = syllabus ? syllabus[selectedSubject] || [] : [];
  const activeChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const topics = activeChapter?.topics || [];
  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  useEffect(() => {
    if (chapters.length && !selectedChapterId) {
      setSelectedChapterId(chapters[0].id);
    }
  }, [chapters, selectedChapterId]);

  useEffect(() => {
    if (topics.length && !selectedTopicId) {
      setSelectedTopicId(topics[0].id);
    }
  }, [topics, selectedTopicId]);

  // Handle custom initialMode preset from MotivationBanner
  useEffect(() => {
    if (initialMode) {
      const dur = initialMode.duration || 45;
      setTargetMinutes(dur);
      setTimeLeft(dur * 60);
      setIsRunning(false);
    }
  }, [initialMode]);

  // Main Timer Interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (timerType === 'stopwatch') {
          setStopwatchSeconds((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timerType, isBreak]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    // Play celebratory chime/confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (timerType === 'pomodoro' && !isBreak) {
      setShowSaveModal(true);
    } else if (timerType === 'target') {
      setShowSaveModal(true);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (timerType === 'stopwatch') {
      setStopwatchSeconds(0);
    } else {
      setTimeLeft(targetMinutes * 60);
      setIsBreak(false);
    }
    setDistractions(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const saveCurrentSession = async () => {
    let durationMins = 0;
    if (timerType === 'stopwatch') {
      durationMins = Math.max(1, Math.round(stopwatchSeconds / 60));
    } else {
      durationMins = targetMinutes;
    }

    const payload = {
      subject: selectedSubject,
      chapterId: activeChapter?.id || '',
      chapterName: activeChapter?.name || '',
      topicId: activeTopic?.id || '',
      topicTitle: activeTopic?.title || '',
      durationMinutes: durationMins,
      mode: initialMode?.id || 'deep-focus',
      rating,
      notes: sessionNotes
    };

    onSessionSaved && onSessionSaved(payload);
    setShowSaveModal(false);
    resetTimer();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  };

  // Progress circle percentage
  const totalSecs = targetMinutes * 60;
  const progressPercent = timerType === 'stopwatch' ? 100 : Math.max(0, Math.min(100, ((totalSecs - timeLeft) / totalSecs) * 100));

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-2xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Live NCERT Study Engine & Hours Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log time directly against Grade 11 NCERT chapters and verify topic retention
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              setTimerType('pomodoro');
              setTargetMinutes(45);
              setTimeLeft(45 * 60);
              setIsRunning(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timerType === 'pomodoro'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pomodoro (45m)
          </button>
          <button
            onClick={() => {
              setTimerType('stopwatch');
              setStopwatchSeconds(0);
              setIsRunning(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timerType === 'stopwatch'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stopwatch
          </button>
          <button
            onClick={() => {
              setTimerType('target');
              setTargetMinutes(30);
              setTimeLeft(30 * 60);
              setIsRunning(false);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timerType === 'target'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Target
          </button>
        </div>
      </div>

      {/* Main Grid: Timer Display + Topic Linkage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left: Timer Display (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800 shadow-inner text-center">
          
          {/* Circular Progress & Clock Face */}
          <div className="relative w-52 h-52 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800"
                strokeWidth="6"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-cyan-400 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.6))'
                }}
              />
            </svg>

            {/* Time Center */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono text-white tracking-wider">
                {timerType === 'stopwatch' ? formatTime(stopwatchSeconds) : formatTime(timeLeft)}
              </span>
              <span className="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-widest">
                {isRunning ? (isBreak ? 'Break Phase' : 'Focus Phase') : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.5)]'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700/60"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Log Session</span>
            </button>
          </div>

          {/* Distraction Tally */}
          <div className="mt-4 flex items-center justify-between w-full max-w-xs pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Distractions Logged: <strong className="text-white">{distractions}</strong></span>
            <button
              onClick={() => setDistractions((prev) => prev + 1)}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              +1 Distraction
            </button>
          </div>

        </div>

        {/* Right: Topic Linkage & Reflection Matrix (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
              1. Select NCERT Subject & Topic
            </span>

            {/* Subject Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: 'physics', label: 'Physics', color: '#00f2fe', icon: '🔭' },
                { id: 'chemistry', label: 'Chemistry', color: '#c084fc', icon: '⚗️' },
                { id: 'maths', label: 'Mathematics', color: '#10b981', icon: '📐' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubject(sub.id);
                    setSelectedChapterId('');
                    setSelectedTopicId('');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedSubject === sub.id
                      ? 'bg-slate-900 border-cyan-500/60 text-white shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* Chapter Dropdown */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">
                  Select Grade 11 Chapter:
                </label>
                <select
                  value={activeChapter?.id || ''}
                  onChange={(e) => {
                    setSelectedChapterId(e.target.value);
                    setSelectedTopicId('');
                  }}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-medium"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id} className="bg-slate-900 text-white">
                      Ch {ch.number}: {ch.name} ({ch.weightage})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Topic Dropdown */}
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">
                  Select Specific NCERT Topic:
                </label>
                <select
                  value={activeTopic?.id || ''}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white font-medium"
                >
                  {topics.map((tp) => (
                    <option key={tp.id} value={tp.id} className="bg-slate-900 text-white">
                      {tp.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Topic Card Preview */}
          {activeTopic && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-300">
                  Core Concepts in Focus:
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {activeChapter?.chapterCode}
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                {activeTopic.concepts?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Notes Input */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">
              Session Notes & Key Formula Derivations:
            </label>
            <input
              type="text"
              placeholder="e.g. Mastered projectile max range condition at θ=45°, solved 10 NCERT problems."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-200"
            />
          </div>

        </div>

      </div>

      {/* Save Session Dialog Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl animate-fadeIn">
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Log Completed Study Session</h4>
                <p className="text-xs text-slate-400">Record your hours and update NCERT progress matrix</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p><strong>Subject:</strong> <span className="capitalize text-cyan-300">{selectedSubject}</span></p>
                <p><strong>Chapter:</strong> {activeChapter?.name}</p>
                <p><strong>Topic:</strong> {activeTopic?.title}</p>
                <p><strong>Duration:</strong> {timerType === 'stopwatch' ? `${Math.round(stopwatchSeconds / 60)} mins` : `${targetMinutes} mins`}</p>
              </div>

              <div>
                <label className="font-semibold block mb-1.5 text-slate-300">Rate your conceptual clarity (1 to 5 Stars):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded-lg transition-all ${
                        rating >= star ? 'text-amber-400 bg-amber-950/40' : 'text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-300">Notes / Key Takeaways:</label>
                <textarea
                  rows="2"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Formulas memorized, doubts noted, or numericals completed..."
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentSession}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.4)]"
              >
                Confirm & Record Hours
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
