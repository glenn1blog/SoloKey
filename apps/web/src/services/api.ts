"use client";

import type {
  TAnalyzePitchReq,
  TAnalyzePitchRes,
  TLatencyProfileInput,
  TPracticeSession,
  TScoreReport,
  TScoreReq,
  TScoreRes,
  TSongAssetCreated,
  TPitchFrame
} from "@solokey/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface JsonRequestInit extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown>;
}

async function request<T>(path: string, init: JsonRequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(init.headers);
  let body: BodyInit | undefined;

  if (init.body instanceof FormData || init.body instanceof Blob) {
    body = init.body;
  } else if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.body);
  }

  const response = await fetch(url, { ...init, headers, body });
  if (!response.ok) {
    const message = await safeReadText(response);
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeReadText(response: Response): Promise<string | undefined> {
  try {
    return await response.text();
  } catch {
    return undefined;
  }
}

export async function uploadSong(file: File): Promise<TSongAssetCreated> {
  const formData = new FormData();
  formData.append("file", file);
  return request<TSongAssetCreated>("/api/upload", { method: "POST", body: formData });
}

export async function fetchReferenceContour(songAssetId: string): Promise<{
  frames: readonly TPitchFrame[];
  quality: number;
}> {
  return request<{ frames: readonly TPitchFrame[]; quality: number }>(`/api/songs/${songAssetId}/contour`, {
    method: "GET"
  });
}

export interface CreateSessionPayload {
  songAssetId: string;
  referenceVersion?: string;
}

export async function createPracticeSession(payload: CreateSessionPayload): Promise<TPracticeSession> {
  return request<TPracticeSession>("/api/sessions", {
    method: "POST",
    body: payload
  });
}

export async function updateLatencyProfile(
  sessionId: string,
  payload: TLatencyProfileInput
): Promise<TPracticeSession> {
  return request<TPracticeSession>(`/api/sessions/${sessionId}/latency`, {
    method: "PUT",
    body: payload
  });
}

export interface SubmitFramesPayload {
  frames: readonly TPitchFrame[];
  startedAt: number;
  endedAt: number;
}

export async function submitSessionFrames(sessionId: string, payload: SubmitFramesPayload): Promise<void> {
  await request<undefined>(`/api/sessions/${sessionId}/frames`, {
    method: "POST",
    body: payload
  });
}

export async function scoreSession(sessionId: string, toleranceCents = 50): Promise<TScoreReport> {
  return request<TScoreReport>("/api/score", {
    method: "POST",
    body: { sessionId, toleranceCents }
  });
}

export async function fetchScoreReport(resultId: string): Promise<TScoreReport> {
  return request<TScoreReport>(`/api/results/${resultId}`, { method: "GET" });
}

// ---- Legacy compatibility helpers (will be removed with SoloKey v1 UI rewrite) ----

export async function uploadAudio(file: File) {
  return uploadSong(file);
}

export async function analyzePitch(payload: TAnalyzePitchReq): Promise<TAnalyzePitchRes> {
  return request<TAnalyzePitchRes>("/api/analyze/pitch", { method: "POST", body: payload });
}

export async function scoreSinging(payload: TScoreReq): Promise<TScoreRes> {
  return request<TScoreRes>("/api/score", { method: "POST", body: payload });
}

export async function fetchReferenceSample(): Promise<readonly TPitchFrame[]> {
  console.warn("fetchReferenceSample 已被淘汰，請改用 fetchReferenceContour + sample metadata。");
  return [];
}
