# Quickstart — SoloKey v1 核心產品定位

## 1. 安裝與啟動
1. `pnpm install`
2. 在兩個終端分別啟動：
   - `pnpm --filter server dev`
   - `pnpm --filter web dev`
3. 確認 `.env` 設定已包含 API 基底網址與 CORS 來源。

## 2. 建立第一個練唱 Session（P1）
1. 開啟 `http://localhost:3000/`
2. 上傳 MP3/WAV，輸入曲名、歌手與備註。
3. 完成練唱，檢查結果頁：應看到雙曲線、總分與段落建議。

## 3. 老師指派流程（P2）
1. 在後端透過 `POST /api/assignments` 建立代碼（可用 REST 客戶端或暫時的管理頁）。
2. 將代碼輸入前端上傳流程，完成練唱。
3. 呼叫 `GET /api/assignments/{code}/sessions`，確認老師可看到新結果。

## 4. 歷史回顧（P3）
1. 連續完成數次練唱。
2. 前往 `/history` 或相對應頁面，使用日期與關鍵字篩選。
3. 點擊單筆記錄 → 應可回放重點片段並顯示備註。

## 5. 測試與驗證
- 單元測試：`pnpm test --filter shared`（音訊/評分邏輯）
- 整合測試：`pnpm test --filter server`（上傳→分析→分數）
- E2E：`pnpm test:e2e`（Playwright，覆蓋 P1~P3）

## 6. 驗收 Checklist
- [ ] 上傳限制（檔案大小/格式）有清楚錯誤訊息
- [ ] 練唱過程即時曲線延遲不超過 0.3s
- [ ] 老師指派能連結學生練習並顯示於列表
- [ ] 歷史頁能載入 20 筆資料且 2 秒內完成
- [ ] `pnpm lint && pnpm typecheck && pnpm test` 全綠
