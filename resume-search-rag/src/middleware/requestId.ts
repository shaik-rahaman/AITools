import { Request, Response, NextFunction } from "express";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string) || (globalThis.crypto && (globalThis.crypto as any).randomUUID ? (globalThis.crypto as any).randomUUID() : String(Date.now()));
  res.setHeader("X-Request-Id", id);
  (req as any).requestId = id;
  next();
}

export default requestIdMiddleware;