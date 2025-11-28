# Data Model — SoloKey v1 核心產品定位

## PracticeSession
- **用途**：代表一次完整練唱流程（從上傳到完成評分），供個人或老師指派使用。
- **欄位**：
  - `sessionId` (UUID)
  - `role` (enum: `solo`, `student`, `teacher`)
  - `assignmentCode` (nullable string，老師指派使用)
  - `referenceTrack` (object：檔案 URI、曲名、歌手、長度)
  - `status` (enum: `uploaded`, `analyzing`, `scored`, `failed`)
  - `createdAt`, `updatedAt`
  - `notes` (text，使用者備註)
- **關聯**：
  - 1:1 `ScoreReport`
  - 1:N `PitchContour`（reference 與 actual 雙曲線）
  - 1:N `HistorySnapshot`（投影到歷史列表）
- **驗證與規則**：
  - `referenceTrack.length` <= 15 分鐘；檔案大小 <= 50MB。
  - 老師角色必須提供 `assignmentCode`。
  - `status=failed` 時需記錄錯誤訊息供 UI 顯示。
- **狀態轉移**：
  - `uploaded` → `analyzing`（伺服器開始跑 pitch）
  - `analyzing` → `scored`（分析完成並寫入 ScoreReport）
  - 任一階段若出錯 → `failed`

## PitchContour
- **用途**：儲存 reference 或 actual 音準曲線資料，用於繪圖與分數計算。
- **欄位**：
  - `contourId` (UUID)
  - `sessionId` (FK)
  - `type` (enum: `reference`, `actual`)
  - `frames`（array of `{ t: number; f0: number }`）
  - `sampleRate`、`duration`
- **規則**：
  - `frames` 依時間排序；相鄰時間差固定（例如 10ms）。
  - `f0=0` 代表無法偵測，前端需繪製為缺口。

## ScoreReport
- **用途**：封裝單次練唱的評分結果與建議。
- **欄位**：
  - `sessionId` (PK/FK)
  - `totalScore` (0-100)
  - `segments`（array：`{ startSec, endSec, score, note }`）
  - `detectedIssues`（array：`pitch_high`, `pitch_low`, `unstable`...）
  - `recommendations`（文字陣列）
- **規則**：
  - 必須在 `PracticeSession.status=scored` 前建立。
  - `segments` 至少包含一筆；長度不固定但需覆蓋全曲。

## Assignment (老師指派)
- **用途**：讓老師發送練習任務並追蹤學生提交。
- **欄位**：
  - `assignmentId` (UUID)
  - `code` (短字串，提供學生輸入)
  - `teacherName` 或識別資訊
  - `songInfo`（曲名、目標段落）
  - `status` (`active`, `archived`)
  - `createdAt`, `expiresAt`
- **關聯**：
  - 1:N `PracticeSession`（學生練習會帶入 `assignmentCode`）
- **規則**：
  - `code` 全域唯一；過期後不可再使用。

## PracticeHistoryEntry
- **用途**：供歷史列表顯示的輕量物件。
- **來源**：從 `PracticeSession` + `ScoreReport` 投影。
- **欄位**：
  - `sessionId`
  - `title`（曲名 + 標籤）
  - `totalScore`
  - `createdAt`
  - `assignmentCode`（可選）
  - `notesSummary`
- **規則**：
  - 儲存最近 20 筆即可，舊資料可透過進階查詢取得。

## UserContext（前端狀態模型）
- **用途**：前端儲存目前練唱流程資訊，以支援即時畫面與歷史回放。
- **欄位**：
  - `currentSessionId`
  - `uploadProgress`
  - `livePitchFrames`
  - `assignmentCodeInput`
  - `historyFilters`（日期區間、關鍵字）
- **規則**：
  - 狀態變更須透過 Zustand actions，並在頁面切換時序列化以供回復。
