import { Document } from "@langchain/core/documents";
import crypto from "crypto";

// Lightweight in-memory vector store that uses simple TF-IDF-like hashing
// instead of neural embeddings to avoid OOM on low-memory machines.

interface StoredDoc {
  document: Document;
  tokens: Map<string, number>;
  magnitude: number;
}

const store: StoredDoc[] = [];

function tokenize(text: string): Map<string, number> {
  const tokens = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  for (const word of words) {
    tokens.set(word, (tokens.get(word) || 0) + 1);
  }
  return tokens;
}

function magnitude(tokens: Map<string, number>): number {
  let sum = 0;
  for (const v of tokens.values()) {
    sum += v * v;
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(a: Map<string, number>, aMag: number, b: Map<string, number>, bMag: number): number {
  if (aMag === 0 || bMag === 0) return 0;
  let dot = 0;
  for (const [key, val] of a) {
    if (b.has(key)) {
      dot += val * b.get(key)!;
    }
  }
  return dot / (aMag * bMag);
}

export async function addDocuments(docs: Document[]): Promise<void> {
  for (const doc of docs) {
    const tokens = tokenize(doc.pageContent);
    const mag = magnitude(tokens);
    store.push({ document: doc, tokens, magnitude: mag });
  }
}

export async function similaritySearch(query: string, k: number = 5): Promise<Document[]> {
  if (store.length === 0) return [];

  const queryTokens = tokenize(query);
  const queryMag = magnitude(queryTokens);

  const scored = store.map((item) => ({
    document: item.document,
    score: cosineSimilarity(queryTokens, queryMag, item.tokens, item.magnitude),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.document);
}

export function getStats(): { totalChunks: number, totalDocuments: number } {
  const sources = new Set<string>();
  for (const item of store) {
    if (item.document.metadata && item.document.metadata.source) {
      sources.add(item.document.metadata.source);
    }
  }
  return {
    totalChunks: store.length,
    totalDocuments: sources.size
  };
}
