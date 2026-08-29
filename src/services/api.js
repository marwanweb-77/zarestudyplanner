const API_BASE = '/api';

export const api = {
  // Syllabus
  getSyllabus: async () => {
    try {
      const res = await fetch(`${API_BASE}/syllabus`);
      const data = await res.json();
      return data.syllabus;
    } catch (err) {
      console.warn('API getSyllabus fallback to offline', err);
      return null;
    }
  },

  // Sessions
  getSessions: async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      const data = await res.json();
      return data.sessions || [];
    } catch (err) {
      console.warn('API getSessions fallback', err);
      return [];
    }
  },

  createSession: async (sessionPayload) => {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload)
      });
      return await res.json();
    } catch (err) {
      console.error('Failed to create session', err);
      return { success: false, error: err.message };
    }
  },

  deleteSession: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Topic progress update
  updateTopicStatus: async ({ topicId, status, confidence, notes }) => {
    try {
      const res = await fetch(`${API_BASE}/topics/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, status, confidence, notes })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Analytics
  getAnalytics: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      const data = await res.json();
      return data.analytics;
    } catch (err) {
      console.warn('API getAnalytics fallback', err);
      return null;
    }
  },

  // Quotes, mind benders, session modes
  getQuotesData: async () => {
    try {
      const res = await fetch(`${API_BASE}/quotes`);
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  // Quizzes
  getQuiz: async (subject, chapterId) => {
    try {
      const res = await fetch(`${API_BASE}/quizzes/${subject}/${chapterId}`);
      const data = await res.json();
      return data.quiz;
    } catch (err) {
      return null;
    }
  },

  submitQuiz: async (quizPayload) => {
    try {
      const res = await fetch(`${API_BASE}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizPayload)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Zare AI Chat & Assessment
  sendZareChat: async (message) => {
    try {
      const res = await fetch(`${API_BASE}/zare/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  getZareAssessment: async () => {
    try {
      const res = await fetch(`${API_BASE}/zare/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      return data.assessment;
    } catch (err) {
      return null;
    }
  },

  // Flashcards
  getFlashcards: async () => {
    try {
      const res = await fetch(`${API_BASE}/flashcards`);
      const data = await res.json();
      return data.flashcards || [];
    } catch (err) {
      return [];
    }
  },

  createFlashcard: async (card) => {
    try {
      const res = await fetch(`${API_BASE}/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
