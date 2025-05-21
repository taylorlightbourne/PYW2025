import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat';
import logger from './services/logger';

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS - more permissive for development
app.use(cors({
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 