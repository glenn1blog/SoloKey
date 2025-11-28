# AGENTS.codex.md — Codex 專用全域流程規範（SoloKey 版）

> 目的：讓 **Codex CLI / VS Code 外掛** 在 SoloKey 專案遵循一致、可審核、最小變更（Minimal Diff）的開發流程；強制 **TypeScript 嚴格型別（禁止 `any`）**、**ESLint 規範**、**6A Gate** 與 **原子變更（Atoms）**。
>
> **專案簡述：** SoloKey — 個人音準室。**Next.js 16（App Router）+ React 19 + TypeScript 5 + Tailwind CSS 4** 為前端；**Node.js 20 LTS + Fastify（建議）** 為後端；採 **pnpm monorepo**（`apps/web`、`apps/server`、`packages/shared`）。核心功能：上傳 MP3、產生目標音準曲線、麥克風即時比對、延遲校正、自動評分與結果回放。
>
> 前端 UI / UX 風格請搭配 `solo_key_ui_style_guide.md` 參考，確保畫面一致。

---

## 0) 放置與合併（Codex 專用）

- **全域檔（個人層）**：`~/.codex/AGENTS.md`。
- **專案檔（團隊層）**：`<repo-root>/AGENTS.md` 可覆寫或補充本檔。
- **子資料夾檔（模組層）**：`<subdir>/AGENTS.md` 可做更細緻規範。
- **優先序**：子資料夾 > 專案 > 全域；近者覆蓋遠者。
- 建議：在各 repo root 建立 symlink 指向全域檔；若需專案特化，再於專案檔只寫差異段。

---

## 1) 全域準則（TypeScript / React / Next.js / Fastify）

- **TypeScript 嚴格模式**：
  - 禁用 `any`（包含函式參數、回傳值、props、state、context、hook 回傳）。
  - 不確定型別時，使用 `unknown` + 型別守衛，或明確 `interface` / `type` / 泛型。
  - API/DTO 一律使用 Schema 驗證工具產生執行期驗證與編譯期型別（建議 **TypeBox + Ajv**，Fastify 搭配 `TypeBoxTypeProvider`）。

- **ESLint / Prettier**：
  - 以專案 ESLint 規則為準，**`pnpm lint` 必須 0 error**；避免以註解繞過規則。
  - 格式化變更請與功能分離（Minimal Diff）。

- **Next.js / React**（前端 `apps/web`）：
  - 需在瀏覽器端執行的檔案一律加 `"use client"`。
  - Hooks 使用遵守 React 規則，禁止在條件中呼叫。
  - Canvas/音訊處理盡量搬入 **Web Worker / Audio Worklet**；UI 僅做繪製與控制。

- **Fastify**（後端 `apps/server`）：
  - 路由 Schema 一律以 TypeBox 宣告並導出 `Static<...>` 型別給前端共用（`packages/shared`）。
  - 啟用 CORS、限制檔案大小、集中錯誤處理與日誌。

- **Minimal Diff 原則**：
  - 僅修改達成需求「必需」的區域與檔案；不做與需求無關的大搬動/改名。

- **語言（重要）**：
  - **所有 Codex 回覆、PR 描述、產生的說明文字預設使用「繁體中文」**，必要時可附最短英文備註。

---

## 2) 6A Gate（強制通關）

1. **Align（對齊）**：明確 Goal / Non-goals / Scope / Out-of-scope。
2. **Assess（盤點）**：風險、相依模組、受影響檔案、回退策略。
3. **Approach（方案）**：Strategy Brief；以小步驟原子化（Atoms）。
4. **Approve（核准）**：自審或人工核可後才實作。
5. **Apply（實作）**：逐顆 Atom 實施，每步皆可單獨驗證。
6. **Audit（稽核）**：彙總變更、測試結果、已知風險與驗收情境。

---

## 3) Codex 原子變更規範（Atoms）

### 3.1 進場護欄

