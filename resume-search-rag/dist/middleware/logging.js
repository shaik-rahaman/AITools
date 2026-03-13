"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.loggingMiddleware = loggingMiddleware;
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)({ level: process.env.LOG_LEVEL || "info" });
function loggingMiddleware(req, res, next) {
    const start = Date.now();
    const requestId = req.requestId || req.headers["x-request-id"] || "-";
    exports.logger.info({ requestId, method: req.method, url: req.url }, "request_start");
    res.on("finish", () => {
        const duration = Date.now() - start;
        exports.logger.info({ requestId, method: req.method, url: req.url, status: res.statusCode, durationMs: duration }, "request_end");
    });
    next();
}
exports.default = exports.logger;
