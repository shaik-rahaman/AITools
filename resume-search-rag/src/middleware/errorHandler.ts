import { Request, Response, NextFunction } from "express";
import { logger } from "./logging";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) { // eslint-disable-line @typescript-eslint/no-unused-vars
  const requestId = (req as any).requestId || req.headers["x-request-id"] || "-";
  logger.error({ requestId, err }, "unhandled_error");
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: err.message || "Internal server error",
    },
    requestId,
  });
}

export { errorHandler };
export default errorHandler;