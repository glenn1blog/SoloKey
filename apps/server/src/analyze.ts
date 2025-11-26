import type { TPitchFrame } from "@solokey/shared";

export function framesToContour(frames: readonly number[], sampleRate: number): TPitchFrame[] {
  if (frames.length === 0 || sampleRate <= 0) {
    return [];
  }

  const hop = Math.max(1, Math.floor(sampleRate * 0.02));
  const contour: TPitchFrame[] = [];

  for (let i = 0; i < frames.length; i += hop) {
    const t = i / sampleRate;
    const f0 = Math.max(0, frames[i] ?? 0);
    contour.push({ t, f0 });
  }

  return contour;
}
