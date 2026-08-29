import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  HelpCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function QuizModal({ subject, chapterId, onClose, onQuizCompleted }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [subject, chapterId]);

  const loadQuiz = async () => {
    setLoading(true);
    const data = await api.getQuiz(subject, chapterId);
    if (data) {
      setQuiz(data);
    }
    setLoading(false);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    let computedScore = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        computedScore += 1;
      }
    });

    setScore(computedScore);
    setIsSubmitted(true);

    const payload = {
      quizId: quiz.id,
      subject: quiz.subject,
      chapterId: quiz.chapterId,
      title: quiz.title,
      answers: selectedAnswers,
      totalQuestions: quiz.questions.length,
      score: computedScore
    };

    const res = await api.submitQuiz(payload);
    if (res && res.success) {
      setEarnedXp(res.earnedXp || computedScore * 50);
      onQuizCompleted && onQuizCompleted();
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="glass-panel rounded-3xl p-8 text-center text-white">
          <Sparkles className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold">Generating NCERT Diagnostic Test...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="glass-panel rounded-3xl p-6 text-center text-white max-w-sm">
          <p className="text-sm font-bold mb-4">No diagnostic questions available for this chapter yet.</p>
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 rounded-xl text-xs">Close</button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];
  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl animate-fadeIn relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider capitalize">
                {quiz.subject}
              </span>
              <span className="text-[10px] font-bold text-amber-400">NCERT Diagnostic</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">{quiz.title}</h3>
          </div>
        </div>

        {!isSubmitted ? (
          /* Active Test Mode */
          <div className="space-y-6">
            
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <div className="flex gap-1.5">
                {quiz.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all ${
                      currentQuestionIndex === idx
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : selectedAnswers[q.id] !== undefined
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-sm font-semibold text-white leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <span>{option}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
              >
                Previous
              </button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={!allAnswered}
                  onClick={submitQuiz}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-40 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit Diagnostic Test</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Results and Detailed Explanations Mode */
          <div className="space-y-6">
            
            {/* Score Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 text-center">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Diagnostic Complete
              </span>
              <div className="text-3xl font-extrabold text-white font-mono mb-1">
                {score} / {quiz.questions.length} Correct ({Math.round((score / quiz.questions.length) * 100)}%)
              </div>
              <p className="text-xs text-slate-300">
                +{earnedXp} Scholar XP added to your Grade 11 profile!
              </p>
            </div>

            {/* Questions Breakdown */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {quiz.questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isCorrect
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-red-950/20 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white">Q{idx + 1}. {q.question}</span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold whitespace-nowrap">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 font-bold whitespace-nowrap">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-slate-300">
                      <strong>Your Answer:</strong> {q.options[userAns]}
                    </div>
                    {!isCorrect && (
                      <div className="text-emerald-300">
                        <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 text-slate-400 leading-relaxed font-sans">
                      💡 <strong>NCERT Insight:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Attempt Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-[0_0_12px_rgba(0,242,254,0.3)]"
              >
                Done & Return
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
