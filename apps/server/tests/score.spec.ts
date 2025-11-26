import { describe, expect, it } from "vitest";
import type { TPitchFrame } from "@solokey/shared";
import { estimateOffsetMs, resampleToGrid, scoreGrid } from "../src/score.js";

const refContour: TPitchFrame[] = [
  { t: 0, f0: 220 },
  { t: 1, f0: 220 },
  { t: 2, f0: 233.08 },
  { t: 3, f0: 246.94 }
];

const userContour: TPitchFrame[] = [
  { t: 0.2, f0: 220 },
  { t: 1.2, f0: 220 },
  { t: 2.2, f0: 234 },
  { t: 3.2, f0: 247.5 }
];

describe("score helpers", () => {
  it("estimates offset close to expected delay", () => {
    const offset = estimateOffsetMs(refContour, userContour);
    expect(Math.abs(offset - 200)).toBeLessThanOrEqual(60);
  });

  it("resamples grid respecting offset", () => {
    const grid = resampleToGrid(refContour, userContour, 200);
    expect(grid.length).toBeGreaterThan(0);
    expect(grid[0]?.fRef).toBeDefined();
  });

  it("scores aligned curves with high grades", () => {
    const grid = resampleToGrid(refContour, userContour, 200);
    const score = scoreGrid(grid);
    expect(score.total).toBeGreaterThan(80);
    expect(score.segments.length).toBeGreaterThan(0);
  });

  it("returns zeros when grid empty", () => {
    const score = scoreGrid([]);
    expect(score.total).toBe(0);
    expect(score.segments).toEqual([]);
  });
});
