import { describe, expect, it } from "vitest";
import type { TPitchFrame } from "../src/schemas.js";
import { estimateOffsetMs, framesToContour, resampleToGrid, scoreGrid } from "../src/audio.js";

const reference: TPitchFrame[] = [
  { t: 0, f0: 220 },
  { t: 1, f0: 220 },
  { t: 2, f0: 233.08 },
  { t: 3, f0: 246.94 }
];

const user: TPitchFrame[] = [
  { t: 0.2, f0: 220 },
  { t: 1.2, f0: 220 },
  { t: 2.2, f0: 234 },
  { t: 3.2, f0: 247.5 }
];

describe("audio helpers", () => {
  it("converts numeric frames to contour", () => {
    const contour = framesToContour([220, 220, 233.08, 246.94], 100);
    expect(contour.length).toBeGreaterThan(0);
    expect(contour[0]).toEqual({ t: 0, f0: 220 });
  });

  it("estimates offset using cross correlation", () => {
    const offset = estimateOffsetMs(reference, user);
    expect(Math.abs(offset - 200)).toBeLessThanOrEqual(60);
  });

  it("scores aligned curves with high grades", () => {
    const grid = resampleToGrid(reference, user, 200);
    const score = scoreGrid(grid);
    expect(score.total).toBeGreaterThan(80);
    expect(score.segments.length).toBeGreaterThan(0);
  });

  it("returns zeroes when no valid grid", () => {
    const score = scoreGrid([]);
    expect(score.total).toBe(0);
    expect(score.segments).toHaveLength(0);
  });
});
