"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const requestId_1 = require("./middleware/requestId");
const logging_1 = require("./middleware/logging");
const errorHandler_1 = require("./middleware/errorHandler");
const health_1 = __importDefault(require("./routes/health"));
const search_1 = __importDefault(require("./routes/search"));
const embeddings_1 = __importDefault(require("./routes/embeddings"));
const app = (0, express_1.default)();
app.use((0, express_2.json)({ limit: "1mb" }));
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(requestId_1.requestIdMiddleware);
app.use(logging_1.loggingMiddleware);
// Request timeout middleware - 30 second timeout for all endpoints
app.use((req, res, next) => {
    res.setTimeout(30000, () => {
        const requestId = req.requestId || 'unknown';
        logging_1.logger.error({ requestId, url: req.url }, 'Request timeout after 30 seconds');
        res.status(503).json({
            success: false,
            error: { code: 'REQUEST_TIMEOUT', message: 'Request took too long to complete' },
            requestId
        });
    });
    next();
});
app.use("/v1/health", health_1.default);
app.use("/v1/search", search_1.default);
app.use("/v1/embeddings", embeddings_1.default);
// Ping route root
app.get("/", (req, res) => res.redirect(302, "/v1/health"));
// Error handler (last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
