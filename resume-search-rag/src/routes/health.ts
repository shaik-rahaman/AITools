import { Router, Request, Response } from "express";
import config from "../config/env";
import { connectToMongo } from "../config/mongodb";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const uptime = process.uptime();
  res.json({
    success: true,
    data: {
      name: config.appName,
      version: config.appVersion,
      uptimeSeconds: Math.floor(uptime),
      env: config.nodeEnv,
    },
    requestId: (req as any).requestId || null,
  });
});

router.get("/db", async (req: Request, res: Response) => {
  const requestId = (req as any).requestId || null;
  const start = Date.now();
  try {
    const client = await connectToMongo();
    const db = client.db(config.mongodbDbName);
    // ping
    await db.command({ ping: 1 });
    const latency = Date.now() - start;
    res.json({
      success: true,
      data: { status: "ok", latencyMs: latency },
      requestId,
    });
  } catch (e: any) {
    const latency = Date.now() - start;
    res.status(500).json({
      success: false,
      error: { code: "DB_UNAVAILABLE", message: e.message || String(e) },
      meta: { latencyMs: latency },
      requestId,
    });
  }
});

export default router;
