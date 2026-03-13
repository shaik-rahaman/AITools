"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const mongodb_1 = require("./config/mongodb");
const logging_1 = require("./middleware/logging");
async function start() {
    try {
        // Don't wait for MongoDB connection on startup - connect lazily
        // This prevents the server from hanging if MongoDB is slow
        (0, mongodb_1.connectToMongo)().catch((err) => {
            logging_1.logger.warn({ err }, "Failed to connect to MongoDB on startup - will retry on first request");
        });
        const port = env_1.default.port || 3000;
        app_1.default.listen(port, () => {
            logging_1.logger.info({ port }, `Server started on port ${port}`);
        });
    }
    catch (e) {
        logging_1.logger.error({ err: e }, "Failed to start server");
        process.exit(1);
    }
}
start();