1. **一律先 read_file**：修改前必須 `read_file(file_path)` 抓「最新」內容。
2. **鎖定範圍（scope / anchors）**：
   - `scope_anchor`（函式/元件/區塊錨點），如：`function handleUpload(`、`export default function SingPage(`。
   - `start_anchor` / `end_anchor`：實際替換區塊上下邊界。
   - `expected_max_changed_lines`：單一 Atom 最大行數（建議 ≤ 150，超過請拆）。
3. **唯一命中檢查**：待替換 `old_string` 在 `scope_anchor` 內**僅能命中一次**；0 次或多次皆中止並回報。
4. **Dry-run Diff**：記憶體模擬、輸出 diff 摘要，檢查未越界且總變更行數在上限內。
5. **正式替換與二次驗證**：`replace` 落盤後再次 `read_file` 校對與 Dry-run 一致。
6. **（選用）內容雜湊保護**：比對 `before_hash`，避免覆寫他人更新。

### 3.2 正則與跨區域保護

- 避免過度寬鬆的 `([\s\S])*`；需大範圍正則時務必搭配明確起訖 anchor。
- 優先非貪婪量詞與清楚邊界（`^`/`$` 或穩定上下文）。

### 3.3 執行與驗證

- 僅更動 Atom 規劃內的檔案/區域。
- 每個 Atom 完成後至少：
  - TypeScript：無錯誤、**無 `any`**。
  - ESLint：無錯誤。
  - 功能驗證：符合該 Atom 的「Done When」。

---

## 4) 流程分級

- **全面模式（Comprehensive）**：大型重構/關鍵功能，完整 Strategy Brief + 多顆 Atom，逐步驗證。
- **標準模式（Standard）**：一般功能/Bugfix 可簡化文件，但 **Atom 規範**為硬性要求。

---

## 5) 模板（交付用）

### 5.1 Strategy Brief（設計階段）

```text
### Strategy Brief
- Goal: <單句描述要達成的具體目標>
- Non-goals: <刻意不做的項目>
- Scope & Impact: <受影響的模組/頁面/型別/API/DB（如有）>
- Approach:
  1) <方案步驟>
  2) <原子化切分原則>
- Alternatives Considered: <至少 1 個備選 + 放棄理由>
- Risks / Guard Rails: <已知風險 + 防呆/回退策略>
- Testing & Verification:
  - TypeScript: no `any`
  - ESLint: no errors
  - Build: `pnpm build` 無錯誤
- Acceptance Criteria:
  - <可驗收條件>
```

### 5.2 Change Intent（Atom 級）

```text
### Change Intent (Atom)
- id: <短代號>
- title: <這一步要完成什麼>
- file_path: <目標檔案（可多個）>
- scope_anchor: <函式/元件/區塊錨點>
- start_anchor / end_anchor: <替換區塊邊界>
- old_string_summary: <欲替換舊片段摘要>
- expected_max_changed_lines: <最大行數上限（預設 150）>
- tests/checks:
  - TS 型別：無 Error、**無 `any`**
  - ESLint：無 Error
  - 功能/回傳值關鍵驗證：<要點>
- plan:
  1) <子步驟 1>
  2) <子步驟 2>
- Done When:
  - <可驗收條件>
```

---

## 6) Commit / MR 規範

- **Commit 前綴建議**：
  - `feat:` 新功能
  - `fix:` 錯誤修復
  - `refactor:` 重構（無行為變更）
  - `update:` 小幅調整 / UI 細節
- **MR 檢核清單**：
  - [ ] 僅變更必要檔案與區域（Minimal Diff）
  - [ ] `pnpm build` 無 Error
  - [ ] `pnpm lint` 無 Error
  - [ ] 單元測試通過（如有）
  - [ ] 型別/公共介面變更已列出影響範圍、驗收與回退策略

---

## 7) 專案：SoloKey（個人音準室）— 特化規範

> 本節為 **SoloKey** 專用規範，供 Codex 產生/修改頁面與 API 時遵循。

### 7.1 項目概述

