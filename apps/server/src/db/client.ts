import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { resolve } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { serverConfig } from "../env.js";

const defaultDbPath = serverConfig.databaseUrl.startsWith("file:")
  ? serverConfig.databaseUrl.replace("file:", "")
  : serverConfig.databaseUrl;

const absolutePath = resolve(process.cwd(), defaultDbPath);
const parentDir = resolve(absolutePath, "..");

if (!existsSync(parentDir)) {
  mkdirSync(parentDir, { recursive: true });
}

const sqlite = new Database(absolutePath);

export const db = drizzle(sqlite);
