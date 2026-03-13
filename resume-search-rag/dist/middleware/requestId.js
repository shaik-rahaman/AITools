"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
function requestIdMiddleware(req, res, next) {
    const id = req.headers["x-request-id"] || (globalThis.crypto && globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()));
    res.setHeader("X-Request-Id", id);
    req.requestId = id;
    next();
}
exports.default = requestIdMiddleware;
