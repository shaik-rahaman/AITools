import express, { Request, Response, NextFunction } from 'express';
import { EmbeddingService } from '../services/EmbeddingService';

const router = express.Router();
const embeddingService = new EmbeddingService();

async function handleEmbed(req: Request, res: Response, next: NextFunction) {
    try {
        const requestId = (req as any).requestId || null;
        const source = req.method === 'GET' ? 'query' : 'body';
        const input = source === 'query' ? (req.query.input as string | undefined) : req.body?.input;
        const model = source === 'query' ? (req.query.model as string | undefined) : req.body?.model;

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
    } catch (err: any) {
        const requestId = (req as any).requestId || null;
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

export default router;