"use client";

import type {
  TAnalyzePitchReq,
  TAnalyzePitchRes,
  TPitchFrame,
  TScoreReq,
  TScoreRes
} from "@solokey/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function uploadAudio(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error("上傳失敗");
  }

  return res.json() as Promise<{ fileId: string; duration: number; sampleRate: number }>;
}

export async function analyzePitch(payload: TAnalyzePitchReq): Promise<TAnalyzePitchRes> {
  const res = await fetch(`${API_BASE}/api/analyze/pitch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("音準分析失敗");
  }

  return res.json() as Promise<TAnalyzePitchRes>;
}

export async function scoreSinging(payload: TScoreReq): Promise<TScoreRes> {
  const res = await fetch(`${API_BASE}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("評分失敗");
  }

  return res.json() as Promise<TScoreRes>;
}

export async function fetchReferenceSample(): Promise<readonly TPitchFrame[]> {
  const res = await fetch("/samples/demo.reference.json");
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as readonly TPitchFrame[];
  return data;
}
