import express from "express";
import { json } from "express";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/requestId";
import { loggingMiddleware, logger } from "./middleware/logging";
import { errorHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import searchRouter from "./routes/search";
import embeddingsRouter from "./routes/embeddings";

const app = express();

app.use(json({ limit: "1mb" }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(requestIdMiddleware);
app.use(loggingMiddleware);

// Request timeout middleware - 30 second timeout for all endpoints
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    const requestId = (req as any).requestId || 'unknown';
    logger.error({ requestId, url: req.url }, 'Request timeout after 30 seconds');
    res.status(503).json({
      success: false,
      error: { code: 'REQUEST_TIMEOUT', message: 'Request took too long to complete' },
      requestId
    });
  });
  next();
});

app.use("/v1/health", healthRouter);
app.use("/v1/search", searchRouter);
app.use("/v1/embeddings", embeddingsRouter);

// Ping route root
app.get("/", (req, res) => res.redirect(302, "/v1/health"));

// Error handler (last)
app.use(errorHandler);

export default app;