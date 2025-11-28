# 實作計畫：SoloKey v1 – 單人練唱、分享與對唱

**分支**：`001-v1-product-spec`｜**日期**：2025-11-27 ｜**規格**：[spec.md](./spec.md)  
**輸入**：SoloKey v1 最新產品規格（P1 單人練唱、P2 分享共賞、P3 雙人對唱、P4 歷史記錄）

## 摘要

-   **V1 必做 (MVP)**：P1 單人練唱 + P4 歷史記錄，完成上傳 → 練唱 → 結果 → 歷史的閉環體驗。
-   **V1 視時程**：P2 分享與共賞，可在 P1/P4 穩定後插入。
-   **後續版本**：P3 雙人對唱，需要更高同步與延遲控制，優先在 v1 後落地。

本計畫依憲法維持 monorepo 結構（`apps/web`, `apps/server`, `packages/shared`），在各階段明列前端、後端、音訊處理、資料模型與測試任務，並標示「V1 必做」與「後續版本」。

## 技術背景

-   **語言／版本**：TypeScript 5、Next.js 16（App Router）、Node.js 20 LTS
-   **主要依賴**：Fastify + @fastify/websocket、Drizzle ORM、@sinclair/typebox、pitchfinder/YIN、Zustand、Tailwind CSS 4
-   **儲存**：SQLite + Drizzle ORM；以 TypeScript schema 定義資料表（建議放在 `packages/shared/db/schema.ts`），由 `apps/server` 建立連線與 migration；`packages/shared` 提供共用型別與音訊演算法
-   **測試框架**：Vitest（unit/integration）、Playwright（E2E）、pnpm workspace scripts
-   **目標平台**：桌機瀏覽器（Chrome/Edge/Safari）與 Node.js 服務
-   **效能指標**：即時曲線延遲 <0.3s；分享觀眾前 50 人 2s 內見到更新；歷史列表 20 筆 <2s 載完
-   **限制條件**：禁止阻塞主執行緒、不可引入其它前端框架/CSS 系統、API 只傳 JSON、嚴禁 `any`
-   **規模／範圍**：P1/P4 為 MVP；P2 視資源；P3 後續版本

## 憲法檢查（Phase 0 必填）

| 檢查項目   | 說明                                                                  |
| ---------- | --------------------------------------------------------------------- |
| 正體中文   | 規格、計畫與衍生文件全部使用正體中文。                                |
| MVP 切片   | P1/P4 為 v1 必做；P2/P3 為獨立可測的後續增量。                        |
| 前端邊界   | 僅使用 Next.js 16 + React 19 + TS5 + Tailwind4，程式位於 `apps/web`。 |
| 後端邊界   | Node.js 20 LTS + Fastify，API 僅輸出 JSON，位於 `apps/server`。       |
| 型別與品質 | 嚴禁 `any`；交付前需跑 `pnpm lint && pnpm typecheck && pnpm test`。   |

無違規項；若需例外將更新本區與「複雜度追蹤」。

## 專案結構

```text
specs/001-v1-product-spec/
├── plan.md          # 本檔案
├── research.md      # Phase 0 決策
├── data-model.md    # Phase 1 資料模型
├── quickstart.md    # Phase 1 整合測試指引
├── contracts/       # Phase 1 API 定義
└── tasks.md         # /speckit.tasks 產出
```

原始碼沿用：`apps/web` (前端)、`apps/server` (後端)、`packages/shared` (型別/音訊)、`tests/*` (unit/integration/e2e)。

## Phase 0 – 研究 (已完成 / 持續維護)

| 子系統   | 重點                                                        | V1                 |
| -------- | ----------------------------------------------------------- | ------------------ |
| 音訊處理 | pitchfinder YIN、延遲校正策略、WebSocket 更新               | ✅                 |
| 資料模型 | PracticeSession/ScoreReport/HistoryEntry/ShareLink/DuetRoom | ✅ (Duet 標示後續) |
| 後端     | Fastify + SQLite + TypeBox schema                           | ✅                 |
| 前端     | Next.js 16、Zustand store、曲線繪製策略                     | ✅                 |
| 測試     | Vitest + Playwright pipeline                                | ✅                 |

若新增未知議題，需更新 research.md 後再推進 Phase 1。

## Phase 1 – 設計與契約交付

| 成品                     | 子系統                                                | V1             |
| ------------------------ | ----------------------------------------------------- | -------------- |
| `data-model.md`          | 定義所有實體，標註 P3 專用欄位                        | ✅             |
| `contracts/openapi.yaml` | Upload/Score/History/Share API；Duet 用 `TODO` 標示   | ✅ (Duet 後續) |
| `quickstart.md`          | 說明如何啟動、練唱、跑測試 (P1+P4)                    | ✅             |
| Agent Context            | `.specify/scripts/bash/update-agent-context.sh codex` | ✅             |

## Phase 2 – 實作規劃

### 共用基礎 (所有階段)

