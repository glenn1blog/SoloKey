import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import type { MultipartFile } from "@fastify/multipart";
import {
  AnalyzePitchReq,
  AnalyzePitchRes,
  ScoreReq,
  ScoreRes,
  type TAnalyzePitchReq,
  type TAnalyzePitchRes,
  type TScoreReq,
  type TScoreRes
} from "@solokey/shared";
import { serverConfig } from "./env.js";
import { framesToContour } from "./analyze.js";
import { estimateOffsetMs, resampleToGrid, scoreGrid } from "./score.js";

const app: FastifyInstance = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

await app.register(cors, { origin: serverConfig.corsOrigin });
await app.register(websocket);
await app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

app.get("/health", async () => ({ ok: true as const }));

app.post("/api/upload", async (req, reply) => {
  const parts = req.parts();
  let fileMeta: { filename?: string; mimetype?: string; size: number } | undefined;

  for await (const rawPart of parts) {
    if (!rawPart || !isMultipartFile(rawPart)) {
      continue;
    }

    let size = 0;
    for await (const chunk of rawPart.file) {
      size += chunk.length;
    }

    fileMeta = {
      filename: rawPart.filename,
      mimetype: rawPart.mimetype,
      size
    };
  }

  return reply.send({
    fileId: randomUUID(),
    duration: fileMeta ? Math.round((fileMeta.size / (320 * 1024)) * 30) : 0,
    sampleRate: 44100,
    metadata: fileMeta
  });
});

app.post<{ Body: TAnalyzePitchReq; Reply: TAnalyzePitchRes }>(
  "/api/analyze/pitch",
  {
    schema: {
      body: AnalyzePitchReq,
      response: {
        200: AnalyzePitchRes
      }
    }
  },
  async (req): Promise<TAnalyzePitchRes> => {
    const { frames, sampleRate } = req.body;
    const contour = framesToContour(frames, sampleRate);
    return { contour };
  }
);

app.post<{ Body: TScoreReq; Reply: TScoreRes }>(
  "/api/score",
  {
    schema: {
      body: ScoreReq,
      response: {
        200: ScoreRes
      }
    }
  },
  async (req): Promise<TScoreRes> => {
    const { reference, actual, tolCents = 50 } = req.body;
    const offsetMs = estimateOffsetMs(reference, actual);
    const grid = resampleToGrid(reference, actual, offsetMs);
    const { total, segments } = scoreGrid(grid, tolCents);
    return { total, segments: [...segments] };
  }
);

app.get("/realtime", { websocket: true }, (connection) => {
  connection.socket.on("message", (message: unknown) => {
    connection.socket.send(`pong:${String(message)}`);
  });
});

await app.listen({ port: serverConfig.port, host: serverConfig.host });

function isMultipartFile(part: unknown): part is MultipartFile {
  return part !== null && typeof part === "object" && "type" in part && (part as MultipartFile).type === "file";
}
