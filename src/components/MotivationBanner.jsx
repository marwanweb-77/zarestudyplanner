import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Quote, 
  Lightbulb, 
  ArrowRight, 
  BrainCircuit, 
  Zap, 
  Flame, 
  RefreshCw,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import WarpText from './WarpText';

export default function MotivationBanner({ quotesData, onSelectSessionMode, onLaunchQuickTopic }) {
  const quotes = quotesData?.quotes || [];
  const mindBenders = quotesData?.mindBenders || [];
  const sessionModes = quotesData?.sessionModes || [];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mindBenderIndex, setMindBenderIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeMode, setActiveMode] = useState('deep-focus');

  // Rotate quotes periodically or on click
  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % (quotes.length || 1));
  };

  const nextMindBender = () => {
    setShowAnswer(false);
    setMindBenderIndex((prev) => (prev + 1) % (mindBenders.length || 1));
  };

  const currentQuote = quotes[quoteIndex] || {
    author: 'Richard Feynman',
    subject: 'Physics',
    text: "I would rather have questions that can't be answered than answers that can't be questioned.",
    context: 'Focus on first principles behind every Grade 11 derivation.'
  };

  const currentMindBender = mindBenders[mindBenderIndex] || {
    subject: 'Physics',
    title: 'Can Acceleration Be Non-Zero When Velocity Is Zero?',
    teaser: 'Think of a ball thrown vertically upward at the very peak of its trajectory.',
    explanation: 'Yes! At the top, v=0 momentarily, but g=9.8 m/s² downwards remains constant. If a=0, it would float in mid-air!'
  };

  return (
    <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-slate-800/80 p-6 md:p-8 shadow-2xl mb-8">
      {/* Background ambient glow circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* WebGL WarpText Hero Headline */}
      <div className="w-full relative mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] uppercase tracking-widest font-bold text-cyan-400">Quantum Mindset Engine</span>
          </div>
          <span className="text-xs text-slate-400">Interactive Glass Refraction</span>
        </div>

        {/* The interactive WarpText shader */}
        <div className="h-28 sm:h-36 w-full rounded-2xl bg-gradient-to-b from-slate-950/60 to-slate-900/60 border border-slate-800/60 overflow-hidden shadow-inner">
          <WarpText
            text="IGNITE YOUR MASTERY"
            color="#f1f5f9"
            warpStrength={0.09}
            warpScale={1.8}
            speed={0.6}
            pointerInfluence={0.45}
            pointerStrength={0.4}
            refraction={0.022}
            ripple={true}
            fontSize="clamp(1.8rem, 5.5vw, 4.2rem)"
            fontWeight={900}
            fontFamily="Outfit, sans-serif"
            letterSpacing="-0.03em"
            style={{ height: '100%' }}
          />
        </div>
      </div>

      {/* Grid: Quote of the Session + Mind-Bender of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Quote Card (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Mindset Ignition • {currentQuote.subject}
                </span>
              </div>
              <button
                onClick={nextQuote}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 bg-slate-800/60 hover:bg-slate-800 px-2 py-1 rounded-md transition-all"
                title="Shuffle Mindset Quote"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next Thought</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
              "{currentQuote.text}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-cyan-300">{currentQuote.author}</span>
              {currentQuote.role && (
                <span className="text-[11px] text-slate-400 ml-1.5">— {currentQuote.role}</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              💡 {currentQuote.context}
            </p>
          </div>
        </div>

        {/* Mind-Bender / Conceptual Intuition Check (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-violet-950/20 via-slate-900/60 to-slate-950/60 border border-violet-800/40 hover:border-violet-600/60 transition-all shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Concept Mind-Bender
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-700/50">
                  {currentMindBender.subject}
                </span>
              </div>
              <button
                onClick={nextMindBender}
                className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800/60 px-2 py-1 rounded-md"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Next</span>
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug">
              {currentMindBender.title}
            </h4>
            <p className="text-xs text-slate-300/90 leading-relaxed">
              {currentMindBender.teaser}
            </p>

            {showAnswer && (
              <div className="mt-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-100 leading-relaxed animate-fadeIn">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>The Conceptual Resolution:</span>
                </div>
                {currentMindBender.explanation}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs font-semibold text-violet-300 hover:text-violet-200 flex items-center gap-1.5 underline underline-offset-4 decoration-violet-500/50"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {showAnswer ? 'Hide Explanation' : 'Reveal Physical Intuition'}
            </button>
            <span className="text-[10px] text-slate-400">NCERT Grade 11 Depth</span>
          </div>
        </div>

      </div>

      {/* Session Intent Mode Selector */}
      <div className="mt-6 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Select Your Session Strategy & Intent</span>
            </h3>
            <p className="text-xs text-slate-400">Customized focus cycles with tailored brainwave pacing</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Preset Pomodoro & Sprint Modes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sessionModes.map((mode) => {
            const isSelected = activeMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => {
                  setActiveMode(mode.id);
                  onSelectSessionMode && onSelectSessionMode(mode);
                }}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_18px_rgba(0,242,254,0.25)] translate-y-[-2px]'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${mode.color}15`,
                      color: mode.color,
                      border: `1px solid ${mode.color}40`
                    }}
                  >
                    {mode.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {mode.duration}m / {mode.break}m
                  </span>
                </div>

                <h5 className="text-xs font-bold text-white mb-1">{mode.name}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {mode.affirmation}
                </p>

                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-medium">
                  <span>Activate Mode</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
