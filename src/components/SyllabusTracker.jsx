import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Circle, 
  Star, 
  Search, 
  HelpCircle, 
  Play, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Zap,
  Bookmark
} from 'lucide-react';

export default function SyllabusTracker({ syllabus, onUpdateTopic, onStartQuiz, onStartStudySession }) {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedChapter, setExpandedChapter] = useState(null);

  const subjectData = syllabus ? syllabus[selectedSubject] || [] : [];

  // Filter topics
  const filteredChapters = subjectData.map((ch) => {
    const filteredTopics = ch.topics.filter((t) => {
      const p = t.progress || { status: 'not-started' };
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.concepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return {
      ...ch,
      filteredTopics
    };
  }).filter(ch => ch.filteredTopics.length > 0);

  const cycleStatus = (topicId, currentStatus) => {
    const statuses = ['not-started', 'in-progress', 'mastered', 'needs-revision'];
    const currentIndex = statuses.indexOf(currentStatus || 'not-started');
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onUpdateTopic && onUpdateTopic({ topicId, status: nextStatus });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Mastered</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            <Clock className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>In Progress</span>
          </span>
        );
      case 'needs-revision':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Needs Revision</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
            <Circle className="w-3 h-3" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-slate-800/80 shadow-2xl mb-8">
      
      {/* Subject Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Grade 11 NCERT Master Curriculum</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete syllabus matrix for Physics, Chemistry, and Mathematics with topic retention scoring
          </p>
        </div>

        {/* Subject Switcher Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'physics', label: 'Physics', icon: '🔭', color: '#00f2fe' },
            { id: 'chemistry', label: 'Chemistry', icon: '⚗️', color: '#c084fc' },
            { id: 'maths', label: 'Mathematics', icon: '📐', color: '#10b981' }
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedSubject === sub.id
                  ? 'bg-slate-900 border-cyan-500/60 text-white shadow-[0_0_12px_rgba(0,242,254,0.25)] border'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 border'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic, derivation, concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'mastered', label: 'Mastered' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'needs-revision', label: 'Needs Revision' },
            { id: 'not-started', label: 'Not Started' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Chapters Accordion / List */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No topics match your filter</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing the search or switching status filters.</p>
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const isExpanded = expandedChapter === ch.id || searchQuery.length > 0;
            const masteredCount = ch.topics.filter(t => t.progress?.status === 'mastered').length;
            const totalCount = ch.topics.length;
            const pct = Math.round((masteredCount / totalCount) * 100);

            return (
              <div
                key={ch.id}
                className="rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-lg hover:border-slate-700 transition-all"
              >
                
                {/* Chapter Banner Header */}
                <div
                  onClick={() => setExpandedChapter(isExpanded ? null : ch.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-slate-800/30 gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-xs">
                      {ch.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {ch.weightage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ch.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Chapter Mastery Bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300">{pct}%</span>
                    </div>

                    {/* Launch Diagnostic Quiz Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuiz && onStartQuiz(selectedSubject, ch.id);
                      }}
                      className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                      title="Test your recall with Zare Diagnostic Quiz"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Take Quiz</span>
                    </button>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Topics List Table */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 bg-slate-950/40 divide-y divide-slate-800/60">
                    
                    {/* Formulas Cheatsheet Preview if available */}
                    {ch.formulas && (
                      <div className="py-3 px-3.5 my-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                          ⚡ Core NCERT Formulas & Equations:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                          {ch.formulas.map((f, idx) => (
                            <div key={idx} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {ch.filteredTopics.map((topic) => {
                      const progress = topic.progress || { status: 'not-started', confidence: 0, notes: '' };
                      return (
                        <div
                          key={topic.id}
                          className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/30 px-2 rounded-xl transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{topic.title}</span>
                              {progress.lastStudied && (
                                <span className="text-[10px] text-slate-500">
                                  Last studied: {progress.lastStudied}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              Concepts: {topic.concepts?.join(' • ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            
                            {/* Confidence Star Selector */}
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => onUpdateTopic && onUpdateTopic({ topicId: topic.id, confidence: s })}
                                  className={`p-0.5 ${
                                    progress.confidence >= s ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'
                                  }`}
                                  title={`Rate confidence ${s}/5`}
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>
                              ))}
                            </div>

                            {/* Cycle Status Button */}
                            <button
                              onClick={() => cycleStatus(topic.id, progress.status)}
                              className="transition-transform active:scale-95 cursor-pointer"
                              title="Click to advance status"
                            >
                              {getStatusBadge(progress.status)}
                            </button>

                          </div>
                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
