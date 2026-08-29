import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routing
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Zare Grade 11 NCERT Study Suite', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`⚡ Zare Study Hub Backend Server running at http://localhost:${PORT}`);
});
