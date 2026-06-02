import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from 'dotenv';

dotenv.config();

const evaluatorLlm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

// Faithfulness: Is the answer derived ONLY from the context?
const faithfulnessPrompt = PromptTemplate.fromTemplate(`
You are an expert evaluator. Given a Context and an Answer, you must determine if the Answer is completely faithful to the Context.
It should not contain any hallucinations or outside knowledge.
Output a single number between 0.0 and 1.0 representing the faithfulness score.

Context:
{context}

Answer:
{answer}

Score (0.0 to 1.0):
`);

export const evaluateFaithfulness = async (context: string, answer: string): Promise<number> => {
  try {
    const chain = faithfulnessPrompt.pipe(evaluatorLlm).pipe(new StringOutputParser());
    const result = await chain.invoke({ context, answer });
    const score = parseFloat(result.trim());
    return isNaN(score) ? 0 : score;
  } catch (error) {
    console.error("Evaluation error:", error);
    return 0;
  }
};
