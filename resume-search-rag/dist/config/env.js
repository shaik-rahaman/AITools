"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env from project root (two levels up from src/config)
const root = path_1.default.resolve(__dirname, "../..");
const envPath = path_1.default.join(root, ".env");
dotenv_1.default.config({ path: envPath });
function readPackageVersion() {
    try {
        const pkg = JSON.parse(fs_1.default.readFileSync(path_1.default.join(root, "package.json"), "utf8"));
        return pkg.version || "0.0.0";
    }
    catch (e) {
        return "0.0.0";
    }
}
exports.config = {
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
exports.default = exports.config;
