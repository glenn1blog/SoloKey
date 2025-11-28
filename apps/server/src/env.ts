import { config } from "dotenv";

config();

export const serverConfig = {
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "file:./data/solokey.db",
  uploadDir: process.env.FILE_UPLOAD_DIR ?? "./uploads",
  realtimePath: process.env.REALTIME_PATH ?? "/realtime"
};
