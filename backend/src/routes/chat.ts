import { Router, Response } from 'express';
import { sendMessage } from '../services/chatService';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import logger from '../services/logger';

export const chatRouter = Router();

interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

// Temporarily remove authentication for testing
chatRouter.post('/send', async (req: any, res: Response) => {
  try {
    logger.info('Received chat request', {
      body: req.body,
      headers: req.headers,
      url: req.url
    });

    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      logger.error('Invalid request format', { 
        body: req.body,
        messages: messages 
      });
      return res.status(400).json({ 
        error: 'Invalid request format',
        details: 'Messages must be an array'
      });
    }

    logger.info('Processing chat message', {
      messageCount: messages.length,
      firstMessage: messages[0]?.content?.substring(0, 50) + '...'
    });

    const response = await sendMessage(messages);
    
    logger.info('Chat response generated', {
      responseLength: response.length,
      responsePreview: response.substring(0, 50) + '...'
    });

    res.json({ response });
  } catch (error: any) {
    logger.error('Error in chat endpoint:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}); 