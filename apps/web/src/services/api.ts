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
    TPitchFrame,
} from "@solokey/shared";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions<TBody = unknown> {
    readonly method?: HttpMethod;
    readonly body?: TBody | BodyInit;
    readonly signal?: AbortSignal;
    readonly headers?: HeadersInit;
    readonly query?: Readonly<
        Record<string, string | number | boolean | undefined>
    >;
}

/**
 * 將相對 path + 查詢參數組成完整 URL（會套用 API_BASE）
 */
function buildUrl(
    path: string,
    query?: Readonly<Record<string, string | number | boolean | undefined>>
): string {
    const url = new URL(path, API_BASE);

    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        }
    }

    return url.toString();
}

/**
 * 共用的 fetch 封裝：
 * - body 可以是 JSON 物件（例如 CreateSessionPayload）、FormData、字串等
 * - 自動決定要不要 JSON.stringify
 * - 回傳型別由 TResponse 控制
 */
async function request<TResponse, TBody = unknown>(
    path: string,
    options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
    const { method = "GET", body, signal, headers, query } = options;

    let finalBody: BodyInit | undefined;
    let finalHeaders: HeadersInit | undefined = headers;

    if (body === undefined) {
        finalBody = undefined;
    } else if (
        typeof body === "string" ||
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof URLSearchParams ||
        body instanceof ReadableStream
    ) {
        // 這些本來就是合法的 BodyInit，直接給 fetch
        finalBody = body;
    } else {
        // 其他情況視為 JSON 物件（例如 CreateSessionPayload）
        finalBody = JSON.stringify(body);
        finalHeaders = {
            ...headers,
            "Content-Type": "application/json",
        };
    }

    const response = await fetch(buildUrl(path, query), {
        method,
        body: finalBody,
        headers: finalHeaders,
        signal,
        credentials: "include",
    });

    if (!response.ok) {
        // 這裡你可以改成你原本的錯誤處理方式
        throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("Content-Type") ?? "";

    if (contentType.includes("application/json")) {
        // 由呼叫端決定 TResponse 的型別
        return (await response.json()) as TResponse;
    }

    // 若不是 JSON，就當成文字（例如單純 OK 訊息）
    return (await response.text()) as unknown as TResponse;
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
    return request<TSongAssetCreated>("/api/upload", {
        method: "POST",
        body: formData,
    });
}

export async function fetchReferenceContour(songAssetId: string): Promise<{
    frames: readonly TPitchFrame[];
    quality: number;
}> {
    return request<{ frames: readonly TPitchFrame[]; quality: number }>(
        `/api/songs/${songAssetId}/contour`,
        {
            method: "GET",
        }
    );
}

export interface CreateSessionPayload {
    songAssetId: string;
    referenceVersion?: string;
}

export async function createPracticeSession(
    payload: CreateSessionPayload
): Promise<TPracticeSession> {
    return request<TPracticeSession>("/api/sessions", {
        method: "POST",
        body: payload,
    });
}

export async function updateLatencyProfile(
    sessionId: string,
    payload: TLatencyProfileInput
): Promise<TPracticeSession> {
    return request<TPracticeSession>(`/api/sessions/${sessionId}/latency`, {
        method: "PUT",
        body: payload,
    });
}

export interface SubmitFramesPayload {
    frames: readonly TPitchFrame[];
    startedAt: number;
    endedAt: number;
}

export async function submitSessionFrames(
    sessionId: string,
    payload: SubmitFramesPayload
): Promise<void> {
    await request<undefined>(`/api/sessions/${sessionId}/frames`, {
        method: "POST",
        body: payload,
    });
}

export async function scoreSession(
    sessionId: string,
    toleranceCents = 50
): Promise<TScoreReport> {
    return request<TScoreReport>("/api/score", {
        method: "POST",
        body: { sessionId, toleranceCents },
    });
}

export async function fetchScoreReport(
    resultId: string
): Promise<TScoreReport> {
    return request<TScoreReport>(`/api/results/${resultId}`, { method: "GET" });
}

// ---- Legacy compatibility helpers (will be removed with SoloKey v1 UI rewrite) ----

export async function uploadAudio(file: File) {
    return uploadSong(file);
}

export async function analyzePitch(
    payload: TAnalyzePitchReq
): Promise<TAnalyzePitchRes> {
    return request<TAnalyzePitchRes>("/api/analyze/pitch", {
        method: "POST",
        body: payload,
    });
}

export async function scoreSinging(payload: TScoreReq): Promise<TScoreRes> {
    return request<TScoreRes>("/api/score", { method: "POST", body: payload });
}

export async function fetchReferenceSample(): Promise<readonly TPitchFrame[]> {
    console.warn(
        "fetchReferenceSample 已被淘汰，請改用 fetchReferenceContour + sample metadata。"
    );
    return [];
}
