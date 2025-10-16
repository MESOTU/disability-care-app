import helmet from 'helmet';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-url.vercel.app' 
    : ['http://localhost:5173', 'http://localhost:5174', 'https://disability-care-app.vercel.app'],
  credentials: true
}));
app.use(helmet()); 
app.use(express.json());

// Test route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Disability Care Backend!' });
});

// GET all participants
app.get('/api/participants', async (req, res) => {
  try {
    const participants = await prisma.participant.findMany();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// CREATE a new participant
app.post('/api/participants', async (req, res) => {
  try {
    const { name, age, diagnosis } = req.body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Valid name is required' });
    }
    
    if (!age || typeof age !== 'number' || age < 0 || age > 120) {
      return res.status(400).json({ error: 'Valid age is required (0-120)' });
    }
    
    if (!diagnosis || typeof diagnosis !== 'string' || diagnosis.trim().length === 0) {
      return res.status(400).json({ error: 'Valid diagnosis is required' });
    }

        const participant = await prisma.participant.create({
      data: { 
        name: name.trim(),
        age: age,
        diagnosis: diagnosis.trim()
      }
    });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});