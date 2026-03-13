"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SearchService_1 = __importDefault(require("../services/SearchService"));
const logging_1 = require("../middleware/logging");
const router = express_1.default.Router();
const LLMService_1 = require("../services/LLMService");
const service = new SearchService_1.default();
let llm = null;
// POST /v1/search/bm25
router.post("/bm25", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, topK = 20, filters = {} } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        logging_1.logger.info({ msg: "search.bm25.request", requestId, queryLen: query.length, topK });
        const { results, meta } = await service.bm25Search(query, topK, filters);
        return res.json({ success: true, data: { results, meta }, requestId });
    }
    catch (err) {
        next(err);
    }
});
// POST /v1/search/vector
router.post("/vector", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, topK = 20, filters = {} } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        logging_1.logger.info({ msg: "search.vector.request", requestId, queryLen: query.length, topK });
        const { results, meta } = await service.vectorSearch(query, topK, filters);
        return res.json({ success: true, data: { results, meta }, requestId });
    }
    catch (err) {
        next(err);
    }
});
// POST /v1/search/hybrid
router.post("/hybrid", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, topK = 20, filters = {} } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        logging_1.logger.info({ msg: "search.hybrid.request", requestId, queryLen: query.length, topK });
        const { results, meta } = await service.hybridSearch(query, topK, filters);
        return res.json({ success: true, data: { results, meta }, requestId });
    }
    catch (err) {
        next(err);
    }
});
// POST /v1/search/rerank
router.post("/rerank", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, candidates = [], topK = 20 } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        if (!Array.isArray(candidates) || candidates.length === 0) {
            return res.status(400).json({ success: false, error: { code: "INVALID_CANDIDATES", message: "candidates must be a non-empty array" }, requestId });
        }
        logging_1.logger.info({ msg: "search.rerank.request", requestId, queryLen: query.length, candidateCount: candidates.length, topK });
        // Lazy instantiate LLMService so configuration errors are returned clearly
        if (!llm) {
            try {
                llm = new LLMService_1.LLMService();
            }
            catch (e) {
                return res.status(500).json({ success: false, error: { code: 'LLM_CONFIG_ERROR', message: e?.message || 'LLM configuration error' }, requestId });
            }
        }
        // Call LLM re-ranker
        try {
            const sorted = await llm.rerankCandidates(query, candidates, topK);
            return res.json({ success: true, data: { results: sorted.slice(0, topK) }, requestId });
        }
        catch (e) {
            // If upstream LLM failed, return fallback candidate list with warning
            if (e && typeof e.upstreamStatus !== 'undefined') {
                const meta = { rerankFallback: true, upstreamStatus: e.upstreamStatus, upstreamBody: e.upstreamBody };
                return res.json({ success: true, data: { results: candidates.slice(0, topK) }, meta, requestId });
            }
            throw e;
        }
    }
    catch (err) {
        next(err);
    }
});
// POST /v1/search/summarize
router.post("/summarize", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, candidate, style = 'short', maxTokens = 300 } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        // Accept multiple candidate shapes for backward compatibility:
        // - { resumeId, snippet }
        // - { id, text }
        let normalizedCandidate = null;
        if (candidate && typeof candidate === 'object') {
            const resumeId = typeof candidate.resumeId === 'string' ? candidate.resumeId : (typeof candidate.id === 'string' ? candidate.id : undefined);
            const snippet = typeof candidate.snippet === 'string' ? candidate.snippet : (typeof candidate.text === 'string' ? candidate.text : undefined);
            if (resumeId && snippet)
                normalizedCandidate = { resumeId, snippet };
        }
        if (!normalizedCandidate) {
            return res.status(400).json({ success: false, error: { code: "INVALID_CANDIDATE", message: "candidate must be an object with resumeId and snippet (or legacy id/text)" }, requestId });
        }
        // Lazy instantiate LLMService
        if (!llm) {
            try {
                llm = new LLMService_1.LLMService();
            }
            catch (e) {
                return res.status(500).json({ success: false, error: { code: 'LLM_CONFIG_ERROR', message: e?.message || 'LLM configuration error' }, requestId });
            }
        }
        try {
            const summary = await llm.summarizeCandidateFit(query, normalizedCandidate, { style, maxTokens });
            return res.json({ success: true, data: { summary }, requestId });
        }
        catch (e) {
            if (e && typeof e.upstreamStatus !== 'undefined') {
                return res.status(502).json({ success: false, error: { code: 'LLM_UPSTREAM_ERROR', message: 'LLM upstream error', upstreamStatus: e.upstreamStatus, upstreamBody: e.upstreamBody }, requestId });
            }
            throw e;
        }
    }
    catch (err) {
        next(err);
    }
});
// POST /v1/search  (end-to-end pipeline)
router.post("/", async (req, res, next) => {
    try {
        const requestId = req.requestId || null;
        const { query, topK = 20, filters = {}, rerankTopK = 8, summarize = false, summarizeTopK = 3, summarizeOptions = {} } = req.body || {};
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ success: false, error: { code: "INVALID_QUERY", message: "query must be a non-empty string" }, requestId });
        }
        logging_1.logger.info({ msg: "search.endtoend.request", requestId, queryLen: query.length, topK, rerankTopK, summarize });
        // Run base searches and merge candidates
        const base = await service.endToEndSearch(query, { topK, filters, rerankTopK, summarize, summarizeTopK, summarizeOptions });
        let candidates = base.results;
        const meta = { ...base.meta };
        // Lazy instantiate LLMService if we will rerank or summarize
        if ((!llm) && (rerankTopK > 0 || summarize)) {
            try {
                llm = new LLMService_1.LLMService();
            }
            catch (e) {
                // log and continue with fallback
                logging_1.logger.warn({ msg: 'llm.init.failed', err: e?.message });
                llm = null;
            }
        }
        let finalOrdered = candidates.slice();
        // Rerank top N using LLM if available
        if (llm && candidates.length && rerankTopK > 0) {
            try {
                const toRerank = candidates.slice(0, rerankTopK);
                const sorted = await llm.rerankCandidates(query, toRerank, rerankTopK);
                // Build map and re-order merged list: ranked first, then remaining
                const byId = new Map(finalOrdered.map(c => [c.resumeId, c]));
                const ordered = [];
                const seen = new Set();
                for (const s of sorted) {
                    const id = s.resumeId || s.id || s._id;
                    if (!id)
                        continue;
                    const src = byId.get(id);
                    if (src) {
                        ordered.push(src);
                        seen.add(id);
                    }
                }
                for (const c of finalOrdered) {
                    if (!seen.has(c.resumeId))
                        ordered.push(c);
                }
                finalOrdered = ordered;
                meta.rerankFallback = false;
            }
            catch (e) {
                // on LLM rerank failure, keep original order and attach diagnostics
                meta.rerankFallback = true;
                if (e && typeof e.upstreamStatus !== 'undefined') {
                    meta.rerankUpstreamStatus = e.upstreamStatus;
                    meta.rerankUpstreamBody = e.upstreamBody;
                }
                else {
                    meta.rerankError = e?.message || String(e);
                }
            }
        }
        else if (!llm && (rerankTopK > 0 || summarize)) {
            meta.rerankFallback = true;
            meta.rerankError = 'LLM not configured';
        }
        // Summarize top candidates if requested
        if (summarize && llm && finalOrdered.length) {
            meta.summaries = {};
            try {
                const toSummarize = finalOrdered.slice(0, summarizeTopK);
                for (const c of toSummarize) {
                    try {
                        const s = await llm.summarizeCandidateFit(query, { resumeId: c.resumeId, snippet: c.snippet }, summarizeOptions || {});
                        c.summary = s;
                        meta.summaries[c.resumeId] = { success: true };
                    }
                    catch (se) {
                        meta.summaries[c.resumeId] = { success: false, error: se?.message || se };
                    }
                }
            }
            catch (e) {
                meta.summarizeFallback = true;
                meta.summarizeError = e?.message || String(e);
            }
        }
        return res.json({ success: true, data: { results: finalOrdered }, meta, requestId });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