- 前端：**Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4**（App Router）。
- 後端：**Node.js + Fastify**（建議；Express 亦可，但新碼優先 Fastify）。
- 專案結構：`apps/web`、`apps/server`、`packages/shared`（共用型別/常數/工具）。

### 7.2 前端路由與頁面

- `/`：入口與 MP3 上傳（顯示基本說明與最近練習清單）。
- `/sing`：練唱頁
  - 功能：麥克風啟用、即時音準曲線繪製、**延遲校正（手動/自動）**、基本控制（播放/暫停/重置）。
- `/result/[id]`：結果頁
  - 功能：顯示 **總分**、**分段分數**、偵錯片段回放、偏高/偏低提示。

> **UI 元件建議**：
> - `PitchPlot`（Canvas）：單畫布疊繪「目標 vs 使用者」曲線；支援縮放/游標對齊。
> - `MicInput`：音訊存取、頻率估測（可交由 Worker/Worklet）。
> - `LatencyCalibrator`：延遲量測與偏移校正。
> - `ScorePanel`：總分/分段分數與提示；`ResultTable`。
> - `UploadWidget`：拖放/點選上傳；顯示進度、限制副檔名與大小。

### 7.3 後端 API（Fastify）

- `POST /api/analyze/pitch`：輸入音訊前處理/分幀結果 → 回傳 `contour: PitchFrame[]`。
- `POST /api/score`：輸入 `reference, actual` 曲線 → 回傳 `{ total, segments }`。
- `POST /api/upload`：MP3 上傳（multipart），大小上限預設 50MB（可調）。
- `GET /realtime`（WebSocket）：可選；推送即時分析/進度。

**Schema（TypeBox）範例**（放在 `packages/shared/schemas.ts`，前後端共用）：

```ts
import { Type, type Static } from "@sinclair/typebox";

export const PitchFrame = Type.Object({ t: Type.Number(), f0: Type.Number() });
export type TPitchFrame = Static<typeof PitchFrame>;

export const AnalyzePitchReq = Type.Object({
  sampleRate: Type.Number(),
  frames: Type.Array(Type.Number()),
});
export type TAnalyzePitchReq = Static<typeof AnalyzePitchReq>;

export const AnalyzePitchRes = Type.Object({
  contour: Type.Array(PitchFrame),
});
export type TAnalyzePitchRes = Static<typeof AnalyzePitchRes>;

export const ScoreReq = Type.Object({
  reference: Type.Array(PitchFrame),
  actual: Type.Array(PitchFrame),
});
export type TScoreReq = Static<typeof ScoreReq>;

export const ScoreSegment = Type.Object({
  start: Type.Number(),
  end: Type.Number(),
  score: Type.Number(),
  note: Type.Optional(Type.String()),
});

export const ScoreRes = Type.Object({
  total: Type.Number(),
  segments: Type.Array(ScoreSegment),
});
export type TScoreRes = Static<typeof ScoreRes>;
```

> **要求**：後端路由必須引用上述 Schema 作為 `schema.body/response`，並導出 `Static<T>` 型別給前端使用；**不得出現 `any`**。

### 7.4 前端資料流程

- 以 `NEXT_PUBLIC_API_BASE_URL` 指向後端；集中於 `web/src/services/api.ts` 寫型別化請求函式。
- `usePitchAnalyze`、`useScoring` Hooks：接上端點並回傳嚴格型別資料。
- 畫布繪圖以單一 `requestAnimationFrame` 管理；避免多重重繪。

### 7.5 測試與驗收（DoD）

- **型別**：`pnpm typecheck` 無錯誤、**無 `any`**。
- **Lint**：`pnpm lint` 無錯誤。
- **功能自測**：
  - 上傳 MP3 → 顯示目標曲線。
  - 麥克風即時曲線可疊繪、可暫停恢復。
  - `/sing` 可執行延遲校正；`/result/[id]` 呈現總分與分段資訊。
- **最小範例資料**：提供 5–10 秒 `TPitchFrame[]` JSON 與 1 首 MP3 測試檔（存於 `apps/web/public/samples/`）。

