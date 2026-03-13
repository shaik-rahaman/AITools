"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResumeRepository_1 = __importDefault(require("../repositories/ResumeRepository"));
const EmbeddingService_1 = require("./EmbeddingService");
class SearchService {
    constructor() {
        this.repo = ResumeRepository_1.default;
        this.embeddingService = new EmbeddingService_1.EmbeddingService();
    }
    async bm25Search(query, topK = 20, filters = {}) {
        const start = Date.now();
        const results = await this.repo.bm25Search(query, topK, filters);
        const latencyMs = Date.now() - start;
        return { results, meta: { topK, latencyMs } };
    }
    async vectorSearch(query, topK = 20, filters = {}) {
        const start = Date.now();
        try {
            // Add timeout to embedding generation (5 seconds max)
            const embeddingPromise = Promise.race([
                this.embeddingService.generateEmbedding(query),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Embedding timeout: took longer than 5 seconds')), 5000))
            ]);
            const embedding = await embeddingPromise;
            try {
                const results = await this.repo.vectorSearch(embedding, topK, filters);
                const latencyMs = Date.now() - start;
                return { results, meta: { topK, latencyMs } };
            }
            catch (err) {
                // On vector search failure (missing index etc), attempt a graceful BM25 fallback
                const latencyMs = Date.now() - start;
                const diagnostics = { message: err?.message || String(err) };
                if (err?.index)
                    diagnostics.index = err.index;
                if (err?.path)
                    diagnostics.path = err.path;
                if (err?.expectedDimensions)
                    diagnostics.expectedDimensions = err.expectedDimensions;
                if (err?.raw)
                    diagnostics.raw = err.raw;
                try {
                    const fbResults = await this.repo.bm25Search(query, topK, filters);
                    return { results: fbResults, meta: { topK, latencyMs, fallback: 'bm25', diagnostics } };
                }
                catch (fbErr) {
                    return { results: [], meta: { topK, latencyMs, error: diagnostics } };
                }
            }
        }
        catch (err) {
            // Embedding timeout or error - fallback to BM25
            const latencyMs = Date.now() - start;
            const diagnostics = { message: err?.message || String(err) };
            try {
                const fbResults = await this.repo.bm25Search(query, topK, filters);
                return { results: fbResults, meta: { topK, latencyMs, fallback: 'bm25', diagnostics } };
            }
            catch (fbErr) {
                return { results: [], meta: { topK, latencyMs, error: diagnostics } };
            }
        }
    }
    async hybridSearch(query, topK = 20, filters = {}) {
        const start = Date.now();
        // Always run BM25 search first - it's fast and reliable
        let bm25Results = [];
        let bm25Error = null;
        try {
            bm25Results = await this.repo.bm25Search(query, topK, filters);
        }
        catch (err) {
            bm25Error = err?.message || String(err);
            console.error('[SearchService] BM25 search failed:', bm25Error);
        }
        // Try vector search with timeout - don't block BM25 results
        let vectorResults = [];
        let vectorError = null;
        try {
            // Add a timeout to embedding generation (5 seconds max)
            const embeddingPromise = Promise.race([
                this.embeddingService.generateEmbedding(query),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Embedding timeout')), 5000))
            ]);
            const embedding = await embeddingPromise;
            vectorResults = await this.repo.vectorSearch(embedding, topK, filters);
        }
        catch (err) {
            vectorError = err?.message || String(err);
            console.error('[SearchService] Vector search failed:', vectorError);
            // Continue without vector results - BM25 results will be returned
        }
        const result = { bm25: bm25Results, vector: vectorResults, errors: {} };
        if (bm25Error)
            result.errors.bm25 = bm25Error;
        if (vectorError)
            result.errors.vector = vectorError;
        const latencyMs = Date.now() - start;
        return { results: result, meta: { topK, latencyMs } };
    }
    async endToEndSearch(query, options = {}) {
        const start = Date.now();
        const topK = options.topK || 20;
        const filters = options.filters || {};
        const rerankTopK = options.rerankTopK || 8;
        const summarize = !!options.summarize;
        const summarizeTopK = options.summarizeTopK || 3;
        // Run BM25 and Vector in parallel
        const bm25Promise = this.repo.bm25Search(query, topK, filters);
        const vectorPromise = (async () => {
            const embedding = await this.embeddingService.generateEmbedding(query);
            return this.repo.vectorSearch(embedding, topK, filters);
        })();
        const [bm25ResP, vectorResP] = await Promise.allSettled([bm25Promise, vectorPromise]);
        const errors = {};
        const bm25Results = bm25ResP.status === 'fulfilled' ? bm25ResP.value : [];
        if (bm25ResP.status === 'rejected')
            errors.bm25 = bm25ResP.reason?.message || String(bm25ResP.reason);
        const vectorResults = vectorResP.status === 'fulfilled' ? vectorResP.value : [];
        if (vectorResP.status === 'rejected')
            errors.vector = vectorResP.reason?.message || String(vectorResP.reason);
        // Merge and deduplicate candidates: preserve BM25 order first, then vector
        const seen = new Set();
        const merged = [];
        for (const r of bm25Results) {
            const id = r._id || r._id?.toString();
            if (!id)
                continue;
            if (seen.has(id))
                continue;
            seen.add(id);
            merged.push({ resumeId: id, snippet: r.snippet || `${r.role || ''} ${r.company || ''}`.trim() });
        }
        for (const r of vectorResults) {
            const id = r._id || r._id?.toString();
            if (!id)
                continue;
            if (seen.has(id))
                continue;
            seen.add(id);
            merged.push({ resumeId: id, snippet: r.snippet || `${r.role || ''} ${r.company || ''}`.trim() });
        }
        const latencyMs = Date.now() - start;
        return { results: merged, meta: { topK, latencyMs, errors, rerankTopK, summarize, summarizeTopK } };
    }
}
exports.default = SearchService;
