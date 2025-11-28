import { Type, type Static } from "@sinclair/typebox";

export const PitchFrame = Type.Object({
  t: Type.Number({ description: "時間（秒）" }),
  f0: Type.Number({ description: "基頻（Hz）；偵測不到可為 0" })
});
export type TPitchFrame = Static<typeof PitchFrame>;

export const AnalyzePitchReq = Type.Object({
  sampleRate: Type.Number({ minimum: 8000 }),
  frames: Type.Array(Type.Number())
});
export type TAnalyzePitchReq = Static<typeof AnalyzePitchReq>;

export const AnalyzePitchRes = Type.Object({
  contour: Type.Array(PitchFrame)
});
export type TAnalyzePitchRes = Static<typeof AnalyzePitchRes>;

export const ScoreSegment = Type.Object({
  start: Type.Number(),
  end: Type.Number(),
  score: Type.Number({ minimum: 0, maximum: 100 }),
  note: Type.Optional(Type.String()),
  advice: Type.Optional(Type.String())
});
export type TScoreSegment = Static<typeof ScoreSegment>;

export const ScoreReq = Type.Object({
  reference: Type.Array(PitchFrame),
  actual: Type.Array(PitchFrame),
  tuningA4: Type.Optional(Type.Number({ default: 440 })),
  smoothMs: Type.Optional(Type.Number({ default: 80 })),
  tolCents: Type.Optional(Type.Number({ default: 50 }))
});
export type TScoreReq = Static<typeof ScoreReq>;

export const ScoreRes = Type.Object({
  total: Type.Number({ minimum: 0, maximum: 100 }),
  segments: Type.Array(ScoreSegment)
});
export type TScoreRes = Static<typeof ScoreRes>;

export const SongSource = Type.Union([Type.Literal("user"), Type.Literal("sample")]);
export type TSongSource = Static<typeof SongSource>;

export const SongAssetStatus = Type.Union([
  Type.Literal("pending-analysis"),
  Type.Literal("ready"),
  Type.Literal("failed")
]);
export type TSongAssetStatus = Static<typeof SongAssetStatus>;

export const SongAsset = Type.Object({
  id: Type.String({ format: "uuid" }),
  source: SongSource,
  filename: Type.String(),
  mimetype: Type.String(),
  sizeBytes: Type.Number({ minimum: 0 }),
  durationSec: Type.Number({ minimum: 0 }),
  sampleRate: Type.Number({ minimum: 8000 }),
  checksum: Type.String(),
  storagePath: Type.String(),
  status: SongAssetStatus,
  error: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" })
});
export type TSongAsset = Static<typeof SongAsset>;

export const SongAssetCreated = Type.Object({
  songAssetId: Type.String({ format: "uuid" }),
  durationSec: Type.Number({ minimum: 0 }),
  sampleRate: Type.Number({ minimum: 8000 }),
  checksum: Type.String(),
  status: SongAssetStatus
});
export type TSongAssetCreated = Static<typeof SongAssetCreated>;

export const ReferenceContour = Type.Object({
  songAssetId: Type.String({ format: "uuid" }),
  frames: Type.Array(PitchFrame),
  generator: Type.String(),
  generatedAt: Type.String({ format: "date-time" }),
  quality: Type.Number({ minimum: 0, maximum: 1 }),
  notes: Type.Optional(Type.String())
});
export type TReferenceContour = Static<typeof ReferenceContour>;

export const LatencyMode = Type.Union([Type.Literal("auto"), Type.Literal("manual")]);
export type TLatencyMode = Static<typeof LatencyMode>;

export const LatencyProfileInput = Type.Object({
  mode: LatencyMode,
  valueMs: Type.Number(),
  confidence: Type.Optional(Type.Number({ minimum: 0, maximum: 1 })),
  attempts: Type.Optional(Type.Integer({ minimum: 0 })),
  failureReason: Type.Optional(Type.String())
});
export type TLatencyProfileInput = Static<typeof LatencyProfileInput>;

export const LatencyProfile = Type.Intersect([
  LatencyProfileInput,
  Type.Object({
    updatedAt: Type.String({ format: "date-time" })
  })
]);
export type TLatencyProfile = Static<typeof LatencyProfile>;

export const PracticeSessionState = Type.Union([
  Type.Literal("preparing"),
  Type.Literal("singing"),
  Type.Literal("scoring"),
  Type.Literal("completed"),
  Type.Literal("aborted")
]);
export type TPracticeSessionState = Static<typeof PracticeSessionState>;

export const DeviceInfo = Type.Object({
  label: Type.Optional(Type.String()),
  sampleRate: Type.Optional(Type.Number({ minimum: 8000 }))
});
export type TDeviceInfo = Static<typeof DeviceInfo>;

export const PracticeSession = Type.Object({
  id: Type.String({ format: "uuid" }),
  songAssetId: Type.String({ format: "uuid" }),
  referenceContourVersion: Type.Optional(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  state: PracticeSessionState,
  offsetMs: Type.Number(),
  offsetSource: Type.Optional(LatencyMode),
  deviceInfo: Type.Optional(DeviceInfo),
  framesPath: Type.Optional(Type.String()),
  networkStatus: Type.Optional(Type.String()),
  latencyProfile: Type.Optional(LatencyProfile)
});
export type TPracticeSession = Static<typeof PracticeSession>;

export const ScoreReport = Type.Object({
  id: Type.String({ format: "uuid" }),
  sessionId: Type.String({ format: "uuid" }),
  total: Type.Number({ minimum: 0, maximum: 100 }),
  latencyMs: Type.Number(),
  generatedAt: Type.String({ format: "date-time" }),
  segments: Type.Array(ScoreSegment),
  warnings: Type.Optional(Type.Array(Type.String()))
});
export type TScoreReport = Static<typeof ScoreReport>;