### 7.6 安全與隱私

- 僅在本機瀏覽器存取麥克風；不長期保存原始音訊（或以使用者操作為準）。
- 上傳限制副檔名與大小；明確回應錯誤碼與訊息（繁中）。

### 7.7 效能指引

- 重計算放 Worker/Worklet；UI 僅繪圖。
- 畫布每幀最多兩次繪製；資料點數過大時做抽樣/平滑處理。

---

## 8) 給 Codex 的標準 Prompt（繁體中文）

> 以下模板可直接在 Codex CLI 使用；請依實際檔案路徑調整。

### 8.1 產生 `/api/analyze/pitch` 後端路由（Fastify）

```
Goal: 在 apps/server 新增 /api/analyze/pitch 路由，使用 TypeBox Schema 並輸出嚴格型別，禁止 any。
Scope: 僅修改 apps/server/src/index.ts 與必要的共用 schema（packages/shared/schemas.ts）。
Non-goals: 不引入新框架；不變更既有路由。
Constraints:
- 使用 @fastify/type-provider-typebox；導入 AnalyzePitchReq/Res。
- schema + handler 皆以 TypeScript 嚴格型別撰寫。
- ESLint 不得有錯誤。
```

### 8.2 產生 `/sing` 頁面的延遲校正 UI 元件

```
Goal: 在 apps/web 建立 LatencyCalibrator（client component），提供手動/自動校正，並以 props 回傳 offset（毫秒）。
Scope: 新增 web/src/components/LatencyCalibrator.tsx 與必要 hooks。
Constraints:
- 嚴格型別；不得 any；避免在條件中呼叫 hooks。
- 畫布/音訊處理若重，請建立 Worker；UI 僅控制與顯示。
- 通過 ESLint / TypeCheck。
```

### 8.3 產生結果頁 `/result/[id]` 的表格與回放控制

```
Goal: 完成結果頁 ScorePanel 與 ResultTable，呈現總分與分段分數，支援點選分段回放。
Scope: 僅修改 web/src/app/result/[id]/page.tsx 與相依 components。
Constraints:
- 型別以 packages/shared/schemas.ts 的 ScoreRes 為準。
- UI 為 client component；無 any；ESLint 0 錯誤。
```

---

## 9) 術語與約定

- **PitchFrame**：`{ t: number; f0: number }`，時間（秒）與基頻（Hz）。
- **Contour**：`PitchFrame[]`，音準曲線。
- **Latency**：裝置/處理延遲（毫秒），會影響曲線對齊；需校正。

---

> 本檔為 SoloKey 專案的 Codex 作業規範；若需要擴充（例如：E2E 測試、i18n 多語、雲端儲存策略），請於專案根新增 `AGENTS.local.md` 僅記差異，並以「子層覆蓋上層」原則合併。



---

## 追加：Codex 常用指令速查（繁體中文）

> 下列皆為 **可直接貼給 Codex** 的最小模板；請依實際檔案路徑調整。預設回覆語言：繁體中文。

### 讀取並摘要檔案
```
Goal: 讀取並用重點條列摘要下列檔案，列出匯出介面/主要函式與相依。
Files:
- apps/web/src/app/sing/page.tsx
- apps/server/src/index.ts
Constraints:
- 僅摘要，不改動檔案。
- 回覆使用繁體中文。
```

### 以錨點（anchors）修改區塊（Atom）
```
Change Intent (Atom)
- id: pitch-api-response-typing
- file_path: apps/server/src/index.ts
- scope_anchor: app.post("/api/analyze/pitch",
- start_anchor: schema: { body:
- end_anchor: ),
- old_string_summary: 缺少 TypeBox schema 的 response。
- expected_max_changed_lines: 60
- plan:
  1) 在該路由加入 AnalyzePitchRes schema 並應用 TypeBoxTypeProvider。
  2) 確保回傳型別為 TAnalyzePitchRes。
- Done When: tsc/ESLint 0 錯誤；以 curl 可拿到 contour。
Constraints:
- 不得使用 any；不更動其他路由。
```

