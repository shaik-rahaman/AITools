import { Router } from "express";
import { callLLM } from "../services/llmClient.js";
import { evalFaithfulness } from "../services/evalClient.js";
import { retrieveContext } from "../services/ragService.js";
import { ENV } from "../config/env.js";
const router = Router();
/**
 * Error handler middleware for async routes
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
};
/**
 * POST /api/llm/eval
 * LLM-only evaluation endpoint
 *
 * Request body:
 * {
 *   prompt: string (required),
 *   model?: string (optional, defaults to gpt-4o-mini for OpenAI or mixtral-8x7b-32768 for Groq),
 *   provider?: "openai" | "groq" (optional, defaults to LLM_PROVIDER env var)
 * }
 *
 * Response:
 * {
 *   prompt: string,
 *   model: string,
 *   provider: string,
 *   llmResponse: string,
 *   metrics: { faithfulness?: number }
 * }
 */
router.post("/llm/eval", asyncHandler(async (req, res) => {
    const { prompt, model, provider } = req.body;
    // Validation
    if (!prompt) {
        return res.status(400).json({
            error: "Missing required field: prompt"
        });
    }
    // Determine effective provider and model
    const effectiveProvider = provider || ENV.LLM_PROVIDER;
    const effectiveModel = model || (effectiveProvider === "groq" ? ENV.GROQ_MODEL : ENV.OPENAI_MODEL);
    // Call LLM
    const llmResponse = await callLLM(prompt, effectiveModel, effectiveProvider);
    // Evaluate with Deepeval (pass provider)
    const evalResult = await evalFaithfulness(prompt, llmResponse, effectiveProvider);
    // Return response with only non-null metrics
    const metrics = Object.fromEntries(Object.entries(evalResult).filter(([_, v]) => v !== null));
    res.json({
        prompt,
        model: effectiveModel,
        provider: effectiveProvider,
        llmResponse,
        metrics
    });
}));
/**
 * POST /api/rag/eval
 * RAG + LLM evaluation endpoint
 *
 * Request body:
 * {
 *   query: string (required),
 *   model?: string (optional),
 *   provider?: "openai" | "groq" (optional)
 * }
 *
 * Response:
 * {
 *   query: string,
 *   context: string,
 *   prompt: string,
 *   llmResponse: string,
 *   metrics: { faithfulness?: number }
 * }
 */
router.post("/rag/eval", asyncHandler(async (req, res) => {
    const { query, model, provider } = req.body;
    // Validation
    if (!query) {
        return res.status(400).json({
            error: "Missing required field: query"
        });
    }
    // Determine effective provider and model
    const effectiveProvider = provider || ENV.LLM_PROVIDER;
    const effectiveModel = model || (effectiveProvider === "groq" ? ENV.GROQ_MODEL : ENV.OPENAI_MODEL);
    // 1. Retrieve context from RAG
    const context = await retrieveContext(query);
    // 2. Build RAG prompt
    const ragPrompt = `You are a helpful QA assistant. Using ONLY the following context, answer the question as accurately as possible. If the context does not contain the answer, say "I don't have enough information to answer that."

CONTEXT:
${context}

QUESTION:
${query}

ANSWER:`;
    // 3. Call LLM with RAG prompt
    const llmResponse = await callLLM(ragPrompt, effectiveModel, effectiveProvider);
    // 4. Evaluate faithfulness: source = context, output = llmResponse (pass provider)
    const evalResult = await evalFaithfulness(context, llmResponse, effectiveProvider);
    // Return response with only non-null metrics
    const metrics = Object.fromEntries(Object.entries(evalResult).filter(([_, v]) => v !== null));
    res.json({
        query,
        context,
        prompt: ragPrompt,
        llmResponse,
        metrics
    });
}));
/**
 * GET /health
 * Health check endpoint
 */
router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});
export default router;
