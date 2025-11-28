# SoloKey — 規格與實作指南（給 Codex）

> 本檔提供 **Codex/代理** 可直接遵循的實作細節：API 介面、Fastify 路由 payload、評分演算法（pitch/score）、Web 流程、技術堆疊決策、設計資源、測試資料與 DevOps。**所有說明與產出請使用繁體中文。**

---

## 0) Strategy Brief（專案級）
- **Goal**：完成上傳 MP3、生成/載入目標音準曲線、麥克風即時比對、延遲校正、自動評分與結果回放的 MVP。
- **Non-goals**：社群功能、雲端使用者系統、大量歌曲版權資料接入。
- **Scope & Impact**：
  - 前端：Next.js 16（App Router）/ React 19 / TS 5 / Tailwind CSS 4。
  - 後端：Node.js + **Fastify**（建議）。
  - 共用型別：`packages/shared`。
- **Approach（MVP）**：
  1. 完成後端路由：`/api/upload`、`/api/analyze/pitch`、`/api/score`、`/realtime`（WS）。
  2. 完成前端頁面：`/`（上傳）→ `/sing`（練唱/延遲校正）→ `/result/[id]`（分數/回放）。
  3. 嚴格型別（禁止 `any`）、ESLint 0 錯誤、提供最小測試資料與單元測試。
- **Acceptance Criteria**：
  - 上傳、分析、評分 API 均可回應，前端可顯示雙曲線、完成一次完整練唱流程。
  - `pnpm lint && pnpm typecheck && pnpm test` 皆通過。
- **Risks / Guard Rails**：
  - 音訊延遲差異 → 先提供互相關（cross-correlation）校正與 UI 滑桿微調。
  - 效能 → 重運算放 Worker/Worklet；畫布繪圖批次抽樣。

---

## 1) API 規格（TypeBox）與 Fastify 路由
> 共用型別建議放 `packages/shared/schemas.ts`，前後端共同引用。

```ts
import { Type, type Static } from "@sinclair/typebox";

// 單一音準點：時間（秒）與基頻（Hz）
export const PitchFrame = Type.Object({
  t: Type.Number({ description: "時間（秒）" }),
  f0: Type.Number({ description: "基頻（Hz）；偵測不到可為 0" }),
});
export type TPitchFrame = Static<typeof PitchFrame>;

export const AnalyzePitchReq = Type.Object({
  sampleRate: Type.Number({ minimum: 8000 }),
  frames: Type.Array(Type.Number()),
});
export type TAnalyzePitchReq = Static<typeof AnalyzePitchReq>;

export const AnalyzePitchRes = Type.Object({
  contour: Type.Array(PitchFrame),
});
export type TAnalyzePitchRes = Static<typeof AnalyzePitchRes>;

export const ScoreSegment = Type.Object({
  start: Type.Number(),
  end: Type.Number(),
  score: Type.Number({ minimum: 0, maximum: 100 }),
  note: Type.Optional(Type.String()),
});
export type TScoreSegment = Static<typeof ScoreSegment>;

export const ScoreReq = Type.Object({
  reference: Type.Array(PitchFrame),
  actual: Type.Array(PitchFrame),
  tuningA4: Type.Optional(Type.Number({ default: 440 })),
  smoothMs: Type.Optional(Type.Number({ default: 80 })),
  tolCents: Type.Optional(Type.Number({ default: 50 })),
});
export type TScoreReq = Static<typeof ScoreReq>;

export const ScoreRes = Type.Object({
  total: Type.Number({ minimum: 0, maximum: 100 }),
  segments: Type.Array(ScoreSegment),
});
export type TScoreRes = Static<typeof ScoreRes>;
```