| 子系統    | 任務                                                                                                                       | V1          |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 資料模型  | 使用 Drizzle 定義 SQLite schema + migration（PracticeSession、ScoreReport、HistoryEntry，並預留 ShareLink／DuetRoom 欄位） | ✅          |
| 共用程式  | `packages/shared`：Pitch/Score 工具、型別、事件 payload                                                                    | ✅          |
| 後端基礎  | Fastify plugin（storage、TypeBox 驗證、WebSocket gateway）                                                                 | ✅          |
| 前端基礎  | Zustand store、全域樣式、錯誤處理、Web Worker scaffold                                                                     | ✅          |
| 測試      | Vitest config、Playwright 基礎腳本                                                                                         | ✅          |
| Duet 預留 | DuetRoom/AudiencePresence schema + API placeholder                                                                         | ⏳ 後續版本 |

### P1 單人練唱（V1 MUST）

| 子系統   | 主要內容                                                                    |
| -------- | --------------------------------------------------------------------------- |
| 前端     | 首頁導流、上傳表單、練唱頁曲線 UI、結果頁摘要；支援暫停/重練                |
| 後端     | `/api/sessions/upload`（multipart）、分析排程、`/api/sessions/{id}/score`   |
| 音訊處理 | Node 端 pitch detection + 延遲校正；前端緩衝、Web Worker ｜                 |
| 資料模型 | PracticeSession + ScoreReport 寫入；歷史投影欄位                            |
| 測試     | shared 單元 (audio)、server integration (upload→score)、Playwright 單人流程 |

### P4 歷史記錄（V1 MUST）

| 子系統   | 主要內容                                             |
| -------- | ---------------------------------------------------- |
| 前端     | 歷史列表 + 詳細頁、回放曲線、篩選器                  |
| 後端     | `/api/history` list + detail、資料裁剪、隱私欄位處理 |
| 資料模型 | HistoryEntry 投影、分享/對唱標記欄位                 |
| 測試     | server integration (history)、Playwright 歷史瀏覽    |

### P2 分享與共賞（V1 OPTIONAL）

| 子系統    | 主要內容                                                  |
| --------- | --------------------------------------------------------- |
| 前端      | 分享面板、觀眾檢視頁（結果或即時模式）、留言/反應 UI      |
| 後端      | ShareLink API（建立/終止）、即時廣播（WebSocket channel） |
| 音訊/同步 | 即時曲線廣播、延遲監控、觀眾脫離處理                      |
| 測試      | WebSocket integration、Playwright 多視窗驗證              |
| 備註      | 若 v1 時程不足，可僅交付結果分享；即時共賞留待後續        |

### P3 雙人對唱（POST-V1）

| 子系統 | 主要內容                                             |
| ------ | ---------------------------------------------------- |
| 前端   | 對唱房建立/加入 UI、雙曲線視覺、同步狀態提示         |
| 後端   | DuetRoom API、雙向 WebSocket、重連邏輯、觀眾只讀模式 |
| 音訊   | 雙路錄音同步、合唱評分、緩衝策略                     |
| 測試   | 兩位模擬使用者的整體流程、自動化同步檢查             |
| 備註   | 在 v1 僅預留資料模型與 API 介面；實作排入後續版本    |

## 子系統里程碑

| 里程碑        | 前端                            | 後端               | 音訊處理          | 資料模型             | 測試                    |
| ------------- | ------------------------------- | ------------------ | ----------------- | -------------------- | ----------------------- |
| M0 基礎       | Next.js scaffold、Zustand store | Fastify + 基礎路由 | YIN wrapper 原型  | schema + migration   | Vitest/Playwright ready |
| M1 P1 完成    | 上傳 → 練唱 → 結果 UI           | Upload/Score API   | 實際曲線/延遲校正 | session + score 寫入 | P1 單元/整合/E2E        |
| M2 P4 完成    | 歷史列表/詳細                   | History API        | —                 | HistoryEntry 投影    | History Flow 測試       |
| M3 P2（可選） | 分享/觀眾頁                     | ShareLink + WS     | 即時廣播調校      | ShareLink 寫入       | Share Flow 測試         |
| M4 P3（後續） | 對唱 UI                         | Duet API/WS        | 雙人同步          | DuetRoom schema      | 對唱測試矩陣            |

## Implementation Notes

-   **V1 發佈條件**：M1 + M2 完成並通過所有測試。P2 若就緒可一併釋出，否則列為後續增量。
-   **測試策略**：所有 API 需 TypeBox schema + Vitest；Playwright 覆蓋 P1 單人流程與 P4 歷史瀏覽，分享與對唱在對應階段增加。
-   **效能監控**：即時曲線延遲、分享觀眾數、歷史查詢時間需在 quickstart/perf 裡給出量測方式。
-   **治理對齊**：若將來需接雲端分享/串流服務，須於 research.md 說明並確認不違反憲法。
-   **任務鏈接**：`tasks.md` 中的 T0xx~T3x 均需標註 `V1-MUST` / `POST-V1`，確保開發節奏清楚。
