import { ChatGroq } from "@langchain/groq";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { addDocuments, similaritySearch } from "../vectorstore/chromaClient";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
});

const ragPrompt = PromptTemplate.fromTemplate(`
You are an expert AI Farmer Crop Advisory Assistant.
Use ONLY the context below to answer the question.
Always end your answer with a citation like: [Source: document_name].

Context:
{context}

Question: {question}

Answer:
`);

export const ingestDocument = async (
  text: string,
  metadata: Record<string, any>
): Promise<number> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await splitter.createDocuments([text], [metadata]);
  await addDocuments(docs);
  return docs.length;
};

export const queryRAG = async (
  question: string
): Promise<{ answer: string; sources: string[] }> => {
  const relevantDocs: Document[] = await similaritySearch(question, 5);

  if (relevantDocs.length === 0) {
    return {
      answer:
        "I don't have enough information in the knowledge base to answer that question yet. Please upload some agricultural documents first.",
      sources: [],
    };
  }

  const context = relevantDocs.map((d) => d.pageContent).join("\n\n---\n\n");
  const sources = [
    ...new Set(relevantDocs.map((d) => d.metadata?.source || "Unknown")),
  ];

  const chain = RunnableSequence.from([
    { context: () => context, question: (input: string) => input },
    ragPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const answer = await chain.invoke(question);
  return { answer, sources };
};
