import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState('binaural-40hz');
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef(null);
  const nodesRef = useRef([]);

  const sounds = [
    { id: 'binaural-40hz', label: '40Hz Gamma Focus', desc: 'Binaural wave for deep conceptual learning' },
    { id: 'cyber-drone', label: 'Cyber Obsidian Drone', desc: 'Low harmonic synth drone for intense focus' },
    { id: 'lofi-rain', label: 'Warm Rain & Pink Noise', desc: 'Relaxing frequency masking ambient distractions' }
  ];

  const stopAudio = () => {
    nodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    nodesRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const startAudio = () => {
    stopAudio();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (soundType === 'binaural-40hz') {
      // Base tone 200Hz left, 240Hz right (40Hz binaural beat for peak gamma focus)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(200, ctx.currentTime);
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(240, ctx.currentTime);

      const gainL = ctx.createGain();
      const gainR = ctx.createGain();
      gainL.gain.setValueAtTime(0.4, ctx.currentTime);
      gainR.gain.setValueAtTime(0.4, ctx.currentTime);

      oscL.connect(gainL);
      oscR.connect(gainR);
      gainL.connect(merger, 0, 0);
      gainR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      nodesRef.current = [oscL, oscR, gainL, gainR, merger, masterGain];
    } else if (soundType === 'cyber-drone') {
      // Rich synth pad drone (Root 110Hz A2 + Fifth 165Hz E3 + Octave 220Hz)
      const freqs = [110, 164.81, 220];
      const newNodes = [];

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.connect(masterGain);
      newNodes.push(filter);

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2 / (i + 1), ctx.currentTime);
        osc.connect(gain);
        gain.connect(filter);
        osc.start();
        newNodes.push(osc, gain);
      });
      newNodes.push(masterGain);
      nodesRef.current = newNodes;
    } else {
      // Synthesized pink noise with low pass filter (Simulated soothing rain)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      nodesRef.current = [whiteNoise, filter, masterGain];
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAudio();
    } else {
      stopAudio();
    }
    return () => stopAudio();
  }, [isPlaying, soundType]);

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
      <button
        onClick={toggleSound}
        className={`p-1.5 rounded-full transition-all ${
          isPlaying
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.6)]'
            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
        }`}
        title={isPlaying ? 'Pause Ambient Focus Sound' : 'Play Ambient Focus Sound'}
      >
        {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>

      <select
        value={soundType}
        onChange={(e) => setSoundType(e.target.value)}
        className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer pr-1"
      >
        {sounds.map((s) => (
          <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
            {s.label}
          </option>
        ))}
      </select>

      {isPlaying && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
      )}
    </div>
  );
}
