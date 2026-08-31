import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'store.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

const defaultState = {
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

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultState, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(defaultState));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, restoring defaults:', err);
    return JSON.parse(JSON.stringify(defaultState));
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

export const db = {
  get: () => readDb(),
  update: (updater) => {
    const current = readDb();
    const next = updater(current) || current;
    writeDb(next);
    return next;
  }
};
