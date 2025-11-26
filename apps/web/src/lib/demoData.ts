import type { TPitchFrame, TScoreSegment } from "@solokey/shared";

export const demoReference: TPitchFrame[] = [
  { t: 0, f0: 220 },
  { t: 0.5, f0: 220 },
  { t: 1, f0: 233.08 },
  { t: 1.5, f0: 246.94 },
  { t: 2, f0: 246.94 },
  { t: 2.5, f0: 261.63 },
  { t: 3, f0: 261.63 },
  { t: 3.5, f0: 246.94 }
];

export const demoActual: TPitchFrame[] = [
  { t: 0.2, f0: 220 },
  { t: 0.7, f0: 218 },
  { t: 1.2, f0: 235 },
  { t: 1.7, f0: 244 },
  { t: 2.2, f0: 247 },
  { t: 2.7, f0: 259 },
  { t: 3.2, f0: 264 },
  { t: 3.7, f0: 250 }
];

export const demoSegments: TScoreSegment[] = [
  { start: 0, end: 2, score: 88, note: "穩定" },
  { start: 2, end: 4, score: 82, note: "稍高" }
];

export const demoResult = {
  total: 85,
  segments: demoSegments
};
