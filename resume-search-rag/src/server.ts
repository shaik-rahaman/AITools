import app from "./app";
import config from "./config/env";
import { connectToMongo } from "./config/mongodb";
import { logger } from "./middleware/logging";

async function start() {
  try {
    // Don't wait for MongoDB connection on startup - connect lazily
    // This prevents the server from hanging if MongoDB is slow
    connectToMongo().catch((err) => {
      logger.warn({ err }, "Failed to connect to MongoDB on startup - will retry on first request");
    });
    
    const port = config.port || 3000;
    app.listen(port, () => {
      logger.info({ port }, `Server started on port ${port}`);
    });
  } catch (e) {
    logger.error({ err: e }, "Failed to start server");
    process.exit(1);
  }
}

start();
