# SoloKey UI 風格與頁面規格說明

> SoloKey：你的個人音準室 —— 上傳 MP3、對照目標與自身音準曲線、即時練唱並自動評分。
>
> 工程實作流程與 Codex 原子規範請參考 `agents_codex.md`，本檔負責 UI / UX 指南。

本文件是 **SoloKey Web 版前端實作的 UI / UX 風格規格**，可直接作為 `README` 或設計說明，協助在沒有 Figma 的情況下仍維持一致的畫面風格與元件結構。

---

## 1. 產品定位與整體調性

- **產品定位**：個人練唱與音準訓練工具，偏「工作室」概念，而不是娛樂型卡拉 OK 平台。
- **風格關鍵字**：
  - 專注、簡潔、科技感、音樂感
  - 顏色偏冷色系 + 一點點亮色點綴
  - 避免太華麗、擬真舞台效果，以清楚資訊為主
- **目標使用情境**：
  - 使用者戴耳機、一邊看螢幕、一邊練唱
  - 需要清楚看到歌詞、音準曲線、目前狀態

設計方向以「**資訊清晰、操作簡單、視覺低干擾**」為主，避免花俏動畫影響練唱專注度。

---

## 2. Layout 與 Grid 規格

### 2.1 畫面尺寸

- 主要目標：桌機 / 筆電瀏覽器
- 基準寬度：`1440 × 900`（桌機）
- 最小支援寬度：`1024px`（低於可考慮使用簡化版 layout）

### 2.2 Grid & 間距

- Grid：
  - Desktop：`12 欄`，欄寬約 80–90px，gutter 24px（可依實際 CSS 調整）
- 間距系統（Spacing Scale，採 8px 制）：
  - `4, 8, 12, 16, 20, 24, 32, 40, 48` px
  - 常用：
    - 區塊內 padding：`16 / 20 / 24`
    - 元件間距（Button、Input 之間）：`8 / 12 / 16`

### 2.3 共用 Layout 構造

- **AppShell**：
  - 上方固定 Header（高度約 56–64px）
  - 左側 Side Navigation（寬度約 240px）
  - 右側為主內容區（可滾動）
- **主內容區**：
  - 上方：頁面標題 + 操作列 / 篩選列
  - 下方：內容卡片 / 表格 / 圖表

---

## 3. 顏色系統（Color System）

以下色碼僅為建議，可視實際品牌微調。

### 3.1 主要色

- **Primary 主色**（音樂 / 科技感）：
  - `--sk-color-primary: #7C4DFF`（紫藍）
  - `--sk-color-primary-soft: #EDE7FF`（主色淺底）
- **Accent 重點色**（分數、強調）：
  - `--sk-color-accent: #FFCA28`（亮黃）

### 3.2 中性色（灰階）

- `--sk-color-bg: #0F172A`（整體深色背景，類似 slate-900，可依實作調整為亮 / 暗主題）
- `--sk-color-surface: #111827`（卡片 / 區塊背景）
- `--sk-color-surface-soft: #1F2937`（次要區塊背景）
- `--sk-color-border: #374151`
- `--sk-color-text-main: #F9FAFB`
- `--sk-color-text-muted: #9CA3AF`
- `--sk-color-text-invert: #020617`

> 若採用亮色主題，可將背景改為 `#F9FAFB`，文字改用深灰 `#111827`，其他邏輯不變。

### 3.3 狀態色

- `--sk-color-success: #22C55E`
- `--sk-color-warning: #EAB308`
- `--sk-color-danger:  #EF4444`
- `--sk-color-info:    #38BDF8`

### 3.4 可用 CSS 變數範例

```css
:root {
  /* Primary & Accent */
  --sk-color-primary: #7c4dff;
  --sk-color-primary-soft: #ede7ff;
  --sk-color-accent: #ffca28;

  /* Neutral */
  --sk-color-bg: #0f172a;
  --sk-color-surface: #111827;
  --sk-color-surface-soft: #1f2937;
  --sk-color-border: #374151;
  --sk-color-text-main: #f9fafb;
  --sk-color-text-muted: #9ca3af;
  --sk-color-text-invert: #020617;

  /* Status */
  --sk-color-success: #22c55e;
  --sk-color-warning: #eab308;
  --sk-color-danger: #ef4444;
  --sk-color-info: #38bdf8;
}
```

---

## 4. 字體與文字階層（Typography）

### 4.1 字體建議

- 中文：**Noto Sans TC**、思源黑體，或系統無襯線字體
- 英文：**Inter**、system-ui
- 行高建議：`1.4–1.6`

### 4.2 文字階層

