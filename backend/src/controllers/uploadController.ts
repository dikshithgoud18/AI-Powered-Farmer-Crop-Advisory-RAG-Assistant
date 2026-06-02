import { Request, Response } from 'express';
import fs from 'fs';
const { PDFParse } = require('pdf-parse');
import { ingestDocument } from '../services/ragService';

export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    let totalChunks = 0;

    for (const file of files) {
      let text = '';

      if (file.originalname.endsWith('.pdf') || file.mimetype === 'application/pdf') {
        const dataBuffer = new Uint8Array(file.buffer);
        const parser = new PDFParse(dataBuffer);
        const data = await parser.getText();
        text = data.text;
      } else {
        // Assume text file
        text = file.buffer.toString('utf-8');
      }

      const chunksAdded = await ingestDocument(text, { source: file.originalname });
      totalChunks += chunksAdded;
    }

    return res.json({ message: 'Files successfully processed and ingested', chunksAdded: totalChunks });
  } catch (error: any) {
    console.error('Error processing upload:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during upload' });
  }
};
