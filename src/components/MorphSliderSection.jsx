import React, { useState } from 'react';
import { Layers, Sparkles, BookOpen, ChevronRight, Wand2 } from 'lucide-react';
import MorphSlider from './MorphSlider';

const SUBJECT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1600&auto=format&fit=crop',
    caption: '⚡ Physics • Mechanics, Rotational Dynamics & SHM'
  },
  {
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop',
    caption: '⚗️ Chemistry • Quantum Orbitals, MOT & Thermodynamics'
  },
  {
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1600&auto=format&fit=crop',
    caption: '📐 Mathematics • Calculus Limits, Vectors & Trigonometry'
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    caption: '🤖 Zare AI • Personalized Grade 11 NCERT Assessor'
  }
];

export default function MorphSliderSection({ onSelectSubject }) {
  const [transitionType, setTransitionType] = useState('melt');
  const [intensity, setIntensity] = useState(0.55);

  const transitions = [
    { id: 'melt', label: 'Melt Warp' },
    { id: 'ripple', label: 'Wave Ripple' },
    { id: 'shear', label: 'Shear Slices' },
    { id: 'swirl', label: 'Vortex Swirl' }
  ];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-7 border border-slate-800/80 shadow-2xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Interactive NCERT Subject Visualizer
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            OGL WebGL GPU Displacement & GSAP Morph Shaders
          </p>
        </div>

        {/* Transition Shader Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {transitions.map((t) => (
            <button
              key={t.id}
              onClick={() => setTransitionType(t.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                transitionType === t.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.5)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Morph Slider Container */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <MorphSlider
          items={SUBJECT_SLIDES}
          transition={transitionType}
          intensity={intensity}
          aberration={0.35}
          drift={0.38}
          autoplay={true}
          autoplayDelay={5}
          radius={16}
          overlayColor="#07080c"
          className="w-full h-full"
        />

        {/* Quick Jump Pill Overlays */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-auto">
          <button
            onClick={() => onSelectSubject && onSelectSubject('physics')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 hover:bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md transition-all"
          >
            <span>🔭 Physics 11</span>
          </button>
          <button
            onClick={() => onSelectSubject && onSelectSubject('chemistry')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 hover:bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold backdrop-blur-md transition-all"
          >
            <span>⚗️ Chemistry 11</span>
          </button>
          <button
            onClick={() => onSelectSubject && onSelectSubject('maths')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/70 hover:bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md transition-all"
          >
            <span>📐 Mathematics 11</span>
          </button>
        </div>
      </div>
    </div>
  );
}
