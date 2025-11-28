# SoloKey 快速啟動（Phase 1 基礎）

## 1. 安裝依賴

```bash
pnpm install
```

## 2. 設定環境變數

### apps/server/.env
```
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=file:./data/solokey.db
FILE_UPLOAD_DIR=./uploads
REALTIME_PATH=/realtime
```

### apps/web/.env.local
```
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/realtime
NEXT_TELEMETRY_DISABLED=1
```

## 3. 建立資料與上傳目錄

```bash
mkdir -p data uploads
```

## 4. 啟動開發環境

```bash
pnpm dev:server   # Fastify + Drizzle (SQLite) server
pnpm dev:web      # Next.js 16 web 應用
```

伺服器提供 `http://localhost:4000/health`，Web 端為 `http://localhost:3000`。

## 5. 驗證

- `pnpm lint`：所有 workspace ESLint
- `pnpm typecheck`：TypeScript 嚴格模式
- `pnpm test`：Vitest 單元 / 整合
- `pnpm verify`：一次執行 lint + typecheck + test

更多詳細的流程、Playwright E2E、Drizzle schema 設定等將在 Phase 2 之後補充。
