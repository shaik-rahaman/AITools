import { Request, Response } from 'express';

class LoggingService {
    logRequest(req: Request): void {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            method: req.method,
            endpoint: req.originalUrl,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }

    logResponse(res: Response, durationMs: number): void {
        const logEntry = {
            requestId: res.locals.requestId || '',
            statusCode: res.statusCode,
            durationMs: durationMs,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }

    logError(error: Error, req: Request): void {
        const logEntry = {
            requestId: req.headers['x-request-id'] || '',
            errorMessage: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        };
        console.error(JSON.stringify(logEntry));
    }
}

export default new LoggingService();