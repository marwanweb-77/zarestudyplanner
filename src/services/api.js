import syllabusData from '../data/syllabus.json';
import quotesData from '../data/quotes.json';
import quizBankData from '../data/quizBank.json';

const STORAGE_KEY = 'zare_study_hub_data_v1';

const defaultStore = {
  profile: {
    name: 'Scholar',
    grade: 'Grade 11',
    stream: 'PCM (Physics, Chemistry, Maths)',
    targetHoursDaily: 4.5,
    streak: 0,
    xp: 0,
    level: 'Quantum Initiate',
    joinedDate: new Date().toISOString().split('T')[0]
  },
  sessions: [],
  topicProgress: {},
  quizResults: [],
  zareChat: [
    {
      id: 'zc-1',
      role: 'assistant',
      text: "Greetings! I am Zare, your dedicated AI Study Assessor for Grade 11 NCERT. I monitor your study velocity across Physics, Chemistry, and Mathematics, evaluate concept retention, and test you with diagnostic NCERT quizzes.\n\nWhich topic would you like to assess or review today?",
      timestamp: Date.now()
    }
  ],
  flashcards: []
};

function getStore() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
      }
      return JSON.parse(JSON.stringify(defaultStore));
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultStore,
      ...parsed,
      profile: { ...defaultStore.profile, ...(parsed.profile || {}) }
    };
  } catch (e) {
    console.warn('Error reading from LocalStorage:', e);
    return JSON.parse(JSON.stringify(defaultStore));
  }
}

function updateStore(updater) {
  try {
    const current = getStore();
    const next = updater(current) || current;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  } catch (e) {
    console.error('Error updating LocalStorage:', e);
    return getStore();
  }
}

function getLevel(xp) {
  if (xp > 6000) return 'NCERT Grandmaster';
  if (xp > 3500) return 'Quantum Scholar';
  if (xp > 1500) return 'Quantum Adept';
  return 'Quantum Initiate';
}

function calculateStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const uniqueDates = Array.from(new Set(sessions.map(s => s.date))).filter(Boolean).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(uniqueDates[0]);

  for (let i = 0; i < uniqueDates.length; i++) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (uniqueDates[i] === dStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const api = {
  // 1. Syllabus with enriched progress
  getSyllabus: async () => {
    const store = getStore();
    const progress = store.topicProgress || {};

    const enriched = {
      physics: syllabusData.physics.map(ch => ({
        ...ch,
        topics: ch.topics.map(tp => ({
          ...tp,
          progress: progress[tp.id] || { status: 'not-started', confidence: 0, notes: '', lastStudied: null }
        }))
      })),
      chemistry: syllabusData.chemistry.map(ch => ({
        ...ch,
        topics: ch.topics.map(tp => ({
          ...tp,
          progress: progress[tp.id] || { status: 'not-started', confidence: 0, notes: '', lastStudied: null }
        }))
      })),
      maths: syllabusData.maths.map(ch => ({
        ...ch,
        topics: ch.topics.map(tp => ({
          ...tp,
          progress: progress[tp.id] || { status: 'not-started', confidence: 0, notes: '', lastStudied: null }
        }))
      }))
    };

    return enriched;
  },

  // 2. Sessions
  getSessions: async () => {
    const store = getStore();
    return store.sessions || [];
  },

  createSession: async (sessionPayload) => {
    const { subject, chapterId, chapterName, topicId, topicTitle, durationMinutes, date, notes, mode, rating } = sessionPayload;
    if (!subject || !durationMinutes) {
      return { success: false, error: 'Missing required session parameters' };
    }

    const duration = Number(durationMinutes);
    const earnedXp = Math.round(duration * 2.5) + (rating ? rating * 10 : 20);
    const now = new Date();
    const sessionDate = date || now.toISOString().split('T')[0];

    const newSession = {
      id: 'sess-' + Date.now(),
      subject,
      chapterId: chapterId || '',
      chapterName: chapterName || 'General Practice',
      topicId: topicId || '',
      topicTitle: topicTitle || 'General Chapter Study',
      durationMinutes: duration,
      date: sessionDate,
      mode: mode || 'deep-focus',
      rating: rating || 5,
      notes: notes || '',
      timestamp: Date.now()
    };

    updateStore(state => {
      state.sessions = [newSession, ...(state.sessions || [])];
      state.profile.xp = (state.profile.xp || 0) + earnedXp;
      state.profile.level = getLevel(state.profile.xp);
      state.profile.streak = calculateStreak(state.sessions);

      if (topicId) {
        if (!state.topicProgress) state.topicProgress = {};
        const prev = state.topicProgress[topicId] || {};
        state.topicProgress[topicId] = {
          status: prev.status === 'mastered' ? 'mastered' : 'in-progress',
          confidence: rating || prev.confidence || 4,
          notes: notes ? (prev.notes ? `${prev.notes} | ${notes}` : notes) : prev.notes || '',
          lastStudied: sessionDate
        };
      }
    });

    return { success: true, session: newSession, earnedXp };
  },

  deleteSession: async (id) => {
    updateStore(state => {
      state.sessions = (state.sessions || []).filter(s => s.id !== id);
      state.profile.streak = calculateStreak(state.sessions);
    });
    return { success: true };
  },

  // 3. Topic progress update
  updateTopicStatus: async ({ topicId, status, confidence, notes }) => {
    if (!topicId) {
      return { success: false, error: 'Topic ID is required' };
    }

    const today = new Date().toISOString().split('T')[0];
    let updatedRecord = null;

    updateStore(state => {
      if (!state.topicProgress) state.topicProgress = {};
      const existing = state.topicProgress[topicId] || {};

      state.topicProgress[topicId] = {
        status: status !== undefined ? status : existing.status || 'not-started',
        confidence: confidence !== undefined ? confidence : existing.confidence || 0,
        notes: notes !== undefined ? notes : existing.notes || '',
        lastStudied: status === 'not-started' ? existing.lastStudied : today
      };

      if (status === 'mastered' && existing.status !== 'mastered') {
        state.profile.xp = (state.profile.xp || 0) + 150;
        state.profile.level = getLevel(state.profile.xp);
      }

      updatedRecord = state.topicProgress[topicId];
    });

    return { success: true, updated: updatedRecord };
  },

  // 4. Analytics
  getAnalytics: async () => {
    const store = getStore();
    const sessions = store.sessions || [];
    const progress = store.topicProgress || {};
    const profile = store.profile || defaultStore.profile;

    const todayStr = new Date().toISOString().split('T')[0];
    const computedStreak = calculateStreak(sessions);

    let totalMinutes = 0;
    let todayMinutes = 0;
    let physicsMinutes = 0;
    let chemMinutes = 0;
    let mathsMinutes = 0;

    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      last14Days.push({ date: dateStr, label: dayLabel, physics: 0, chemistry: 0, maths: 0, totalHours: 0 });
    }

    sessions.forEach(s => {
      const dur = Number(s.durationMinutes || 0);
      totalMinutes += dur;
      if (s.date === todayStr) {
        todayMinutes += dur;
      }

      if (s.subject === 'physics') physicsMinutes += dur;
      else if (s.subject === 'chemistry') chemMinutes += dur;
      else if (s.subject === 'maths') mathsMinutes += dur;

      const dayObj = last14Days.find(d => d.date === s.date);
      if (dayObj) {
        if (s.subject === 'physics') dayObj.physics += dur / 60;
        else if (s.subject === 'chemistry') dayObj.chemistry += dur / 60;
        else if (s.subject === 'maths') dayObj.maths += dur / 60;
        dayObj.totalHours += dur / 60;
      }
    });

    const countTopics = (subjectList) => {
      let total = 0;
      let mastered = 0;
      let inProgress = 0;
      let needsRevision = 0;

      subjectList.forEach(ch => {
        ch.topics.forEach(tp => {
          total++;
          const p = progress[tp.id];
          if (p) {
            if (p.status === 'mastered') mastered++;
            else if (p.status === 'in-progress') inProgress++;
            else if (p.status === 'needs-revision') needsRevision++;
          }
        });
      });

      return { total, mastered, inProgress, needsRevision, percentage: total ? Math.round((mastered / total) * 100) : 0 };
    };

    const physicsStats = countTopics(syllabusData.physics);
    const chemStats = countTopics(syllabusData.chemistry);
    const mathsStats = countTopics(syllabusData.maths);

    const totalTopics = physicsStats.total + chemStats.total + mathsStats.total;
    const totalMastered = physicsStats.mastered + chemStats.mastered + mathsStats.mastered;
    const totalInProgress = physicsStats.inProgress + chemStats.inProgress + mathsStats.inProgress;
    const overallMasteryPct = totalTopics ? Math.round((totalMastered / totalTopics) * 100) : 0;

    const weakTopics = [];
    ['physics', 'chemistry', 'maths'].forEach(sub => {
      syllabusData[sub].forEach(ch => {
        ch.topics.forEach(tp => {
          const p = progress[tp.id];
          if (p && (p.status === 'needs-revision' || (p.confidence > 0 && p.confidence <= 2))) {
            weakTopics.push({
              id: tp.id,
              title: tp.title,
              subject: sub,
              chapter: ch.name,
              confidence: p.confidence,
              status: p.status
            });
          }
        });
      });
    });

    const heatmap = {};
    sessions.forEach(s => {
      if (!heatmap[s.date]) heatmap[s.date] = 0;
      heatmap[s.date] += Number(s.durationMinutes || 0) / 60;
    });

    return {
      profile: {
        ...profile,
        streak: computedStreak,
        level: getLevel(profile.xp || 0)
      },
      totalHours: Number((totalMinutes / 60).toFixed(1)),
      todayHours: Number((todayMinutes / 60).toFixed(1)),
      targetHoursDaily: profile.targetHoursDaily || 4.5,
      streakDays: computedStreak,
      subjectBreakdown: {
        physicsHours: Number((physicsMinutes / 60).toFixed(1)),
        chemistryHours: Number((chemMinutes / 60).toFixed(1)),
        mathsHours: Number((mathsMinutes / 60).toFixed(1))
      },
      topicStats: {
        overallMasteryPct,
        totalTopics,
        totalMastered,
        totalInProgress,
        physics: physicsStats,
        chemistry: chemStats,
        maths: mathsStats
      },
      last14Days,
      heatmap,
      weakTopics: weakTopics.slice(0, 8),
      totalSessionsCount: sessions.length
    };
  },

  // 5. Quotes, mind benders, session modes
  getQuotesData: async () => {
    return {
      success: true,
      quotes: quotesData.quotes,
      mindBenders: quotesData.mindBenders,
      sessionModes: quotesData.sessionModes
    };
  },

  // 6. Quizzes
  getQuiz: async (subject, chapterId) => {
    const quiz = quizBankData.quizzes.find(q => q.subject === subject && q.chapterId === chapterId);
    if (quiz) return quiz;

    const chList = syllabusData[subject] || [];
    const chapter = chList.find(c => c.id === chapterId);
    if (!chapter) return null;

    return {
      id: `generated-${chapterId}`,
      subject,
      chapterId,
      title: `${chapter.name} - Concept Diagnostic`,
      questions: chapter.topics.map((tp, idx) => ({
        id: `gen-q-${idx + 1}`,
        question: `In "${chapter.name}", regarding "${tp.title}", which of the following is an essential NCERT principle?`,
        options: [
          `Key concept: ${tp.concepts[0] || 'Core theorem and application'}`,
          `Secondary condition: ${tp.concepts[1] || 'Boundary condition'}`,
          `Special case condition: ${tp.concepts[2] || 'Experimental proof'}`,
          `Fundamental equation balance`
        ],
        correctIndex: 0,
        explanation: `NCERT Grade 11 emphasizes: "${tp.concepts.join(' • ')}". Master this derivation and standard numericals.`
      }))
    };
  },

  submitQuiz: async (quizPayload) => {
    const { quizId, subject, chapterId, title, answers, totalQuestions, score } = quizPayload;

    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    const earnedXp = score * 50 + (percentage === 100 ? 100 : 25);

    const resultRecord = {
      id: 'qr-' + Date.now(),
      quizId: quizId || 'custom',
      subject: subject || 'physics',
      chapterId: chapterId || '',
      title: title || 'Diagnostic Quiz',
      score: Number(score || 0),
      total: Number(totalQuestions || 0),
      percentage,
      timestamp: Date.now()
    };

    updateStore(state => {
      state.quizResults = [resultRecord, ...(state.quizResults || [])];
      state.profile.xp = (state.profile.xp || 0) + earnedXp;
      state.profile.level = getLevel(state.profile.xp);
    });

    return {
      success: true,
      result: resultRecord,
      earnedXp,
      feedback: percentage >= 80 ? 'Mastery demonstrated! Outstanding conceptual clarity.' : percentage >= 50 ? 'Good foundation! Review tricky derivations and re-attempt.' : 'Needs revision: revisit first principles in the syllabus matrix.'
    };
  },

  // 7. Zare AI Assessment & Chat
  getZareAssessment: async () => {
    const store = getStore();
    const sessions = store.sessions || [];
    const progress = store.topicProgress || {};
    const quizzes = store.quizResults || [];

    let totalMinutes = 0;
    sessions.forEach(s => totalMinutes += Number(s.durationMinutes || 0));
    const totalHours = Number((totalMinutes / 60).toFixed(1));

    let totalMastered = 0;
    let needsRevisionCount = 0;

    Object.values(progress).forEach(p => {
      if (p.status === 'mastered') totalMastered++;
      if (p.status === 'needs-revision') needsRevisionCount++;
    });

    const avgQuizScore = quizzes.length
      ? Math.round(quizzes.reduce((acc, q) => acc + (q.percentage || 0), 0) / quizzes.length)
      : 0;

    const readinessIndex = Math.min(98, Math.round((totalMastered * 3.5) + (totalHours * 1.5) + (avgQuizScore * 0.3)));

    return {
      assessedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      studentLevel: store.profile?.level || 'Quantum Initiate',
      readinessScore: readinessIndex,
      metrics: {
        totalHoursLogged: totalHours,
        totalSessionsCount: sessions.length,
        topicsMasteredCount: totalMastered,
        topicsNeedingRevision: needsRevisionCount,
        averageQuizAccuracy: quizzes.length ? `${avgQuizScore}%` : '0%',
        retentionHealth: needsRevisionCount > 3 ? 'Caution: Retention decay detected in 3+ topics' : (sessions.length > 0 ? 'Optimal: Active recall schedule in sync' : 'Ready for initial study sessions')
      },
      strengths: sessions.length > 0 ? [
        'Consistent daily study streak and disciplined focus sessions.',
        'Strong grasp of high-weightage foundation units (Vectors, Kinematics, Mole Concept, Basic Trigonometry).',
        'Effective balance between problem-solving drills and conceptual derivations.'
      ] : [
        'Fresh study space initialized and ready for Grade 11 NCERT tracking.',
        'Comprehensive syllabus matrix loaded across Physics, Chemistry, and Mathematics.'
      ],
      growthAreas: [
        'Ionic Equilibrium (Buffer solutions and Salt hydrolysis calculations).',
        'Rotational Dynamics (Moment of Inertia theorems and rolling on inclines).',
        'Conic Sections (Hyperbola eccentricity and standard focal distance relations).'
      ],
      recommended7DayPlan: [
        { day: 'Day 1 (Physics)', focus: 'System of Particles: Parallel & Perpendicular Axis Theorems + 5 Numerical Problems' },
        { day: 'Day 2 (Chemistry)', focus: 'Equilibrium: Henderson-Hasselbalch Equation & Ksp common-ion numericals' },
        { day: 'Day 3 (Maths)', focus: 'Limits & Derivatives: Standard trigonometric limits lim(x->0) sin(x)/x and First Principle' },
        { day: 'Day 4 (Physics)', focus: 'Rotational Motion: Pure Rolling KE breakdown and angular momentum conservation' },
        { day: 'Day 5 (Chemistry)', focus: 'Chemical Bonding: MOT diagrams for B2, C2, N2, O2 and bond order calculation' },
        { day: 'Day 6 (Maths)', focus: 'Permutations & Combinations: Restricted arrangements and geometry problems' },
        { day: 'Day 7 (Zare Mock Test)', focus: 'Comprehensive 30-min Diagnostic on weak topics identified by Zare' }
      ],
      proTips: [
        'Derive key formulas from first principles every Sunday without looking at notes.',
        'Always draw a Free-Body Diagram (FBD) before writing Newton’s 2nd Law equations.',
        'In Organic Chemistry, focus on electron movements (curved arrows) rather than memorizing products.'
      ]
    };
  },

  sendZareChat: async (message) => {
    if (!message) {
      return { success: false, error: 'Message is required' };
    }

    const query = message.toLowerCase();
    let responseText = '';

    if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      responseText = `Hello! I am **Zare**, your dedicated Grade 11 NCERT AI Study Assessor.\n\nI monitor your progress across Physics, Chemistry, and Mathematics. How are your sessions progressing today? Would you like me to run a diagnostic quiz, evaluate your weak areas, or clarify a tricky NCERT concept?`;
    } else if (query.includes('quiz') || query.includes('test')) {
      responseText = `I can administer instant diagnostic tests on any Grade 11 chapter! \n\n🎯 **Recommended Quiz Targets:**\n- **Physics**: *Laws of Motion* or *Work, Energy & Power*\n- **Chemistry**: *Chemical Bonding (VSEPR & MOT)* or *Thermodynamics*\n- **Maths**: *Trigonometric Functions* or *Limits and Derivatives*\n\nHead to the **Syllabus Tracker** or click **Take Quiz** to start testing your recall!`;
    } else if (query.includes('physics') || query.includes('projectile') || query.includes('kinematics') || query.includes('motion')) {
      responseText = `### 🔭 Physics Assessment & Concept Insight\n\nIn Grade 11 Physics, mechanics accounts for over 45% of the conceptual weight. \n\n**Key NCERT Formula Spotlight (Projectile Motion):**\n- **Time of Flight:** $T = \\frac{2u \\sin\\theta}{g}$\n- **Max Height:** $H = \\frac{u^2 \\sin^2\\theta}{2g}$\n- **Horizontal Range:** $R = \\frac{u^2 \\sin 2\\theta}{g}$\n\n💡 **Zare's Pro Tip:** Note that complementary angles ($\theta$ and $90^\\circ - \\theta$) yield identical ranges! Always separate 2D motion into independent $x$ and $y$ vectors.`;
    } else if (query.includes('chemistry') || query.includes('bonding') || query.includes('mole') || query.includes('thermo')) {
      responseText = `### ⚗️ Chemistry Assessment & Concept Insight\n\nGrade 11 Chemistry sets the absolute foundation for Physical, Inorganic, and Organic branches.\n\n**Key Concept (Spontaneity in Thermodynamics):**\n$$\\Delta G = \\Delta H - T\\Delta S$$\n- $\\Delta G < 0$: Spontaneous reaction\n- $\\Delta G = 0$: Equilibrium state\n- $\\Delta G > 0$: Non-spontaneous (requires external work)\n\n💡 **Zare's Assessment Hint:** For exothermic reactions with positive $\\Delta S$, the reaction is spontaneous at all temperatures!`;
    } else if (query.includes('math') || query.includes('trigo') || query.includes('derivative') || query.includes('limit')) {
      responseText = `### 📐 Mathematics Assessment & Concept Insight\n\nCalculus and Trigonometry in Grade 11 are the language of advanced physics and engineering.\n\n**Standard Limit Theorem:**\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\quad (x \\text{ in radians})$$\n$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}$$\n\n💡 **Zare's Tip:** When solving 0/0 trigonometric limits, convert everything to sine and cosine or apply standard limits rather than blindly expanding!`;
    } else if (query.includes('how am i doing') || query.includes('status') || query.includes('progress') || query.includes('analysis') || query.includes('hours')) {
      const store = getStore();
      const sessCount = (store.sessions || []).length;
      let mins = 0;
      (store.sessions || []).forEach(s => mins += Number(s.durationMinutes || 0));
      const streak = calculateStreak(store.sessions || []);
      responseText = `### 📊 Zare's Live Study Evaluation\n\n- **Total Study Hours:** ${(mins / 60).toFixed(1)} hrs across ${sessCount} logged sessions\n- **Active Streak:** ${streak} days 🔥\n- **Scholar Level:** ${store.profile?.level || 'Quantum Initiate'}\n\n${sessCount > 0 ? 'Your study velocity is steady. Keep logging your daily study hours and take a 5-question chapter quiz every 3 sessions to lock concepts into long-term memory!' : 'Start your first focus session today to build your study velocity and rank up!'}`;
    } else {
      responseText = `### 🧠 Zare's Assessment Guidance\n\nRegarding **"${message}"**:\n\n1. **NCERT Conceptual Foundation:** Always map this to the specific NCERT textbook derivations.\n2. **Active Problem Solving:** After reading theory, solve at least 5 varied numerical problems immediately.\n3. **Spaced Repetition:** Revisit this topic on Day 1, Day 3, and Day 7 to counteract the Ebbinghaus forgetting curve.\n\nWould you like me to generate a tailored diagnostic quiz or detailed overview for this topic?`;
    }

    const userMsg = { id: 'msg-' + Date.now(), role: 'user', text: message, timestamp: Date.now() };
    const botMsg = { id: 'msg-' + (Date.now() + 1), role: 'assistant', text: responseText, timestamp: Date.now() + 1 };

    updateStore(state => {
      state.zareChat = [...(state.zareChat || []), userMsg, botMsg].slice(-20);
    });

    return { success: true, userMessage: userMsg, reply: botMsg };
  },

  // 8. Flashcards
  getFlashcards: async () => {
    const store = getStore();
    return store.flashcards || [];
  },

  createFlashcard: async (card) => {
    const { subject, front, back } = card;
    if (!front || !back) {
      return { success: false, error: 'Front and back content required' };
    }

    const newCard = {
      id: 'fc-' + Date.now(),
      subject: subject || 'physics',
      front,
      back
    };

    updateStore(state => {
      state.flashcards = [newCard, ...(state.flashcards || [])];
    });

    return { success: true, flashcard: newCard };
  }
};
