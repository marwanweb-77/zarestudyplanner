import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MotivationBanner from './components/MotivationBanner';
import MorphSliderSection from './components/MorphSliderSection';
import StudyTimer from './components/StudyTimer';
import SyllabusTracker from './components/SyllabusTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ZareAssistant from './components/ZareAssistant';
import FormulaVault from './components/FormulaVault';
import QuizModal from './components/QuizModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [syllabus, setSyllabus] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [quotesData, setQuotesData] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedSessionMode, setSelectedSessionMode] = useState(null);

  // Active Quiz Modal state
  const [activeQuizModal, setActiveQuizModal] = useState(null); // { subject, chapterId }

  // Load all initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const [sylData, sessData, analData, qData, fcData] = await Promise.all([
      api.getSyllabus(),
      api.getSessions(),
      api.getAnalytics(),
      api.getQuotesData(),
      api.getFlashcards()
    ]);

    if (sylData) setSyllabus(sylData);
    if (sessData) setSessions(sessData);
    if (analData) setAnalytics(analData);
    if (qData) setQuotesData(qData);
    if (fcData) setFlashcards(fcData);
  };

  const handleSessionSaved = async (sessionPayload) => {
    const res = await api.createSession(sessionPayload);
    if (res && res.success) {
      // Refresh analytics, syllabus, and sessions
      loadAllData();
    }
  };

  const handleUpdateTopic = async ({ topicId, status, confidence, notes }) => {
    const res = await api.updateTopicStatus({ topicId, status, confidence, notes });
    if (res && res.success) {
      loadAllData();
    }
  };

  const handleDeleteSession = async (id) => {
    const res = await api.deleteSession(id);
    if (res && res.success) {
      loadAllData();
    }
  };

  const handleStartQuiz = (subject, chapterId) => {
    setActiveQuizModal({ subject, chapterId });
  };

  const handleFlashcardAdded = (newCard) => {
    setFlashcards((prev) => [newCard, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        analytics={analytics}
        onOpenZareAssessment={() => setActiveTab('zare')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Study Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Motivation & Mindset Engine with WebGL WarpText */}
            <MotivationBanner
              quotesData={quotesData}
              onSelectSessionMode={(mode) => setSelectedSessionMode(mode)}
            />

            {/* Subject Visualizer with WebGL MorphSlider */}
            <MorphSliderSection
              onSelectSubject={(sub) => {
                setActiveTab('syllabus');
              }}
            />

            {/* Live Study Timer & Hours Logger */}
            <StudyTimer
              syllabus={syllabus}
              onSessionSaved={handleSessionSaved}
              initialMode={selectedSessionMode}
            />
          </div>
        )}

        {/* Tab 2: Grade 11 NCERT Syllabus Matrix */}
        {activeTab === 'syllabus' && (
          <div className="animate-fadeIn">
            <SyllabusTracker
              syllabus={syllabus}
              onUpdateTopic={handleUpdateTopic}
              onStartQuiz={handleStartQuiz}
              onStartStudySession={() => setActiveTab('studio')}
            />
          </div>
        )}

        {/* Tab 3: Study Hours & Performance Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-fadeIn">
            <AnalyticsDashboard
              analytics={analytics}
              sessions={sessions}
              onDeleteSession={handleDeleteSession}
              onJumpToSyllabus={() => setActiveTab('syllabus')}
            />
          </div>
        )}

        {/* Tab 4: Zare AI Study Assessor */}
        {activeTab === 'zare' && (
          <div className="animate-fadeIn">
            <ZareAssistant
              analytics={analytics}
              onLaunchQuiz={handleStartQuiz}
            />
          </div>
        )}

        {/* Tab 5: Formula Vault & Flashcards */}
        {activeTab === 'formulas' && (
          <div className="animate-fadeIn">
            <FormulaVault
              syllabus={syllabus}
              flashcards={flashcards}
              onFlashcardAdded={handleFlashcardAdded}
            />
          </div>
        )}

      </main>

      {/* Quiz Modal */}
      {activeQuizModal && (
        <QuizModal
          subject={activeQuizModal.subject}
          chapterId={activeQuizModal.chapterId}
          onClose={() => setActiveQuizModal(null)}
          onQuizCompleted={() => loadAllData()}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ZARE • Dedicated Grade 11 NCERT AI Study Assessor & Tracker</span>
          <span className="font-mono text-[11px] text-slate-400">Physics • Chemistry • Mathematics</span>
        </div>
      </footer>

    </div>
  );
}
