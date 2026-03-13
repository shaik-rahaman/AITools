"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = connectToMongo;
exports.getMongoClient = getMongoClient;
exports.getDbName = getDbName;
const mongodb_1 = require("mongodb");
const env_1 = __importDefault(require("./env"));
let client = null;
async function connectToMongo() {
    if (client)
        return client;
    if (!env_1.default.mongodbUri) {
        throw new Error("MONGODB_URI is not set");
    }
    client = new mongodb_1.MongoClient(env_1.default.mongodbUri);
    await client.connect();
    return client;
}
function getMongoClient() {
    return client;
}
function getDbName() {
    return env_1.default.mongodbDbName;
}
