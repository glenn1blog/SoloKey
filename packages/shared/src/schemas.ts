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
  note: Type.Optional(Type.String())
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
