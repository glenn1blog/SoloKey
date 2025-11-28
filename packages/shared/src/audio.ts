import type { TPitchFrame, TScoreSegment } from "./schemas.js";

export interface GridPoint {
  t: number;
  fRef: number;
  fUser: number;
}

export function framesToContour(
  frames: readonly number[],
  sampleRate: number,
  hopSeconds = 0.02
): TPitchFrame[] {
  if (!frames.length || sampleRate <= 0) {
    return [];
  }

  const hop = Math.max(1, Math.floor(sampleRate * hopSeconds));
  const contour: TPitchFrame[] = [];

  for (let i = 0; i < frames.length; i += hop) {
    const t = i / sampleRate;
    const f0 = Math.max(0, frames[i] ?? 0);
    contour.push({ t, f0 });
  }

  return contour;
}

export function estimateOffsetMs(
  ref: readonly TPitchFrame[],
  user: readonly TPitchFrame[],
  searchMs = 500
): number {
  if (!ref.length || !user.length) {
    return 0;
  }

  let bestOffset = 0;
  let bestError = Number.POSITIVE_INFINITY;

  for (let offset = -searchMs; offset <= searchMs; offset += 20) {
    const grid = resampleToGrid(ref, user, offset);
    if (!grid.length) continue;

    let errorSum = 0;
    let valid = 0;

    for (const point of grid) {
      if (point.fRef > 0 && point.fUser > 0) {
        errorSum += Math.abs(centsDiff(point.fUser, point.fRef));
        valid += 1;
      }
    }

    if (!valid) continue;

    const avgError = errorSum / valid;
    if (avgError < bestError) {
      bestError = avgError;
      bestOffset = offset;
    }
  }

  return bestOffset;
}

export function resampleToGrid(
  ref: readonly TPitchFrame[],
  user: readonly TPitchFrame[],
  offsetMs: number,
  dt = 0.02
): GridPoint[] {
  if (!ref.length || !user.length) {
    return [];
  }

  const offsetSec = offsetMs / 1000;
  const refEnd = ref.at(-1)?.t ?? 0;
  const userEnd = user.at(-1)?.t ?? 0;

  const startTime = Math.max(0, -offsetSec);
  const endTime = Math.min(refEnd, userEnd - offsetSec);

  if (endTime <= startTime) {
    return [];
  }

  const grid: GridPoint[] = [];

  for (let t = startTime; t <= endTime; t += dt) {
    const fRef = sampleAt(ref, t);
    const fUser = sampleAt(user, t + offsetSec);
    grid.push({ t, fRef, fUser });
  }

  return grid;
}

export function scoreGrid(
  grid: readonly GridPoint[],
  tolCents = 50,
  segSec = 2
): { total: number; segments: readonly TScoreSegment[] } {
  if (!grid.length) {
    return { total: 0, segments: [] };
  }

  let totalScore = 0;
  let validCount = 0;

  const segmentMap = new Map<number, { start: number; end: number; sum: number; count: number; diffSum: number }>();

  for (const point of grid) {
    if (point.fRef <= 0 || point.fUser <= 0) {
      continue;
    }

    const diff = centsDiff(point.fUser, point.fRef);
    const ratio = Math.max(0, 1 - Math.abs(diff) / tolCents);
    const score = ratio * 100;

    totalScore += score;
    validCount += 1;

    const index = Math.floor(point.t / segSec);
    const start = index * segSec;
    const end = start + segSec;

    const existing = segmentMap.get(start) ?? { start, end, sum: 0, count: 0, diffSum: 0 };
    existing.sum += score;
    existing.count += 1;
    existing.diffSum += diff;
    segmentMap.set(start, existing);
  }

  if (!validCount) {
    return { total: 0, segments: [] };
  }

  const segments: TScoreSegment[] = Array.from(segmentMap.values())
    .sort((a, b) => a.start - b.start)
    .map((segment) => ({
      start: segment.start,
      end: segment.end,
      score: Number((segment.sum / segment.count).toFixed(2)),
      note: describeSegment(segment.diffSum / segment.count)
    }));

  return {
    total: Number((totalScore / validCount).toFixed(2)),
    segments
  };
}

function sampleAt(frames: readonly TPitchFrame[], time: number): number {
  if (!frames.length) return 0;
  if (time <= frames[0].t) return frames[0].f0;

  const last = frames.at(-1);
  if (last && time >= last.t) {
    return last.f0;
  }

  let left = 0;
  let right = frames.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (frames[mid].t <= time) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  const prev = frames[Math.max(0, left - 1)];
  const next = frames[Math.min(frames.length - 1, left)];

  if (next.t === prev.t) {
    return next.f0;
  }

  const ratio = (time - prev.t) / (next.t - prev.t);
  return prev.f0 + ratio * (next.f0 - prev.f0);
}

function centsDiff(user: number, ref: number): number {
  if (user <= 0 || ref <= 0) {
    return 0;
  }

  return 1200 * Math.log2(user / ref);
}

function describeSegment(avgDiff: number): TScoreSegment["note"] {
  if (avgDiff > 5) return "稍高";
  if (avgDiff < -5) return "稍低";
  return "穩定";
}