### 新增檔案（並標註輸出路徑）
```
Goal: 建立共用型別檔，供前後端共用。
Output File: packages/shared/schemas.ts
Constraints:
- 使用 @sinclair/typebox；導出 Static 型別。
- 禁用 any；通過 ESLint/TypeCheck。
Deliverables:
- 完整檔案內容（單一程式碼區塊）。
```

### 調整 package.json 腳本（Minimal Diff）
```
Goal: 在 apps/server/package.json 新增腳本，不影響既有項目。
Change:
- scripts.dev = "tsx watch src/index.ts"
- scripts.typecheck = "tsc --noEmit"
Constraints:
- 僅修改 scripts 欄位；維持 JSON 排序穩定。
```

### 產出測試樣板
```
Goal: 為 packages/shared/schemas.ts 產出最小型單元測試。
Output File: packages/shared/__tests__/schemas.spec.ts
Constraints:
- 使用 vitest；測試 PitchFrame、ScoreRes 的基本驗證（型別/範圍）。
- 無 any；ESLint 0 錯誤。
```

---

## 追加：`packages/shared/schemas.ts` 初始骨架

> 放置於 **`packages/shared/schemas.ts`**（前後端共用）。採 **TypeBox** 產出執行期 schema 與編譯期型別，禁止 `any`。

```ts
// packages/shared/schemas.ts
import { Type, type Static } from "@sinclair/typebox";

/** 單一音準點：時間（秒）與基頻（Hz） */
export const PitchFrame = Type.Object({
  t: Type.Number({ description: "時間（秒）" }),
  f0: Type.Number({ description: "基頻（Hz）；偵測不到可為 0" }),
});
export type TPitchFrame = Static<typeof PitchFrame>;

/** 音準分析請求：可依你的前處理調整 frames 的意義 */
export const AnalyzePitchReq = Type.Object({
  sampleRate: Type.Number({ minimum: 8000 }),
  frames: Type.Array(Type.Number()),
});
export type TAnalyzePitchReq = Static<typeof AnalyzePitchReq>;

/** 音準分析回應：回傳音準曲線 */
export const AnalyzePitchRes = Type.Object({
  contour: Type.Array(PitchFrame),
});
export type TAnalyzePitchRes = Static<typeof AnalyzePitchRes>;

/** 分段評分項目 */
export const ScoreSegment = Type.Object({
  start: Type.Number(),
  end: Type.Number(),
  score: Type.Number({ minimum: 0, maximum: 100 }),
  note: Type.Optional(Type.String()),
});
export type TScoreSegment = Static<typeof ScoreSegment>;

/** 評分請求：目標曲線 vs 使用者曲線 */
export const ScoreReq = Type.Object({
  reference: Type.Array(PitchFrame),
  actual: Type.Array(PitchFrame),
});
export type TScoreReq = Static<typeof ScoreReq>;

/** 評分回應：總分與分段分數 */
export const ScoreRes = Type.Object({
  total: Type.Number({ minimum: 0, maximum: 100 }),
  segments: Type.Array(ScoreSegment),
});
export type TScoreRes = Static<typeof ScoreRes>;
```

**整合指引（伺服器）**
- 在 `apps/server/src/index.ts` 以 `TypeBoxTypeProvider` 啟動 Fastify，並 `import { AnalyzePitchReq, AnalyzePitchRes, ScoreReq, ScoreRes } from "packages/shared/schemas"`。
- 路由宣告中掛上 `schema: { body: AnalyzePitchReq, response: { 200: AnalyzePitchRes } }` 等，handler 回傳型別對應 `Static<typeof ...>`。

**整合指引（前端）**
- 在 `apps/web/src/services/api.ts` 以 `TAnalyzePitchReq/TAnalyzePitchRes/TScoreReq/TScoreRes` 型別化 fetch 函式。
- Hooks `usePitchAnalyze`、`useScoring` 直接引用上述型別，避免 `any`。
