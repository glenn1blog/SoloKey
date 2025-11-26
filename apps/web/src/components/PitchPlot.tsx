"use client";

import { useMemo } from "react";
import type { TPitchFrame } from "@solokey/shared";
import { useSoloKeyStore } from "../hooks/useSoloKeyStore.js";

interface PitchPlotProps {
  reference?: readonly TPitchFrame[];
  actual?: readonly TPitchFrame[];
}

export function PitchPlot({ reference, actual }: PitchPlotProps) {
  const offsetMs = useSoloKeyStore((state) => state.offsetMs);
  const storeReference = useSoloKeyStore((state) => state.reference);
  const storeActual = useSoloKeyStore((state) => state.actual);
  const { refPoints, actualPoints, maxFreq, maxTime } = useMemo(
    () => {
      const resolvedReference = storeReference.length ? storeReference : reference ?? [];
      const resolvedActual = storeActual.length ? storeActual : actual ?? [];
      return mapPoints(resolvedReference, resolvedActual);
    },
    [reference, actual, storeReference, storeActual]
  );

  return (
    <section className="sk-card space-y-3">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">音準曲線</p>
          <p className="text-sm text-[var(--sk-color-text-muted)]">對照目標與即時輸入</p>
        </div>
        <div className="text-sm text-[var(--sk-color-text-muted)]">Offset：{offsetMs}ms</div>
      </header>
      <svg viewBox="0 0 800 320" className="w-full rounded-2xl bg-[var(--sk-color-surface-soft)]" role="img">
        <Axis maxFreq={maxFreq} />
        <polyline fill="none" stroke="var(--sk-color-primary)" strokeWidth="3" points={refPoints} opacity={0.8} />
        <polyline fill="none" stroke="var(--sk-color-accent)" strokeWidth="3" points={actualPoints} opacity={0.9} />
        <text x="16" y="24" className="text-sm fill-[var(--sk-color-text-muted)]">
          長度：{maxTime.toFixed(1)}s
        </text>
      </svg>
    </section>
  );
}

function mapPoints(reference: readonly TPitchFrame[], actual: readonly TPitchFrame[]) {
  const refLast = reference.length ? reference[reference.length - 1] : undefined;
  const actualLast = actual.length ? actual[actual.length - 1] : undefined;
  const maxTime = Math.max(refLast?.t ?? 0, actualLast?.t ?? 0);
  const maxFreq = Math.max(
    ...[...reference, ...actual].map((frame) => frame.f0),
    1
  );

  const refPoints = reference.map((frame) => toSvgPoint(frame, maxTime, maxFreq)).join(" ");
  const actualPoints = actual.map((frame) => toSvgPoint(frame, maxTime, maxFreq)).join(" ");

  return { refPoints, actualPoints, maxTime, maxFreq };
}

function toSvgPoint(frame: TPitchFrame, maxTime: number, maxFreq: number) {
  const x = ((frame.t / Math.max(maxTime, 0.01)) * 760 + 20).toFixed(2);
  const y = (300 - (frame.f0 / maxFreq) * 260).toFixed(2);
  return `${x},${y}`;
}

function Axis({ maxFreq }: { maxFreq: number }) {
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    ratio,
    value: Math.round(maxFreq * ratio)
  }));

  return (
    <g>
      {ticks.map((tick) => (
        <g key={tick.ratio}>
          <line
            x1={0}
            y1={320 - tick.ratio * 260}
            x2={800}
            y2={320 - tick.ratio * 260}
            stroke="var(--sk-color-border)"
            strokeWidth="0.5"
          />
          <text x={4} y={324 - tick.ratio * 260} className="text-xs fill-[var(--sk-color-text-muted)]">
            {tick.value} Hz
          </text>
        </g>
      ))}
    </g>
  );
}
