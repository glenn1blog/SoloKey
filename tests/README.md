# SoloKey 測試指南

## 工作區腳本

- `pnpm lint`：在所有 workspace 內執行 ESLint（apps/web、apps/server、packages/shared）。
- `pnpm typecheck`：以 `tsc --noEmit` 驗證所有套件。
- `pnpm test`：執行各專案的 Vitest 腳本。
- `pnpm verify`：依序執行 lint → typecheck → test，作為 PR 前的最小驗證。

## 專案分流

| 區塊 | 指令 | 位於 |
| --- | --- | --- |
| Web UI | `pnpm --filter @solokey/web test` | `apps/web/tests`（Vitest、Playwright） |
| Server API | `pnpm --filter @solokey/server test` | `apps/server/tests` |
| Shared 套件 | `pnpm --filter @solokey/shared test` | `packages/shared/tests` |

Playwright E2E 測試將於後續 Phase 引入，屆時會在 `apps/web/tests/e2e/README.md` 補充瀏覽器需求。
