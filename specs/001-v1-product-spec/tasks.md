---
description: "Feature 任務清單模板（正體中文）"
---

# 任務清單：SoloKey v1 – 單人練唱、分享與對唱

**輸入**：`/specs/001-v1-product-spec/` 內的設計文件  
**前置**：plan.md、spec.md 完成；research/data-model/contracts/quickstart 可引用。

**測試要求**：依憲法規範，Unit／Integration／E2E 測試為必要交付；各 User Story 區塊皆需列出測試任務。

**組織方式**：以 User Story 為單位。V1 先完成 P1 + P4；P2/P3 標記為「可延伸／後續版本」。

## 格式說明：`- [ ] T### [P?] [US?] 描述 (含檔案路徑)`

-   `P?`：可並行的任務才加 `[P]`
-   `US?`：User Story（例：US1、US4）
-   描述需點出實際路徑，例如 `apps/web/app/page.tsx`

## Phase 1：初始化（共享基礎，V1 必做）

-   [ ] T001 更新 `package.json`、`pnpm-workspace.yaml` 腳本以確保 `lint/typecheck/test` 串接 apps/server、apps/web、packages/shared。
-   [ ] T002 調整 `apps/server/.env.example`、`apps/web/.env.local.example` 並同步 `docs/quickstart.md` 說明 SQLite、WebSocket、API base 等新變數。
-   [ ] T003 [P] 建立/更新 `tests/README.md`（或 CI 檔）描述 Vitest/Playwright 執行方式與品質門檻。

## Phase 2：共用基礎（V1 必做）

-   [ ] T004 在 `packages/shared/db/schema.ts` 使用 Drizzle 定義 SQLite schema（`practice_session`、`pitch_contour`、`score_report`、`practice_history_entry`，並預留 `share_link`／`duet_room` 欄位），並在 `apps/server/db` 建立對應 migration 流程。
-   [ ] T005 [P] 在 `packages/shared/src/audio.ts` 實作 pitchfinder YIN 包裝與延遲校正 util，補 `packages/shared/tests/audio.spec.ts` 單元測試。
-   [ ] T006 [P] 建立 `apps/server/src/plugins/storage.ts`，封裝 Drizzle + SQLite 連線與 transaction 管理，並在 `apps/server/src/index.ts` 註冊。
-   [ ] T007 建立 `apps/server/src/routes/sessions/upload.ts` 雛型與 `apps/server/tests/integration/sessions.spec.ts` 上傳契約測試（暫不含評分）。
-   [ ] T008 建立 `apps/web/src/state/soloKeyStore.ts`（Zustand）與 `apps/web/tests/unit/soloKeyStore.test.ts`，維護練唱/歷史狀態。
-   [ ] T009 實作 `apps/server/src/realtime/gateway.ts` WebSocket 廣播層，型別放在 `packages/shared/src/events.ts`，並寫對應單元測試。

## Phase 3：User Story 1 – 單人練唱（Priority: P1，V1 MUST）

**獨立測試**：Playwright `apps/web/tests/e2e/us1-self-practice.spec.ts`，覆蓋上傳 → 練唱 → 結果。

### 測試

-   [ ] T010 [P][US1] 補強 `packages/shared/tests/audio.spec.ts`，涵蓋 pitch=0、正常案例與 ScoreReport 邏輯。
-   [ ] T011 [P][US1] 擴充 `apps/server/tests/integration/sessions.spec.ts`，驗證「上傳 → 分析 →Score」完整流程。
-   [ ] T012 [P][US1] 新增 E2E 腳本 `apps/web/tests/e2e/us1-self-practice.spec.ts`。

### 實作

-   [ ] T013 [US1] 完成 `apps/server/src/routes/sessions/upload.ts`（儲存檔案、排程分析）與對應型別 `packages/shared/src/schemas/session.ts`。
-   [ ] T014 [US1] 實作 `apps/server/src/routes/sessions/score.ts`（GET `/api/sessions/{sessionId}/score`），整合 PracticeSession、ScoreReport、PitchContour。
-   [ ] T015 [US1] 建立 `apps/web/app/page.tsx` 上傳表單與導覽，串接 `apps/web/src/services/api.ts` Upload API。
-   [ ] T016 [US1] 實作 `apps/web/app/sing/page.tsx` 曲線畫面，含暫停/重啟、音量/延遲提示。
-   [ ] T017 [US1] 建立 `apps/web/src/components/score/SummaryPanel.tsx` 呈現總分、段落結果與建議，允許重新命名紀錄。
-   [ ] T018 [US1] 建立 `apps/web/src/hooks/usePitchStreaming.ts` 處理 WebSocket 即時曲線，並補 `apps/web/tests/unit/usePitchStreaming.test.ts`。
-   [ ] T019 [US1] 擴充 `apps/server/tests/unit/score.spec.ts`（或相同檔案）確保 ScoreReport 分段計算正確。

## Phase 4：User Story 4 – 歷史記錄（Priority: P2，V1 MUST）

**獨立測試**：Playwright `apps/web/tests/e2e/us4-history.spec.ts`，驗證列表/詳細頁/回放。

### 測試

-   [ ] T020 [P][US4] 在 `apps/server/tests/integration/history.spec.ts` 寫 `/api/history` list + detail 測試。
-   [ ] T021 [P][US4] 撰寫 `apps/web/tests/e2e/us4-history.spec.ts` 覆蓋歷史列表、篩選與詳細頁。

