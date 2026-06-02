import { Request, Response } from 'express';
import { queryRAG } from '../services/ragService';
import { v4 as uuidv4 } from 'uuid';

export const chatWithBot = async (req: Request, res: Response) => {
  try {
    const { message, sessionId: providedSessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sessionId = providedSessionId || uuidv4();

    // Process message through RAG pipeline
    const { answer, sources } = await queryRAG(message);

    return res.json({
      sessionId,
      answer,
      sources,
    });
  } catch (error: any) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};
