"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingService = void 0;
const axios_1 = __importDefault(require("axios"));
class EmbeddingService {
    constructor() {
        this.apiUrl = process.env.EMBEDDING_API_URL || 'https://api.mistral.ai/v1/embeddings';
        this.apiKey = process.env.API_KEY || process.env.MISTRAL_API_KEY || '';
        this.defaultModel = process.env.EMBEDDING_MODEL || 'mistral-embed-small';
    }
    getModelName() {
        return this.defaultModel;
    }
    async generateEmbedding(input, model) {
        if (typeof input !== 'string' || !input.trim()) {
            const e = new Error('INVALID_INPUT: input must be a non-empty string');
            e.code = 'INVALID_INPUT';
            throw e;
        }
        const modelToUse = model || this.defaultModel;
        const requestBody = {
            model: modelToUse,
            input,
        };
        try {
            // Some envs set EMBEDDING_API_URL to the full embeddings endpoint
            const url = this.apiUrl.endsWith('/embeddings') ? this.apiUrl : `${this.apiUrl}`;
            const response = await axios_1.default.post(url, requestBody, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });
            const data = response.data || {};
            // Support multiple response shapes
            if (Array.isArray(data?.data) && Array.isArray(data.data[0]?.embedding)) {
                return data.data[0].embedding;
            }
            if (Array.isArray(data?.embedding)) {
                return data.embedding;
            }
            if (Array.isArray(data?.embeddings) && Array.isArray(data.embeddings[0])) {
                return data.embeddings[0];
            }
            // Fallback: try to find first numeric array in response
            for (const v of Object.values(data)) {
                if (Array.isArray(v) && typeof v[0] === 'number')
                    return v;
            }
            throw new Error('Unexpected embedding response');
        }
        catch (error) {
            console.error('Error generating embedding:', error?.message || error);
            throw error;
        }
    }
}
exports.EmbeddingService = EmbeddingService;
