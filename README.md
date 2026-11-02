# template-ts-supabase

TypeScript + Supabase starter with the guardrails from the _AI-assisted development guidelines_ (section 4) already wired into CI. Fork it, rename it, keep the checks.

[中文说明见下方](#中文)

## What is enforced (and where)

| Rule                                                                            | Enforced by                                         |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| Functions ≤ 50 lines, files ≤ 300 lines, cyclomatic complexity ≤ 10, ≤ 4 params | `eslint.config.js` → CI job `lint`                  |
| PR ≤ 400 changed lines (lockfiles/snapshots excluded)                           | `scripts/check-pr-size.sh` → CI job `pr-size`       |
| Coverage ≥ 80% lines / 70% branches                                             | `vitest.config.ts` → CI job `test`                  |
| Strict TypeScript, no `any`, no floating promises                               | `tsconfig.json`, eslint → `typecheck`, `lint`       |
| Every env var declared and validated at startup                                 | `.env.example` + `src/lib/env.ts`                   |
| Every table has RLS; migrations apply cleanly from zero                         | CI job `db-migrations`                              |
| No secrets in git                                                               | `security.yml` → gitleaks, weekly too               |
| Dependency vulns (high+) block merge                                            | `security.yml` → `pnpm audit` + CodeQL + Dependabot |
| Second-AI review, comment only                                                  | `ai-review.yml` (needs `ANTHROPIC_API_KEY` secret)  |
| Human approval required; AI cannot approve                                      | `CODEOWNERS` + `scripts/setup-branch-protection.sh` |
| Handover gate                                                                   | `docs/HANDOVER.md`, `docs/RUNBOOK.md`               |
| Incident → automatic check                                                      | `docs/INCIDENTS.md`, issue template `incident`      |

## Quick start

```bash
pnpm install
supabase start                 # needs Docker + Supabase CLI
cp .env.example .env           # paste the keys `supabase start` printed
pnpm check                     # lint + typecheck + format + test (what CI runs)
pnpm dev
```

## After forking

1. Replace `@YOUR-ORG/*` in `.github/CODEOWNERS` with real teams.
2. Add repo secret `ANTHROPIC_API_KEY` (or delete `ai-review.yml`).
3. Run `scripts/setup-branch-protection.sh owner/repo` once.
4. Fill every `TODO` in `docs/RUNBOOK.md` before handover.
5. Regenerate DB types after each migration: `supabase gen types typescript --local > src/lib/database.types.ts`.

## Layout

```
src/lib/env.ts            env schema (zod) — single source of truth for config
src/lib/supabase.ts       anon + service-role clients (service throws if key missing)
src/lib/database.types.ts generated DB types (placeholder included)
src/health/               example module + tests
supabase/migrations/      forward-only SQL; RLS in the same file as the table
scripts/                  pr-size check, branch-protection setup
docs/                     RUNBOOK, HANDOVER_CHECKLIST, INCIDENTS, guideline section 4 (zh/en)
.github/workflows/        ci, pr-size, security, ai-review
```

---

## 中文

TypeScript + Supabase 模板，把《AI 辅助开发准则》第 4 节的要求直接做进 CI。Fork 后改名即用，检查项别删。

### 强制项与落点

| 规则                                                 | 落点                                                |
| ---------------------------------------------------- | --------------------------------------------------- |
| 函数 ≤ 50 行、文件 ≤ 300 行、圈复杂度 ≤ 10、参数 ≤ 4 | `eslint.config.js` → CI `lint`                      |
| 单个 PR ≤ 400 行改动（不含 lockfile / 快照）         | `scripts/check-pr-size.sh` → CI `pr-size`           |
| 覆盖率 行 ≥ 80%、分支 ≥ 70%                          | `vitest.config.ts` → CI `test`                      |
| 严格 TS，禁 `any`，禁未处理的 Promise                | `tsconfig.json` + eslint                            |
| 所有环境变量有清单并在启动时校验                     | `.env.example` + `src/lib/env.ts`                   |
| 每张表必须开 RLS；迁移能从零干净跑通                 | CI `db-migrations`                                  |
| 密钥不入库                                           | `security.yml` → gitleaks（每个 PR + 每周）         |
| 高危依赖漏洞阻断合并                                 | `pnpm audit` + CodeQL + Dependabot                  |
| 第二个 AI 独立审查，只评论                           | `ai-review.yml`（需 `ANTHROPIC_API_KEY`）           |
| 必须有人批准，AI 不能批准                            | `CODEOWNERS` + `scripts/setup-branch-protection.sh` |
| 接手门槛                                             | `docs/HANDOVER.md`、`docs/RUNBOOK.md`               |
| 事故变成自动检查                                     | `docs/INCIDENTS.md`、issue 模板 `incident`          |

### 快速开始

```bash
pnpm install
supabase start                 # 需要 Docker 和 Supabase CLI
cp .env.example .env           # 填入 supabase start 打印的 key
pnpm check                     # lint + typecheck + format + test，与 CI 一致
pnpm dev
```

### Fork 之后

1. 把 `.github/CODEOWNERS` 里的 `@YOUR-ORG/*` 换成真实团队。
2. 加仓库 secret `ANTHROPIC_API_KEY`（或删掉 `ai-review.yml`）。
3. 跑一次 `scripts/setup-branch-protection.sh owner/repo`。
4. 交接前把 `docs/RUNBOOK.md` 里所有 `TODO` 填完。
5. 每次迁移后重新生成类型：`supabase gen types typescript --local > src/lib/database.types.ts`。
