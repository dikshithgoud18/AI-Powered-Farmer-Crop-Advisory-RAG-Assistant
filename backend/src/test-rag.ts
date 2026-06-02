import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { ChatGroq } from "@langchain/groq";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

async function testRAG() {
  console.log("1. Initializing Models...");
  // Using Local HuggingFace Embeddings
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });

  // Using GROQ for LLM
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama3-8b-8192", // Using an available Groq model
    temperature: 0.1,
  });

  console.log("2. Loading Sample Document...");
  const docPath = path.join(__dirname, '..', '..', 'data', 'documents', 'wheat_cultivation_guide.txt');
  const loader = new TextLoader(docPath);
  const rawDocs = await loader.load();

  console.log("3. Chunking Document...");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const docs = await textSplitter.splitDocuments(rawDocs);
  console.log(`Created ${docs.length} chunks.`);

  console.log("4. Storing in ChromaDB...");
  // Connect to local ChromaDB
  const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName: "agri_docs",
    url: "http://localhost:8000",
  });

  console.log("5. Querying the Vector Store...");
  const question = "What are the key practices for wheat cultivation?";
  const retriever = vectorStore.asRetriever();
  
  const prompt = PromptTemplate.fromTemplate(`
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Always include a brief citation of the source document used.

    Context:
    {context}

    Question: {question}
    Answer:
  `);

  console.log("6. Generating Answer with GROQ...");
  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: (input: string) => input,
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke(question);
  console.log("\n--- RESULT ---");
  console.log(result);
  console.log("--------------\n");
}

testRAG().catch(console.error);