| Token             | 用途                   | 字級 | 行高 | 粗細 |
| ----------------- | ---------------------- | ---- | ---- | ---- |
| `heading-1`       | 頁面主標題             | 28–32px | 1.3 | 600–700 |
| `heading-2`       | 區塊標題 / 卡片標題     | 22–24px | 1.35 | 600 |
| `heading-3`       | 小標題                 | 18–20px | 1.35 | 500–600 |
| `body`            | 一般內文               | 14–16px | 1.5 | 400–500 |
| `body-muted`      | 次要文字 / 說明         | 14px | 1.5 | 400 |
| `caption`         | 註解 / Tag 內文字       | 12–13px | 1.4 | 400–500 |
| `number-emphasis` | 分數、指標數值         | 32–40px | 1.2 | 700 |

### 4.3 程式中可用 class 命名示例

- `sk-heading-1`
- `sk-heading-2`
- `sk-text-body`
- `sk-text-muted`
- `sk-text-caption`
- `sk-text-number`

---

## 5. 共用元件設計規格

### 5.1 Button 按鈕

**尺寸：**

- 高度：`36px`（M）、`40px`（L）
- 內距：左右 16–20px
- 圓角：`999px`（pill）或 `8px`（若想偏方正）

**種類：**

1. Primary
   - 背景：`--sk-color-primary`
   - 文字：`--sk-color-text-main`
   - Hover：稍微提高亮度 / 加強陰影
   - Disabled：背景用 `--sk-color-primary-soft`，文字 `--sk-color-text-muted`

2. Secondary
   - 背景：透明 / `--sk-color-surface`
   - 邊框：`--sk-color-border`
   - 文字：`--sk-color-text-main`

3. Ghost / Text
   - 無明顯邊框
   - 用於 icon button 或次要操作

**命名建議：**

- `ButtonPrimary`
- `ButtonSecondary`
- `ButtonGhost`

或 utility class：`sk-btn sk-btn-primary`。

---

### 5.2 Input / Form

**通用樣式：**

- 高度：`36–40px`
- 圓角：`6–8px`
- 邊框：`1px solid var(--sk-color-border)`
- 背景：`--sk-color-surface-soft`
- 聚焦（focus）：
  - 邊框色改為 `--sk-color-primary`
  - 外框加 `box-shadow: 0 0 0 1px var(--sk-color-primary-soft);`

**欄位類型：**

- 單行文字：歌曲名稱、歌手、搜尋框
- 數值：分數篩選等（未必一開始就需要）
- 選擇：Select / Dropdown（語言、難度、設備）
- DateTime：只在需要時間條件（例如日誌 / 歷史紀錄）時使用

**錯誤狀態：**

- 邊框改為 `--sk-color-danger`
- 底下顯示錯誤文字（`caption` 字級，紅色）

---

### 5.3 Card 卡片

用於 Dashboard、Result Summary 等。

- 背景：`--sk-color-surface`
- 圓角：`12px`
- 陰影：輕微（或用 border + 深背景即可）
- 內距：`20–24px`
- 上方：標題 + 選項 / Icon
- 中間：內容（數值、圖表、列表）
- 下方：次要資訊 / 動作連結（例如「查看詳情」）

---

### 5.4 Navigation（Header & SideNav）

**Header：**

- 高度約 56–64px，固定在頂部
- 左：Logo + `SoloKey` 字樣
- 中：可顯示目前頁面標題（可選）
- 右：
  - 使用者頭像 / 名稱
  - 下拉選單：帳號設定、登出

**SideNav：**

- 寬度：`220–240px`
- 背景：`--sk-color-surface`
- 導航項目：Icon + 文字
- Active 狀態：
  - 背景 `--sk-color-primary-soft`
  - 左側加 2–3px 主色條

建議選單項目：

- Dashboard（首頁 / 儀表板）
- Library（歌曲庫）
- Studio（練唱室）
- Results（成績 / 統計）
- Settings（設定）

---

### 5.5 Tabs / Segmented Control

用於：

- Studio 中不同模式切換：`完整練唱 / 段落練習 / 難點加強`
- Results 中不同統計：`概況 / 分段 / 歷史`

樣式建議：

- 背景：整組 Tabs 底為 `--sk-color-surface-soft`
- 每個 Tab：
  - Padding: `8–12px` 左右
  - Active：底色 `--sk-color-primary-soft`、文字 `--sk-color-primary`
  - Inactive：文字 `--sk-color-text-muted`

---

### 5.6 Tag / Chip

用於顯示「語系、難度、模式」等：

- 小型圓角矩形，圓角 `999px`
- 高度：約 `22–24px`
- 背景依情境：
  - 語系：`--sk-color-surface-soft`
  - 難度：顏色可分級（簡單綠、中等黃、困難紅）

---

### 5.7 表格（Table）

適用於 Library、History：

- 表頭背景：`--sk-color-surface-soft`
- 表頭文字：`heading-3` 或粗體 `body`
- 列高：`44–52px`
- Hover：整列背景 `--sk-color-surface-soft`
- 分隔線：`1px solid var(--sk-color-border)`

欄位示例（Library）：

- 歌曲名稱
- 歌手
- 時長
- 目標音準來源（原唱 / 自錄 / 無）
- 上次練習時間
- 操作（進入練唱室 / 查看成績）

---

### 5.8 圖表（Chart）

