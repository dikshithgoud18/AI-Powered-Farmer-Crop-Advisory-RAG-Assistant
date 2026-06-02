import { Request, Response } from 'express';
import { getStats } from '../vectorstore/chromaClient';

export const getDashboardStats = (req: Request, res: Response) => {
  try {
    const stats = getStats();
    
    // We will still mock the evaluation data for now since we don't have RAGAS implemented here.
    return res.json({
      totalDocuments: stats.totalDocuments,
      totalChunks: stats.totalChunks,
      queriesAnswered: 303, // Mock
      avgAccuracy: 88.4 // Mock
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
