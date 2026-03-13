import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load .env from project root (two levels up from src/config)
const root = path.resolve(__dirname, "../..");
const envPath = path.join(root, ".env");
dotenv.config({ path: envPath });

function readPackageVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    return pkg.version || "0.0.0";
  } catch (e) {
    return "0.0.0";
  }
}

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || process.env.MONGO_URI || "",
  mongodbDbName: process.env.MONGODB_DB_NAME || process.env.DB_NAME || "resumes",
  appName: process.env.APP_NAME || "resume-search-rag",
  appVersion: process.env.APP_VERSION || readPackageVersion(),
  embeddingModel: process.env.EMBEDDING_MODEL || process.env.MISTRAL_EMBEDDING_MODEL || "mistral-embed",
  llmModel: process.env.LLM_MODEL || process.env.GROQ_LLM_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
  llmApiUrl: process.env.LLM_API_URL || process.env.GROQ_API_URL || "",
  llmApiKey: process.env.LLM_API_KEY || process.env.GROQ_API_KEY || "",
};

export default config;