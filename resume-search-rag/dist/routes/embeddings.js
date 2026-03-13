"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmbeddingService_1 = require("../services/EmbeddingService");
const router = express_1.default.Router();
const embeddingService = new EmbeddingService_1.EmbeddingService();
async function handleEmbed(req, res, next) {
    try {
        const requestId = req.requestId || null;
        const source = req.method === 'GET' ? 'query' : 'body';
        const input = source === 'query' ? req.query.input : req.body?.input;
        const model = source === 'query' ? req.query.model : req.body?.model;
        const inputPresent = typeof input === 'string' && input.length > 0;
        const inputLength = typeof input === 'string' ? input.trim().length : 0;
        if (!inputPresent || inputLength === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_INPUT',
                    message: 'input must be a non-empty string',
                    details: {
                        source,
                        inputPresent,
                        inputLength,
                    },
                },
                requestId,
            });
        }
        const embedding = await embeddingService.generateEmbedding(input, model);
        return res.json({ success: true, data: { embedding, model: model || embeddingService.getModelName() }, requestId });
    }
    catch (err) {
        const requestId = req.requestId || null;
        // If upstream axios error, include useful info but don't leak sensitive headers
        if (err && err.response) {
            return res.status(502).json({
                success: false,
                error: {
                    code: 'EMBEDDING_API_ERROR',
                    message: err.message || 'Upstream embedding service error',
                    upstreamStatus: err.response.status,
                    upstreamBody: err.response.data,
                },
                requestId,
            });
        }
        next(err);
    }
}
// POST /v1/embeddings
router.post('/', handleEmbed);
// GET /v1/embeddings?input=... convenience
router.get('/', handleEmbed);
exports.default = router;
