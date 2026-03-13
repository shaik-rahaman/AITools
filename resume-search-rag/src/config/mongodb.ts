import { MongoClient } from "mongodb";
import config from "./env";

let client: MongoClient | null = null;

export async function connectToMongo() {
  if (client) return client;
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is not set");
  }
  client = new MongoClient(config.mongodbUri);
  await client.connect();
  return client;
}

export function getMongoClient(): MongoClient | null {
  return client;
}

export function getDbName(): string {
  return config.mongodbDbName;
}
