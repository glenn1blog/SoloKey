<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] → I. 正體中文唯一語境
- [PRINCIPLE_2_NAME] → II. MVP 與可測試切片
- [PRINCIPLE_3_NAME] → III. Next.js 16 前端邊界
- [PRINCIPLE_4_NAME] → IV. Node.js JSON 後端
- [PRINCIPLE_5_NAME] → V. 嚴格型別與自動化防線
Added sections: 產品邊界與技術約束, 交付與品質流程
Removed sections: 無
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- README.md ✅ updated
- docs/specs/solo_key_規格與實作指南（給_codex）.md ✅ updated
- docs/process/agents_codex.md ✅ updated
Follow-up TODOs: 無
-->
# SoloKey 憲法

## 核心原則

### I. 正體中文唯一語境
- 所有程式碼註解、提交訊息、規格與文件一律使用正體中文撰寫，嚴禁混用簡體或英文敘述（專有名詞除外）。
- 不符合語系規範的內容必須於同一個變更中修正，否則視為未完成的工作項目。
- 理由：確保團隊與外部貢獻者共享相同語境，避免解讀歧異並維持知識庫一致性。

### II. MVP 與可測試切片
- 任何新功能必須先定義最小可行、可測試的 User Story，禁止一次性交付無法驗證的大型解法。
- 計畫、規格與任務文件需明列對應的測試（unit/integration/e2e），並在程式碼提交前確保自動化測試可單獨執行且失敗再綠燈。
- 理由：Karaoke/Pitch 練唱需要可逐步驗證的音訊與互動流程，唯有 MVP 切片方能快速迭代、避免 overdesign。

### III. Next.js 16 前端邊界
- 前端唯一技術棧為 Next.js 16（App Router）+ React 19 + TypeScript 5 + Tailwind CSS 4，搭配 Zustand 等既定依賴。
- 禁止引入其他前端框架或 CSS 系統；若需新工具，須證明無法以現有技術達成並經憲法修正。
- 理由：維持單一技術棧以降低協作複雜度，確保 Pitch 練唱體驗與 UI 能在相同基礎上持續優化。

### IV. Node.js JSON 後端
- 後端必須使用 Node.js 20 LTS，優先採 Fastify（可在明確理由下改用 Express），所有 API 僅接受與輸出 JSON。
- 需支援即時練唱所需的 WebSocket/串流方案，並以 @sinclair/typebox 等工具明確定義契約；衝突的舊碼得以刪除或重寫。
- 理由：統一的 Node.js JSON API 使前後端契合、便於音訊分析（pitchfinder 或自研 YIN/MPM）模組測試與部署。

### V. 嚴格型別與自動化防線
- 嚴禁使用 `any`；若需暫時放寬，必須以 `unknown`、型別守衛或具名介面處理，並維持 `tsconfig` `strict` 模式。
- 單元、整合與端對端測試層層到位，並強制通過 `pnpm lint && pnpm typecheck && pnpm test` 與 formatter（例如 Biome/Prettier）。
- 理由：Pitch 演算法與即時互動對正確性要求高，透過嚴格型別與自動化測試可防止回歸，確保存取舊碼時快速重建信任。

## 產品邊界與技術約束
- SoloKey 聚焦 Karaoke/Pitch 練唱：上傳 MP3、顯示標準音準曲線、麥克風比對、即時評分與回放分析。
- 儲存結構維持 pnpm monorepo：`apps/web`、`apps/server`、`packages/*` 用於共享型別與音訊工具，禁止任意新增高層目錄。
- Pitch 偵測可使用 pitchfinder 或自研 YIN/MPM 實作，任何第三方模型需具備可再現的測試資料與效能報告。
- 安全與效能：所有音訊處理在可控的 Node.js/瀏覽器工作執行緒，避免阻塞 UI；需提供結構化日誌與錯誤追蹤鉤子。
- 過時或衝突的 SoloKey v0 程式碼，若違反本節任一條件，得直接移除並以新實作取代。

## 交付與品質流程
- 規格（spec）、計畫（plan）與任務（tasks）文件必須於 Phase 0/1 即列出 MVP 切片、測試策略與必要的資料/契約檔。
- 每個 User Story 需對應至少一項自動化測試，並描述如何透過 `pnpm test` 的單獨套件或指令驗證。
- Lint、Format、Typecheck 與 Test 屬於同一品質柵欄；任一失敗不得合併，並需在 PR 描述列出執行結果。
- 若需技術債或暫時豁免，必須在 plan.md「Complexity Tracking」中紀錄理由與到期日，並開立追蹤任務。

## 治理
- 本憲法優先於既有程式碼與舊版流程；任何衝突以本文件為準，必要時可刪除或重寫舊實作。
- 修憲流程：提出議案（含動機、影響、遷移計畫）→ 與核心維護者評估 → 一旦通過即更新版本與生效日期，並同步模板/README。
- 版本規則：重大原則變更為 MAJOR，新增或實質擴充條目為 MINOR，文字澄清為 PATCH。所有變動需記錄在 Sync Impact Report。
- 合規檢查：PR 審查者需逐項比對核心原則、技術約束與品質流程；發現違規須要求修正或拒絕合併。

**Version**: 1.0.0 | **Ratified**: 2025-11-27 | **Last Amended**: 2025-11-27