用於 Dashboard / Results：

- 顏色：
  - 主要折線：`--sk-color-primary`
  - 区塊填色：主色的 20–30% 透明度
- 座標軸：
  - 線條 `--sk-color-border`
  - Label 使用 `body-muted`

常見圖型：

- 折線圖：最近 7 次 / 30 天練習分數
- 柱狀圖：音準偏高 / 偏低 / 準確次數

---

### 5.9 Empty State（無資料狀態）

樣式統一：

- 中央簡單插圖 / Icon
- 標題（例如：尚未上傳任何歌曲）
- 副標（說明下一步）
- 一個主操作 Button（例如：`上傳 MP3`）

---

## 6. 頁面規格摘要

以下僅整理關鍵 UI 區塊，實作時可依此拆成 React 組件。

### 6.1 Dashboard（首頁 / 儀表板）

**區塊構成：**

1. 上方：
   - 標題 `歡迎回來，{暱稱}`
   - 副標 `今天要練哪一首歌？`

2. 中間三欄 Cards：
   - Card1：快速開始練唱（按鈕：選擇歌曲 / 上傳 MP3）
   - Card2：最近練習歌曲列表（顯示 3 筆）
   - Card3：今日目標 / 連續練習天數

3. 下方兩欄：
   - 左：最近 7 次練習分數折線圖
   - 右：常用歌曲 / 收藏歌單列表

---

### 6.2 Library（歌曲庫）

1. 上方 Filter Bar：
   - 搜尋框（歌名 / 歌手）
   - 下拉：語系 / 難度 / 是否有目標音準曲線
   - 右側 Button：`上傳 MP3`

2. 下方 Table：
   - 欄位如前述
   - 每列右側有 `進入練唱室` 操作

3. Empty State：
   - 顯示插圖 + 說明 + `上傳 MP3` 按鈕

---

### 6.3 Studio（練唱室）

Studio 是核心畫面，建議拆成三大區：

1. **上區：歌曲資訊 + 控制列**
   - 封面、歌名、歌手
   - 播放控制按鈕（播放 / 暫停 / 停止 / 循環）
   - 模式 Tabs：`完整練唱 / 段落練習 / 難點加強`

2. **中區：視覺練唱區**
   - 上方：波形（音訊 waveform）
   - 中間：目標音準曲線
   - 下方：使用者即時音準曲線（顏色區分）
   - 現在播放位置以直線標示

3. **下區：歌詞 + 狀態提示**
   - 左：目前句子高亮，下一句半透明
   - 右：即時提示（偏高 / 偏低，簡單文案）
   - 可預留圖示區 / 小型音高計

---

### 6.4 Results（練習結果 / 成績）

1. 上方 Summary Card：
   - 本次分數、等級（S/A/B…）
   - 總練唱時間 / 練唱段數
   - 一段簡短評語

2. 中間圖表：
   - 左：音準分佈（準確 / 偏高 / 偏低）
   - 右：難點段落列表（可一鍵跳回 Studio 某段）

3. 下方歷史紀錄：
   - 折線圖：最近 N 次分數
   - 表格：時間 / 分數 / 模式

---

### 6.5 Settings（設定）

分兩大部分：

1. 帳號：
   - 暱稱、頭像、語言、主題（亮 / 暗）

2. 裝置與音訊：
   - 麥克風選擇
   - 輸出裝置
   - 延遲校正結果顯示

---

### 6.6 Auth & Onboarding

1. Login / Register：
   - 左：插圖區（音樂相關抽象圖）
   - 右：表單

2. Onboarding（首次登入可選）：
   - 3 步驟簡介：
     1. 上傳 MP3
     2. 跟隨音準曲線練唱
     3. 看成績與進步趨勢

---

## 7. 命名與程式結構建議

### 7.1 Route / Page 命名

- `/dashboard`
- `/library`
- `/studio`
- `/results`
- `/settings`
- `/auth/login`
- `/auth/register`

### 7.2 React 組件命名示例

- Layout
  - `AppShell`
  - `Header`
  - `SideNav`
- Shared Components
  - `SkButton`
  - `SkInput`
  - `SkCard`
  - `SkTag`
  - `SkTable`
  - `SkEmptyState`
- Page Components
  - `DashboardPage`
  - `LibraryPage`
  - `StudioPage`
  - `ResultsPage`
  - `SettingsPage`

---

## 8. 實作建議

- 可以先依照本文件，把 **AppShell + Dashboard + Library** 三個頁面完成，確立整體風格。
- Studio 因為牽涉波形 / 音準曲線，建議先畫出簡單 placeholder UI，再逐步替換成實際圖層（例如 Canvas 或第三方圖表）。
- 所有樣式盡量共用：
  - Colors 使用 `--sk-color-*` 變數
  - Typography 使用統一 class（`sk-heading-1` 等）
  - Button / Card / Table 的風格在各頁面保持一致。

> 未來如要改版，只要更新本文件與共用樣式檔即可全域同步風格。
