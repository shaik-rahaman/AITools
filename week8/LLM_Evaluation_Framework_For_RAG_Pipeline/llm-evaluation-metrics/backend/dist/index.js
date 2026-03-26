import express from "express";
import { ENV } from "./config/env.js";
import evalRoutes from "./routes/evalRoutes.js";
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Routes
app.use("/api", evalRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        path: req.path,
        method: req.method
    });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error("[ERROR]", err);
    const error = err;
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    res.status(status).json({
        error: message,
        status
    });
});
// Start server
const PORT = ENV.PORT;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Deepeval Demo Server Running         ║
╠════════════════════════════════════════╣
║   Port: ${PORT}
║   Env: ${process.env.NODE_ENV || "development"}
║   LLM Provider: ${ENV.LLM_PROVIDER}
║   Deepeval URL: ${ENV.DEEPEVAL_URL}
╠════════════════════════════════════════╣
║   POST /api/llm/eval                   ║
║   POST /api/rag/eval                   ║
║   GET  /api/health                     ║
╚════════════════════════════════════════╝
  `);
});
export default app;
