import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Calendar, 
  Zap, 
  Lightbulb, 
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

export default function ZareAssistant({ analytics, onLaunchQuiz }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "⚡ **Greetings! I am Zare**, your dedicated AI Study Assessor for Grade 11 NCERT.\n\nI monitor your study velocity across Physics, Chemistry, and Mathematics, evaluate concept retention, and test you with diagnostic NCERT quizzes.\n\nHow can I assess your studies today? You can ask me to run a deep diagnostic assessment, analyze your weak areas, or test your recall on any chapter!",
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentReport, setAssessmentReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' or 'assessment'
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial assessment
  useEffect(() => {
    generateAssessment();
  }, []);

  const generateAssessment = async () => {
    setIsGeneratingReport(true);
    const report = await api.getZareAssessment();
    if (report) {
      setAssessmentReport(report);
    }
    setIsGeneratingReport(false);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    setInputText('');

    const newMsg = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };
    setMessages((prev) => [...prev, newMsg]);
    setIsLoading(true);

    const res = await api.sendZareChat(userText);
    if (res && res.success && res.reply) {
      setMessages((prev) => [...prev, res.reply]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          text: `I've analyzed your question regarding "${userText}". Keep focusing on your NCERT textbook derivations, draw clear FBDs for physics, balance chemical equations with oxidation numbers, and drill standard trigonometric limits!`,
          timestamp: Date.now()
        }
      ]);
    }
    setIsLoading(false);
  };

  const quickPrompts = [
    "Assess my overall Grade 11 study progress and readiness",
    "Which NCERT Physics topics should I revise first?",
    "Give me 3 high-yield tips for Grade 11 Chemistry",
    "How to master Trigonometric multiple angle formulas?"
  ];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-2xl mb-8 relative overflow-hidden">
      {/* Amber / Gold ambient glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-[1.5px] shadow-[0_0_25px_rgba(245,158,11,0.35)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">ZARE</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Personal AI Study Assessor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Assessing Grade 11 NCERT • Physics, Chemistry, Maths Diagnostics & Growth Strategies
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Interactive Assessment</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('assessment');
              if (!assessmentReport) generateAssessment();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'assessment'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Comprehensive Report</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Interactive Chat Assessor */}
      {activeSubTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Main Chat Area (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col h-[520px] rounded-2xl bg-slate-950/60 border border-slate-800 shadow-inner overflow-hidden">
            
            {/* Messages Scroll View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isBot = m.role === 'assistant';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isBot
                          ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                      }`}
                    >
                      {isBot ? <Bot className="w-4 h-4" /> : 'YOU'}
                    </div>

                    <div
                      className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isBot
                          ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                          : 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-white shadow-md'
                      }`}
                    >
                      <div className="font-sans text-xs space-y-2 [&_h1]:text-base [&_h1]:font-extrabold [&_h1]:text-amber-300 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-amber-300 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-amber-300 [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_strong]:text-white [&_strong]:font-bold [&_code]:bg-slate-950/80 [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11px] [&_pre]:bg-slate-950/90 [&_pre]:p-2.5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_blockquote]:border-l-2 [&_blockquote]:border-amber-400/60 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-slate-300">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-amber-400 p-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Zare is evaluating your study metrics...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-4 py-2 bg-slate-900/40 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] text-slate-500 font-bold uppercase whitespace-nowrap">Suggested:</span>
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(qp);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/60 whitespace-nowrap transition-all"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Zare to assess your studies, review a concept, or give improvement tips..."
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-amber-500 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Side Panel: Quick Diagnostic Launcher & Metrics (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Assessment Score Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  NCERT Readiness Index
                </span>
                <span className="p-1 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">LIVE</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold text-white font-mono">
                  {assessmentReport?.readinessScore ?? 0}%
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {(assessmentReport?.readinessScore || 0) > 0 ? 'Strong Momentum' : 'Ready to Start'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                  style={{ width: `${assessmentReport?.readinessScore ?? 0}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Evaluated from study hours, quiz accuracy, and topic confidence scores.
              </p>
            </div>

            {/* Launch Recommended Diagnostic Quizzes */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Zare's Recommended Quizzes</span>
              </h4>

              <div className="space-y-2">
                {[
                  { subject: 'physics', chapterId: 'phy-1', title: 'Units & Measurements', badge: 'High Yield' },
                  { subject: 'chemistry', chapterId: 'chem-4', title: 'Chemical Bonding & MOT', badge: 'Crucial' },
                  { subject: 'maths', chapterId: 'math-2', title: 'Trigonometric Functions', badge: 'Core' }
                ].map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => onLaunchQuiz && onLaunchQuiz(q.subject, q.chapterId)}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {q.title}
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">{q.subject}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Mode 2: Detailed Assessment Report */
        <div className="mt-6 space-y-6 animate-fadeIn">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Retention Health</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{assessmentReport?.metrics?.retentionHealth || 'Ready for Study Sessions'}</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Total Hours Evaluated</span>
              <span className="text-xl font-extrabold text-white font-mono">
                {assessmentReport?.metrics?.totalHoursLogged ?? 0} hrs
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Average Diagnostic Accuracy</span>
              <span className="text-xl font-extrabold text-cyan-400 font-mono">
                {assessmentReport?.metrics?.averageQuizAccuracy || '0%'}
              </span>
            </div>
          </div>

          {/* Strengths & Growth Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-emerald-500/30">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Conceptual Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(assessmentReport?.strengths || [
                  'Fresh study space initialized and ready for Grade 11 NCERT tracking.',
                  'Comprehensive syllabus matrix loaded across Physics, Chemistry, and Mathematics.'
                ]).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth Areas */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-amber-500/30">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Targeted Growth & Weakness Areas</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(assessmentReport?.growthAreas || [
                  'Ionic Equilibrium: Buffer solutions and Salt hydrolysis calculations.',
                  'Rotational Dynamics: Parallel & Perpendicular axes theorems + rolling KE.',
                  'Limits: First principle calculus derivations.'
                ]).map((g, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Personalized 7-Day Action Plan */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Zare's Personalized 7-Day NCERT Master Plan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(assessmentReport?.recommended7DayPlan || []).map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 block mb-1">{p.day}</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 to-purple-950/20 border border-slate-800">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Zare's Strategic Tips to Improve</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong>1. First Principles Derivations:</strong> Re-derive standard formulas from scratch every Sunday without reference notes.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong>2. Free-Body Diagrams (FBD):</strong> Never solve physics mechanics numericals without drawing all normal and frictional forces first.
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong>3. Curved Arrow Mechanisms:</strong> In Organic Chemistry, track electron displacement rather than memorizing whole reactions.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
