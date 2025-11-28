# Research — SoloKey v1 核心產品定位

## 決策 1：練唱 Session 與歷史資料儲存
- **Decision**：採用 apps/server 內部的 SQLite（透過 Prisma/Drizzle 任一型別安全 ORM）管理 PracticeSession、ScoreReport、PracticeHistoryEntry，並以 packages/shared 定義 schema 型別。
- **Rationale**：SQLite 可隨 monorepo 一起部署，支援老師/學生/歷史的查詢條件，且易於建立單元與整合測試；日後若需擴充，可無痛遷移至 Postgres。
- **Alternatives considered**：純檔案 JSON（缺乏查詢能力且併發風險高）、外部雲端 DB（對 MVP 過度設置且提高部署門檻）。

## 決策 2：音訊上傳與 Fastify 流程
- **Decision**：上傳 API 使用 Fastify multipart，將原始檔案暫存於伺服器目錄，再觸發分析隊列（Pitch → Score），結果寫回資料庫並回傳 sessionId。
- **Rationale**：Fastify 原生 multipart 效能佳，搭配 TypeBox schema 可確保 JSON 契約穩定；持久化 sessionId 讓前端可輪詢或透過 websocket 取得進度。
- **Alternatives considered**：直接在瀏覽器端完成分析（難以共用演算法且限制老師指派使用）、串接雲端儲存再回調（增加 infra 成本）。

## 決策 3：Pitch 偵測與分數分析策略
- **Decision**：以 pitchfinder 的 YIN 實作為 MVP，並將計算邏輯封裝在 packages/shared/audio.ts，對應 ScoreReport 物件可被前後端共用；同時保留注入實作的介面，以利後續改用自研 YIN/MPM。
- **Rationale**：pitchfinder 維護成熟且可在 Node/瀏覽器共用，能讓 P1/P2 流程快速驗證；抽象層讓我們能替換演算法而不影響 API 契約。
- **Alternatives considered**：完全自研 YIN/MPM（開發時間長、缺乏現成測試）、引入雲端 AI 模型（成本與延遲過高）。

## 決策 4：前端狀態與即時同步
- **Decision**：以 Zustand 管理練唱流程狀態（上傳進度、目前段落、老師指派代碼），並搭配 WebSocket 事件更新即時曲線；當 WebSocket 不可用時退回長輪詢。
- **Rationale**：Zustand 適合中等複雜 UI 狀態，無需大量樣板；WebSocket 可確保曲線延遲 <0.3s，Fallback 保證可靠性。
- **Alternatives considered**：僅使用 React Context（在大型畫面更新上太頻繁）、僅輪詢（延遲不可控且浪費頻寬）。

## 決策 5：測試與品質守門
- **Decision**：單元測試聚焦 packages/shared 的音訊/評分邏輯與 apps/server API schema；整合測試驗證「上傳→分析→分數」資料流；E2E (Playwright) 針對 P1~P3 各自跑一條 Happy Path，並記錄歷史列表效能。
- **Rationale**：吻合憲法要求的多層自動化測試，確保 MVP 切片皆可獨立驗證；同時提供度量資料（延遲/載入時間）以對照成功指標。
- **Alternatives considered**：僅以手動驗收（無法追蹤回歸）、僅單層測試（無法涵蓋跨層行為）。
