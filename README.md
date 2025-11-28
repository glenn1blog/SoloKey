# SoloKey — 個人音準室
> **SoloKey：你的個人音準室——上傳 MP3、對照目標與自身音準曲線、即時練唱並自動評分。**

本專案以 **Next.js 16（App Router）+ React 19 + TypeScript 5 + Tailwind CSS 4** 開發前端，後端採 **Node.js 20 LTS + Fastify**，並以 **pnpm monorepo** 管理。目標是提供「上傳 MP3 → 顯示目標音準曲線 → 麥克風即時比對 → 自動評分 → 回放/檢視錯誤段落」的完整練唱體驗。詳細規格、流程與 UI 風格請參考 `docs/` 目錄：

- `docs/process/agents_codex.md`
- `docs/specs/solo_key_規格與實作指南（給_codex）.md`
- `docs/ui/solo_key_ui_style_guide.md`

---

## 目錄
- [專案結構](#專案結構)
- [先決條件](#先決條件)
- [安裝與啟動](#安裝與啟動)
  - [1) 安裝套件](#1-安裝套件)
  - [2) 設定環境變數](#2-設定環境變數)
  - [3) 啟動後端（server）](#3-啟動後端server)
  - [4) 啟動前端（web）](#4-啟動前端web)
  - [5) 一鍵同時啟動（可選）](#5-一鍵同時啟動可選)
- [開發檢查與測試](#開發檢查與測試)
- [功能驗收（你可以這樣自測）](#功能驗收你可以這樣自測)
- [常見問題（FAQ）](#常見問題faq)
- [授權與貢獻](#授權與貢獻)

---

## 專案結構

```
.
├─ apps/
│  ├─ web/               # 前端：Next.js 16（App Router）
│  │  ├─ app/            # 路由、頁面
│  │  ├─ components/     # UI 元件
│  │  ├─ hooks/          # React Hooks
│  │  ├─ lib/            # 前端工具/封裝
│  │  └─ styles/         # Tailwind / 全域樣式
│  └─ server/            # 後端：Node.js + Fastify
│     ├─ src/
│     │  ├─ routes/      # API 路由
│     │  ├─ services/    # 分析/計分服務
│     │  └─ index.ts     # 進入點
└─ packages/
   └─ shared/            # 共用型別、常數、工具（選用）
```

---

## 先決條件

- 已安裝 **Node.js（建議 LTS）** 與 **pnpm**。
- 作業系統與瀏覽器**允許存取麥克風**（在 Windows：系統 → 隱私權與安全性 → 麥克風 → 允許瀏覽器）。
- 主要網站以 **Next.js 16** 建構；若需 Vite 實驗頁，請另建 `apps/lab`，避免與主站衝突。

---

## 安裝與啟動

### 1) 安裝套件

在專案根目錄：

```bash
pnpm install
```

> 本專案為 pnpm workspaces，會一次安裝 `apps/web` 與 `apps/server`（及 `packages/*`）的依賴。

---

### 2) 設定環境變數

**apps/web/.env.local**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_TELEMETRY_DISABLED=1
```

**apps/server/.env**

```env
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

---

### 3) 啟動後端（server，Fastify）

開啟一個終端機視窗：

```bash
pnpm --filter server dev
# 或
cd apps/server && pnpm dev
```

> Fastify 伺服器預期提供的端點（可依實作調整）：
> - `POST /api/analyze/pitch`：音準/基頻估測
> - `POST /api/score`：整體與分段評分
> - （可選）`WS /realtime`：即時資料流

---

### 4) 啟動前端（web）

另開一個終端機視窗：

```bash
pnpm --filter web dev
# 或
cd apps/web && pnpm dev
```

開啟瀏覽器前往 `http://localhost:3000`。

建議頁面：
- `/`：入口（可上傳 MP3）
- `/sing`：練唱頁（麥克風比對、延遲校正）
- `/result/[id]`：結果頁（總分與分段統計、回放）

---

### 5) 一鍵同時啟動（可選）

你可以在「專案根」的 `package.json` 增加腳本，以同時啟前後端：

```json
{
  "scripts": {
    "dev": "pnpm -w --parallel dev:*",
    "dev:web": "pnpm --filter web dev",
    "dev:server": "pnpm --filter server dev"
  }
}
```

之後直接執行：

```bash
pnpm dev
```

---

## 開發檢查與測試

在**專案根目錄**執行（需全部通過）：

```bash
pnpm lint && pnpm typecheck && pnpm test
```

- **ESLint**：不得使用 `any`，維持一致的程式風格與最佳實務。
- **TypeScript**：嚴格型別檢查（`tsc --noEmit`）。
- **Test**：針對關鍵模組（例如：音準分析、評分器）提供最小但可靠的單元測試。

---

## 功能驗收（你可以這樣自測）

- **上傳 MP3** → 畫面顯示**目標音準曲線**（灰/半透，整首歌或擷取片段）。
- **開啟麥克風** → 顯示**你的即時音準曲線**（亮色），與目標曲線重疊比對。
- **評分** → 顯示**總分**與**分段得分**，標示偏高/偏低/不準的區段，可**回放**關鍵片段。
- **延遲校正** → 在 `/sing` 頁面進行手動/自動延遲估測，確保 MP3 與輸入對齊。
- **品質門檻** → Lint/TypeCheck/Test 全通過、README 完整，瀏覽器權限提示正確。

---

## 常見問題（FAQ）

**Q1. 麥克風沒有反應？**  
請確認已授權瀏覽器（`localhost` 屬於安全來源），並在系統層級開啟麥克風權限。重新整理頁面後再次允許。

**Q2. 聲音與圖像不同步/延遲？**  
請在 `/sing` 進行**延遲校正**。若仍偏移，確認系統音訊裝置取樣率與瀏覽器音訊設定，或調低其他高負載程式。

**Q3. 畫面掉幀或延遲過高？**  
請確保重運算放在 **Web Worker/Audio Worklet**，並於 Fastify 後端使用適當的快取/串流策略；Canvas 每幀僅**必要次數**繪圖，避免同時開啟多個高效能頁面。

---

## 授權與貢獻

- 授權條款：請視專案需求補上（例如 MIT）。  
- 貢獻流程：請先開 Issue 討論需求，遵守 commit 規範與 ESLint/TypeCheck/Test 檢查。

---

**現在就開始：**
1. `pnpm install`
2. 啟動後端：`pnpm --filter server dev`
3. 啟動前端：`pnpm --filter web dev`
4. 上傳一段 MP3，在 `/sing` 測試你的音準曲線與評分吧！🎤
