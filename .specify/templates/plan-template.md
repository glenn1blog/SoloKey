# 實作計畫：[FEATURE]

**分支**：`[###-feature-name]`｜**日期**：[DATE]｜**規格**：[link]  
**輸入**：`/specs/[###-feature-name]/spec.md` 中的功能說明

**提示**：本模板由 `/speckit.plan` 指令產出；請參考 `.specify/templates/scripts` 內的流程說明。所有文字與註解必須為正體中文，專有名詞可保留英文。

## 摘要

[從 feature 規格萃取：核心需求與推薦的技術作法，需對應 MVP 切片]

## 技術背景

> 將下列欄位補上實際資訊，若尚未確定請標註「NEEDS CLARIFICATION」並在 research 階段優先處理。

- **語言／版本**：例：TypeScript 5 + Next.js 16（App Router）、Node.js 20 LTS
- **主要依賴**：例：Fastify、@fastify/websocket、pitchfinder、Zustand、Tailwind CSS 4
- **儲存／資料來源**：例：PostgreSQL、檔案系統、N/A
- **測試框架**：例：Vitest、Playwright、pnpm workspace script
- **目標平台**：例：瀏覽器（Chromium/Firefox/Safari）、Node.js Server
- **效能指標**：例：Pitch 偵測延遲 < 50ms、頁面互動 60fps
- **限制條件**：例：禁止阻塞主執行緒、不可引入額外前端框架
- **規模／範圍**：例：1 個 P1 User Story，最多 2 個附加流程

## 憲法檢查（Phase 0 必填）

| 檢查項目 | 說明 |
| --- | --- |
| 正體中文 | 本計畫與所有輸出文件需 100% 正體中文敘述。 |
| MVP 切片 | User Stories 需能獨立測試，避免 overdesign；列出測試策略。 |
| 前端邊界 | 僅能使用 Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4，並沿用現有目錄。 |
| 後端邊界 | 僅能使用 Node.js 20 LTS + Fastify/Express，API 以 JSON 傳輸。 |
| 型別與品質 | 嚴禁 `any`；執行 `pnpm lint && pnpm typecheck && pnpm test` 作為交付門檻。 |

違反項目需於「複雜度追蹤」紀錄理由與退場計畫。

## 專案結構

### 文件（此 Feature）

```text
specs/[###-feature]/
├── plan.md              # 本檔案，由 /speckit.plan 產生
├── research.md          # Phase 0 結果
├── data-model.md        # Phase 1 結果
├── quickstart.md        # Phase 1 結果
├── contracts/           # Phase 1 API/事件契約
└── tasks.md             # 由 /speckit.tasks 產出
```

### 原始碼（倉庫根目錄）

> 依實際使用情境保留對應選項，未使用者請刪除，以免與憲法的「單一技術棧」衝突。

```text
# 選項 1：單一專案
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# 選項 2：Web（SoloKey 預設）
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── app/ 或 pages/
│   └── services/
└── tests/

# 選項 3：行動裝置 + API
api/
└── ...

ios/ 或 android/
└── ...
```

**結論**：說明本 feature 採用哪一個結構，以及與現有目錄（如 `apps/web`、`apps/server`、`packages`）的映射。

## 複雜度追蹤（僅當有憲法例外時填寫）

| 違反條款 | 必要性 | 被拒的較簡方案 |
| --- | --- | --- |
| 例：新增第 3 個前端專案 | 需要實驗性 UI | 既有 Next.js 專案可透過 Feature Flag 達成 |

> 例外需設定追蹤 Issue/任務，說明到期日與還原計畫。
