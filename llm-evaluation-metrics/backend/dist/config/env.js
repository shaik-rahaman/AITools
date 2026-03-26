import dotenv from "dotenv";
dotenv.config();
export const ENV = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
    DEEPEVAL_URL: process.env.DEEPEVAL_URL || "http://localhost:8000/eval",
    LLM_PROVIDER: (process.env.LLM_PROVIDER || "openai"),
    OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
    GROQ_MODEL: process.env.GROQ_MODEL || "mixtral-8x7b-32768"
};
// Validate required environment variables
if (!ENV.OPENAI_API_KEY && !ENV.GROQ_API_KEY) {
    console.warn("Warning: Neither OPENAI_API_KEY nor GROQ_API_KEY is set. LLM calls will fail.");
}
