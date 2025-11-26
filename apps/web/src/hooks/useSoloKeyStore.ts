"use client";

import { create } from "zustand";
import type { TPitchFrame, TScoreSegment } from "@solokey/shared";

export interface SoloKeyState {
  reference: readonly TPitchFrame[];
  actual: readonly TPitchFrame[];
  segments: readonly TScoreSegment[];
  offsetMs: number;
  setReference: (frames: readonly TPitchFrame[]) => void;
  setActual: (frames: readonly TPitchFrame[]) => void;
  setSegments: (segments: readonly TScoreSegment[]) => void;
  setOffset: (value: number) => void;
}

export const useSoloKeyStore = create<SoloKeyState>((set) => ({
  reference: [],
  actual: [],
  segments: [],
  offsetMs: 0,
  setReference: (frames) => set({ reference: [...frames] }),
  setActual: (frames) => set({ actual: [...frames] }),
  setSegments: (segments) => set({ segments: [...segments] }),
  setOffset: (value) => set({ offsetMs: value })
}));