**Fastify 路由（示意）**
```ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { AnalyzePitchReq, AnalyzePitchRes, ScoreReq, ScoreRes, type TAnalyzePitchRes, type TScoreRes } from "packages/shared/schemas";

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
await app.register(cors, { origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" });
await app.register(websocket);
await app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } });

app.get("/health", async () => ({ ok: true as const }));

app.post("/api/upload", async (req, reply) => {
  const parts = req.parts();
  for await (const part of parts) {
    if (part.type === "file") {
      // TODO: 保存暫存並回傳 fileId、duration、sampleRate
    }
  }
  return reply.send({ fileId: "temp", duration: 0, sampleRate: 44100 });
});

app.post("/api/analyze/pitch", { schema: { body: AnalyzePitchReq, response: { 200: AnalyzePitchRes } } }, async (req): Promise<TAnalyzePitchRes> => {
  const { sampleRate, frames } = req.body;
  void sampleRate; void frames;
  // TODO: 使用 pitchfinder（YIN/MPM）計算 contour
  return { contour: [] };
});

app.post("/api/score", { schema: { body: ScoreReq, response: { 200: ScoreRes } } }, async (req): Promise<TScoreRes> => {
  const { reference, actual, tolCents } = req.body;
  void reference; void actual; void tolCents;
  // TODO: 呼叫 score 函式回傳 total 與 segments
  return { total: 0, segments: [] };
});

app.get("/realtime", { websocket: true }, (conn) => {
  conn.socket.on("message", (msg) => { conn.socket.send(`pong: ${String(msg)}`); });
});

await app.listen({ port: Number(process.env.PORT ?? 4000), host: "0.0.0.0" });
```

---

## 2) 評分演算法（MVP）
**步驟**
1. **延遲估測**：對 `reference.f0` 與 `actual.f0` 取可用幀（`f0>0`），在 ±500ms 範圍做互相關找最大峰值，得到 `offsetMs`。
2. **對齊與取樣**：時間網格步長 `Δt = 0.02s`（20ms），雙曲線以線性內插對齊網格。
3. **誤差（cents）**：`Δc = 1200 * log2(f_user / f_ref)`；若任一幀 `f0=0` 則忽略。
4. **逐幀分數**：`s = max(0, 1 - |Δc| / τ) * 100`，`τ` 預設 50 cents。
5. **平滑**：中值或均值濾波（視 `smoothMs`）。
6. **分段**：每 2 秒彙總為 segment，給出偏高/偏低註記（簽名：`note?: "稍高" | "稍低" | "穩定"`）。

**型別化函式骨架**
```ts
export interface GridPoint { t: number; fRef: number; fUser: number; }
export interface SegmentScore { start: number; end: number; score: number; note?: string; }

export function estimateOffsetMs(ref: readonly TPitchFrame[], user: readonly TPitchFrame[], searchMs = 500): number {
  // TODO: 互相關求最大峰值，回傳 offset（user 相對 ref）
  return 0;
}

export function resampleToGrid(ref: readonly TPitchFrame[], user: readonly TPitchFrame[], offsetMs: number, dt = 0.02): readonly GridPoint[] {
  // TODO: 套用 offset，線性內插到固定網格
  return [];
}

export function scoreGrid(grid: readonly GridPoint[], tolCents = 50, segSec = 2): { total: number; segments: readonly SegmentScore[] } {
  // TODO: 逐幀轉 cents → 算分 → 分段彙總
  return { total: 0, segments: [] };
}
```

---

## 3) Web 流程與狀態
- **路由**：
  - `/`：上傳 MP3（或選擇範例），生成/載入 reference contour。
  - `/sing`：麥克風即時曲線、延遲校正（自動 + 滑桿微調）。
  - `/result/[id]`：總分、分段分數、點段回放。
- **組件建議**：`PitchPlot`、`MicInput`、`LatencyCalibrator`、`ScorePanel`、`UploadWidget`。
- **狀態（Zustand）**：
```ts
import { create } from "zustand";
export interface SoloKeyState {
  fileId?: string;
  offsetMs: number;
  reference: readonly TPitchFrame[];
  actual: readonly TPitchFrame[];
  setOffset: (v: number) => void;
  setReference: (v: readonly TPitchFrame[]) => void;
  setActual: (v: readonly TPitchFrame[]) => void;
}
export const useSoloKeyStore = create<SoloKeyState>((set) => ({
  offsetMs: 0,
  reference: [],
  actual: [],
  setOffset: (v) => set({ offsetMs: v }),
  setReference: (v) => set({ reference: v }),
  setActual: (v) => set({ actual: v }),
}));
```

---

## 4) 技術堆疊與套件決策（MVP 建議）
- **音訊/分析**：前後端皆用 `pitchfinder`（YIN/MPM）；需要特徵時再加 `meyda`。
- **狀態**：`zustand`；
- **UI**：Tailwind CSS 4 + Radix Primitives（或 shadcn/ui）。
- **後端**：`fastify`、`@fastify/cors`、`@fastify/websocket`、`@fastify/multipart`、`@fastify/type-provider-typebox`、`@sinclair/typebox`。
- **上傳/解碼（後端）**：`ffmpeg-static`（離線解碼 MP3 至 PCM 再跑偵測）。