### 實作

-   [ ] T022 [US4] 實作 `apps/server/src/routes/history/list.ts` 與 `detail.ts`，支援日期/關鍵字篩選與分享/對唱標記欄位。
-   [ ] T023 [US4] 建立 `apps/web/app/history/page.tsx`，顯示列表與篩選器。
-   [ ] T024 [US4] 建置 `apps/web/src/components/history/HistoryCard.tsx` 與 `HistoryList.tsx`，呈現分數/建議/標記。
-   [ ] T025 [US4] 建立 `apps/web/src/components/history/HistoryDetailDrawer.tsx` 回放曲線與顯示建議。
-   [ ] T026 [US4] 更新 `packages/shared/src/schemas/history.ts` 與 `apps/web/src/services/api.ts`，定義 API 型別。
-   [ ] T027 [US4] 撰寫 `apps/web/tests/unit/historyFilters.test.ts` 驗證日期/關鍵字 selector。

## Phase 5：User Story 2 – 分享與共賞（Priority: P2，可延伸）

**目標**：提供結果分享與即時共賞。完成後可視為 v1 增量。

### 測試

-   [ ] T028 [P][US2] `apps/server/tests/integration/share.spec.ts` 覆蓋 ShareLink 建立/終止與觀眾加入。
-   [ ] T029 [P][US2] `apps/web/tests/e2e/us2-share.spec.ts` 驗證主唱分享給多名觀眾的結果模式/即時模式。

### 實作

-   [ ] T030 [US2] 實作 `apps/server/src/routes/share/create.ts`、`close.ts`，寫入 ShareLink 與到期狀態。
-   [ ] T031 [US2] 建立 `apps/server/src/routes/share/live.ts` WebSocket 廣播，處理觀眾只讀事件。
-   [ ] T032 [US2] 在 `apps/web/app/result/components/SharePanel.tsx` 實作分享設定，並更新 `apps/web/src/services/api.ts`。
-   [ ] T033 [US2] 建立 `apps/web/app/share/[id]/page.tsx` 觀眾頁面（曲線、互動、結束提示）。
-   [ ] T034 [US2] 擴充 `packages/shared/src/schemas/share.ts` 與 `packages/shared/tests/share.spec.ts`（型別 + payload）。
-   [ ] T035 [US2] 在 `apps/web/tests/unit/shareStore.test.ts` 驗證觀眾端 state 與留言行為。

> 若時程不足，可先完成 T030~T033（結果分享），將即時 WebSocket（T031/T034/T035）排入後續迭代。

## Phase 6：User Story 3 – 雙人對唱（Priority: P3，後續版本）

-   [ ] T036 [US3] 實作 `apps/server/src/routes/duet/create.ts`、`join.ts`、`ws.ts`（房間代碼、重連、觀眾只讀模式）。
-   [ ] T037 [US3] 定義 `packages/shared/src/schemas/duet.ts` 與 `packages/shared/tests/duet.spec.ts`，描述房間狀態 & 事件。
-   [ ] T038 [US3] 建立 `apps/web/app/duet/create/page.tsx` 與 `apps/web/app/duet/[roomId]/page.tsx`，顯示雙曲線與同步提示。
-   [ ] T039 [US3] 實作 `apps/web/src/hooks/useDuetSync.ts` 處理雙向 WebSocket，並撰寫 `apps/web/tests/unit/useDuetSync.test.ts`。
-   [ ] T040 [US3] 新增 `apps/server/tests/integration/duet.spec.ts` 覆蓋房間建立、加入、觀眾、重連。

## Phase N：收斂與跨故事事項

-   [ ] T041 更新 `docs/quickstart.md`、`README.md`（新增分享/對唱流程與環境變數）並檢查 `docs/perf/` 指標。
-   [ ] T042 [P] 執行 `pnpm lint && pnpm typecheck && pnpm test`，整理報告附於 PR。
-   [ ] T043 [P] 在 `docs/perf/solo-key-v1.md` 記錄 pitch 延遲、分享觀眾載入、歷史查詢時間。
-   [ ] T044 重跑 `apps/web/tests/e2e/*` 驗證 P1/P4/P2 流程互不影響。
-   [ ] T045 檢查 `packages/shared`、`apps/server`、`apps/web` 是否需要重構或加註釋，必要時整理為技術債項目。

---

## Dependencies & Execution Order

-   Phase 1 → Phase 2 → US1 (P1) → US4 (P4) → （可選）US2 → （後續）US3 → Phase N。
-   P1、P4 完成即構成 v1；P2、P3 不得影響 MVP 時程。

### Parallel Opportunities

-   Phase 2 的 T005/T006/T008/T009 可由不同人員並行。
-   US1/US4 測試任務（T010~T012、T020~T021）可與實作並行。
-   當 P1 完成後，US4 與 US2 可依人力並行。
-   US3 於後續版本進行，對現行程式無阻塞。

---

## Implementation Strategy

1. **MVP**：完成 P1 + P4。所有 QA/測試以此為交付門檻。
2. **增量**：若時程允許交付 P2 分享；否則記錄於 plan，延後。
3. **後續版本**：P3 對唱作為下一版的主要功能。
4. **測試優先**：所有 API/Hook 先補 TypeBox/Vitest，再撰寫 Playwright 流程。
5. **效能監控**：於 quickstart/perf 文件記錄延遲與載入表現，作為後續優化依據。
