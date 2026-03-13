"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = __importDefault(require("../config/env"));
const mongodb_1 = require("../config/mongodb");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const uptime = process.uptime();
    res.json({
        success: true,
        data: {
            name: env_1.default.appName,
            version: env_1.default.appVersion,
            uptimeSeconds: Math.floor(uptime),
            env: env_1.default.nodeEnv,
        },
        requestId: req.requestId || null,
    });
});
router.get("/db", async (req, res) => {
    const requestId = req.requestId || null;
    const start = Date.now();
    try {
        const client = await (0, mongodb_1.connectToMongo)();
        const db = client.db(env_1.default.mongodbDbName);
        // ping
        await db.command({ ping: 1 });
        const latency = Date.now() - start;
        res.json({
            success: true,
            data: { status: "ok", latencyMs: latency },
            requestId,
        });
    }
    catch (e) {
        const latency = Date.now() - start;
        res.status(500).json({
            success: false,
            error: { code: "DB_UNAVAILABLE", message: e.message || String(e) },
            meta: { latencyMs: latency },
            requestId,
        });
    }
});
exports.default = router;