---

## 5) 設計資源/素材與 Specify CLI（Design Tokens）
- **.specifyrc.json**（根目錄）：
```json
{
  "version": "2",
  "repository": "@<workspace>/<repository>",
  "personalAccessToken": "<建議以環境變數 SPECIFY_PAT 注入>",
  "rules": [
    {
      "name": "Generate CSS variables",
      "parsers": [
        {
          "name": "to-css-custom-properties",
          "output": { "type": "file", "filePath": "apps/web/src/styles/tokens.css" }
        }
      ]
    }
  ]
}
```
- `apps/web/src/app/globals.css` 開頭匯入：`@import "../styles/tokens.css";`
- Tailwind CSS 4 `theme.extend.colors/spacing/fontFamily` 以 CSS 變數對應品牌主題。
- 提供 SVG Logo（正片/反白），favicon 與字體授權（建議思源黑體）。

---

## 6) 測試資料（最低門檻）
- `apps/web/public/samples/`：
  - `demo.mp3`（10–20 秒）
  - `demo.reference.json`（`TPitchFrame[]`）
- 單元測試（vitest）：
```ts
import { describe, it, expect } from "vitest";
import { scoreGrid } from "../../apps/server/src/score";

describe("scoreGrid", () => {
  it("returns 0 when all frames are invalid", () => {
    const out = scoreGrid([], 50, 2);
    expect(out.total).toBe(0);
    expect(out.segments).toHaveLength(0);
  });
});
```

---

## 7) 部署/DevOps（概要）
- **GitLab CI 階段**：install → lint → typecheck → test → build（web/server）→ docker build/push → deploy。
- **Docker**：
  - server：Node LTS 多階段，`PORT=4000`；限制檔案大小。
  - web：Next.js 16 `output: "standalone"`，Nginx 或 Node 服務；環境變數以 `ARG/ENV` 注入。
- **反向代理**：同源部署（`/api/*` → 4000）以免 CORS。

---

## 8) 與 Spec‑Kit / Codex 整合（SDD）
- 初始化（PowerShell）：
```
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai codex --script ps
```
- 快速開跑：
```
/speckit.plan 本專案採 Next.js 16 + React 19 + TS 5 + Tailwind CSS 4；後端 Fastify。先完成：/api/analyze/pitch、/api/score、/realtime；前端 /sing 延遲校正、/result/[id] 分段回放。嚴禁 any、ESLint 0 錯誤。
/speckit.tasks
/speckit.implement
```

---

## 9) 給 Codex 的常用 Prompt（繁體中文）
**A. 建立 `/api/score`（Fastify，型別嚴格）**
```
Goal: 在 apps/server 新增 /api/score 路由，使用 packages/shared/schemas.ts 的 ScoreReq/Res；禁止 any；ESLint 0 錯誤。
Scope: 僅改 apps/server/src/index.ts 與 score 計分函式。
Constraints: 使用 TypeBoxTypeProvider；實作延遲估測 + 逐幀 cents 算分 + 2 秒分段彙總。
```
**B. 產生 `LatencyCalibrator`（/sing 用）**
```
Goal: 新增 web/src/components/LatencyCalibrator.tsx（client component），輸出 offsetMs，並提供自動估測 + 手動微調 UI。
Constraints: 嚴格 TS，無 any；hook 規則正確；通過 ESLint/TypeCheck。
```
**C. 結果頁 `/result/[id]` 的 ScorePanel + ResultTable**
```
Goal: 呈現 total 與 segments，支援點段回放。
Constraints: 型別以 ScoreRes；client component；零 any；ESLint 0。
```

---

## 10) 附錄：常數/約定
- `Δt`（取樣步長）預設 20ms。
- `tolCents` 預設 50。
- 分段長度 2 秒；`note` 值：`"稍高" | "稍低" | "穩定"`。
- `A4` 參考 440Hz（可調）。

> **注意**：所有程式碼禁止 `any`，違規時請直接修正型別或以 `unknown` + 型別守衛處理；禁止以 ESLint 註解略過規則。
