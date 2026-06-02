import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes';
import uploadRoutes from './routes/uploadRoutes';
import statsRoutes from './routes/statsRoutes';
import { loadInitialDocuments } from './utils/ingestion';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Connect to DB immediately for serverless environments
const mongoUri = process.env.MONGODB_URI;
if (mongoUri && !mongoUri.includes('localhost')) {
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.warn('⚠️  MongoDB connection skipped (offline mode).', err));
} else {
  console.warn('⚠️  MONGODB_URI not set or is local. Skipping DB connection.');
}

// Load initial documents (async) - this might take time on cold starts
loadInitialDocuments().catch(console.error);

export default app;
