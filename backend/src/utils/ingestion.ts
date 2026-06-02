import * as fs from 'fs';
import * as path from 'path';
import { ingestDocument } from '../services/ragService';

export const loadInitialDocuments = async () => {
  try {
    // Documents are at project root /documents/
    const docsPath = path.join(__dirname, '..', '..', '..', 'documents');
    if (!fs.existsSync(docsPath)) {
      console.log(`📁 Documents directory not found at: ${docsPath}`);
      return;
    }

    const files = fs.readdirSync(docsPath).filter(f => f.endsWith('.txt'));
    console.log(`📥 Found ${files.length} documents. Ingesting into VectorStore...`);

    let totalChunks = 0;
    for (const file of files) {
      const text = fs.readFileSync(path.join(docsPath, file), 'utf-8');
      const chunks = await ingestDocument(text, { source: file });
      totalChunks += chunks;
    }

    console.log(`✅ Initial ingestion complete! Added ${totalChunks} chunks from ${files.length} documents.`);
  } catch (error) {
    console.error("Error loading initial documents:", error);
  }
};
