"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggingService {
    logRequest(req) {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            method: req.method,
            endpoint: req.originalUrl,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }
    logResponse(res, durationMs) {
        const logEntry = {
            requestId: res.locals.requestId || '',
            statusCode: res.statusCode,
            durationMs: durationMs,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }
    logError(error, req) {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            errorMessage: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        };
        console.error(JSON.stringify(logEntry));
    }
}
exports.default = new LoggingService();
