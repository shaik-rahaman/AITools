"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logging_1 = require("./logging");
function errorHandler(err, req, res, next) {
    const requestId = req.requestId || req.headers["x-request-id"] || "-";
    logging_1.logger.error({ requestId, err }, "unhandled_error");
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
exports.default = errorHandler;
