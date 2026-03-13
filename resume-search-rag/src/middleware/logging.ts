import { Request, Response, NextFunction } from "express";
import pino from "pino";

export const logger = pino({ level: process.env.LOG_LEVEL || "info" });

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = (req as any).requestId || (req.headers["x-request-id"] as string) || "-";
  logger.info({ requestId, method: req.method, url: req.url }, "request_start");
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({ requestId, method: req.method, url: req.url, status: res.statusCode, durationMs: duration }, "request_end");
  });
  next();
}

export default logger;