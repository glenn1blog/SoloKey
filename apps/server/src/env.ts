import { config } from "dotenv";

config();

export const serverConfig = {
  port: Number.parseInt(process.env.PORT ?? "4000", 10),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
};
