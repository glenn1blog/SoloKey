---

description: "Feature 任務清單模板（正體中文）"

---

# 任務清單：[FEATURE NAME]

**輸入**：`/specs/[###-feature-name]/` 內的設計文件  
**前置**：必須完成 plan.md 與 spec.md，若 research/data-model/contracts 已生成也需引用。

**測試要求**：依憲法規範，Unit／Integration／E2E 測試為必要交付，請在對應 User Story 區塊中加入測試任務。

**組織方式**：以 User Story 為單位，確保每個故事可獨立實作與驗證。

## 格式說明：`[ID] [P?] [US?] 說明`

- `P?`：可並行的任務標註 `P`
- `US?`：所屬 User Story（例：US1、US2）
- 描述中必須寫明實際檔案路徑與目錄

## 路徑慣例

- Web：`apps/web/src/...`、`apps/server/src/...`、`packages/...`
- 測試：`apps/*/tests/{unit|integration|e2e}/...` 或專案共享路徑
- 請依實際實作更新路徑，禁止保留範例文字

---

## Phase 1：初始化（共享基礎）

**目的**：建立最小可行結構、依賴與設定。

- [ ] T001 建立/更新必要目錄與設定檔
- [ ] T002 安裝或設定所需依賴（pnpm workspace）
- [ ] T003 [P] 設定 Lint/Format/Typecheck 腳本與 CI

---

## Phase 2：基礎阻塞項

**目的**：完成所有 User Story 共享的阻塞基礎（例如資料模型、環境設定、契約）。

- [ ] T010 設計/更新資料模型或共用型別（packages/shared/...）
- [ ] T011 [P] 建立 Fastify 路由骨架與 JSON 契約
- [ ] T012 [P] 設定 Next.js 16 所需的 app/route handler 或 API proxy
- [ ] T013 建立錯誤處理、日誌與設定管理

完成本階段前不得開始任何 User Story。

---

## Phase 3：User Story 1－[標題]（Priority: P1）🎯 MVP

**目標**：[描述提供的核心價值]  
**獨立測試**：[說明如何只透過 US1 測試流程即可驗證]

### 測試

- [ ] T020 [P][US1] 單元測試：tests/unit/[檔名].test.ts
- [ ] T021 [P][US1] 整合測試：tests/integration/[檔名].test.ts
- [ ] T022 [P][US1] E2E/Playwright 測試：tests/e2e/[檔名].spec.ts

### 實作

- [ ] T023 [US1] 實作前端 UI/互動（apps/web/...）
- [ ] T024 [US1] 實作相關 API/服務（apps/server/...）
- [ ] T025 [US1] 型別/常數更新（packages/shared/...）
- [ ] T026 [US1] 驗證、錯誤與追蹤

**Checkpoint**：US1 完整可執行且測試通過後方能進入下一故事。

---

## Phase 4：User Story 2－[標題]（Priority: P2)

[同 Phase 3 結構，包含測試與實作任務]

---

## Phase 5：User Story 3－[標題]（Priority: P3)

[同 Phase 3 結構，包含測試與實作任務]

---

## Phase N：收斂與跨故事事項

- [ ] T0XX 文檔更新（README、docs/）
- [ ] T0XX 總體效能/資安檢查
- [ ] T0XX [P] 額外單元測試補強
- [ ] T0XX 執行 `pnpm lint && pnpm typecheck && pnpm test`
- [ ] T0XX 驗證 quickstart.md 操作流程

---

## 相依與執行順序

- Phase 1 → Phase 2 → 各 User Story（可平行，但不得跨越優先度要求）
- 每個 User Story 內：測試（先寫且先失敗）→ 模型/型別 → 服務 → API/UI → 驗證
- 若需例外，請於 plan.md「複雜度追蹤」列出並設定還原期限。
