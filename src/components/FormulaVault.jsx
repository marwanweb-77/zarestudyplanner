import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Copy, 
  Check, 
  Plus, 
  Sparkles, 
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function FormulaVault({ syllabus, flashcards, onFlashcardAdded }) {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Custom flashcard creation
  const [showAddCard, setShowAddCard] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [cardSubject, setCardSubject] = useState('physics');

  // Extract all formulas from syllabus
  const allFormulas = [];
  ['physics', 'chemistry', 'maths'].forEach((sub) => {
    const list = syllabus ? syllabus[sub] || [] : [];
    list.forEach((ch) => {
      if (ch.formulas) {
        ch.formulas.forEach((f, idx) => {
          allFormulas.push({
            id: `${ch.id}-f-${idx}`,
            subject: sub,
            chapterName: ch.name,
            chapterCode: ch.chapterCode,
            formula: f
          });
        });
      }
    });
  });

  const filteredFormulas = allFormulas.filter((f) => {
    const matchesSub = selectedSubject === 'all' || f.subject === selectedSubject;
    const matchesSearch = f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.chapterName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!frontText.trim() || !backText.trim()) return;

    const res = await api.createFlashcard({
      subject: cardSubject,
      front: frontText,
      back: backText
    });

    if (res && res.success) {
      onFlashcardAdded && onFlashcardAdded(res.flashcard);
      setFrontText('');
      setBackText('');
      setShowAddCard(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-2xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bookmark className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Grade 11 NCERT Formula Vault & Flashcards
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instant equation reference, derivations, and active recall memory cards
          </p>
        </div>

        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all transform hover:scale-105 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Flashcard</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search equations, derivations, constants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-white"
          />
        </div>

        {/* Subject Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'physics', label: 'Physics' },
            { id: 'chemistry', label: 'Chemistry' },
            { id: 'maths', label: 'Mathematics' },
            { id: 'all', label: 'All Subjects' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === sub.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

      </div>

      {/* Formula Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
        {filteredFormulas.map((item, idx) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 flex items-start justify-between gap-3 transition-all group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                  item.subject === 'physics' ? 'badge-phy' : item.subject === 'chemistry' ? 'badge-chem' : 'badge-math'
                }`}>
                  {item.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                  {item.chapterName}
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-100 leading-relaxed">
                {item.formula}
              </div>
            </div>

            <button
              onClick={() => handleCopy(item.formula, idx)}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Copy equation"
            >
              {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ))}
      </div>

      {/* Flashcards Recall Section */}
      <div className="pt-6 border-t border-slate-800/80">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Active Recall Flashcards</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(flashcards || []).map((card) => (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase block w-fit mb-2 ${
                  card.subject === 'physics' ? 'badge-phy' : card.subject === 'chemistry' ? 'badge-chem' : 'badge-math'
                }`}>
                  {card.subject}
                </span>
                <h4 className="text-xs font-bold text-white mb-2 leading-relaxed">
                  Q: {card.front}
                </h4>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 font-medium">
                <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Recall Key:</span>
                <p className="whitespace-pre-wrap">{card.back}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Flashcard Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl animate-fadeIn">
            <h4 className="text-base font-bold text-white mb-4">Create Active Recall Flashcard</h4>

            <form onSubmit={handleSaveCard} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="font-semibold block mb-1">Subject:</label>
                <select
                  value={cardSubject}
                  onChange={(e) => setCardSubject(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="physics" className="bg-slate-900">Physics</option>
                  <option value="chemistry" className="bg-slate-900">Chemistry</option>
                  <option value="maths" className="bg-slate-900">Mathematics</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Front (Question / Prompt):</label>
                <textarea
                  rows="2"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  placeholder="e.g. What is the condition for maximum range in projectile motion?"
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Back (Answer / Derivation Key):</label>
                <textarea
                  rows="3"
                  value={backText}
                  onChange={(e) => setBackText(e.target.value)}
                  placeholder="e.g. R_max = u^2/g at θ = 45 degrees."
                  className="w-full glass-input rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)]"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
