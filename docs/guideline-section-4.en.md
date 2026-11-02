# Section 4 — Engineering gates and handover (AI-assisted development guidelines)

> Note: this is a rewrite. Items 1–4 of the original were not preserved in this session; they are reconstructed below on the same theme. Items 5–8 follow the agreed recommendations. Each item states the rule and how it is enforced, pointing at concrete files in the `template-ts-supabase` repository.

## 4.1 Acceptance criteria before code

**Rule**: every task starts with written inputs, outputs, edge cases and a definition of done. Without one, the AI invents its own.

**Enforced by**: the PR template's mandatory "What / Why" field linked to an issue; reviewers return PRs that have none.

## 4.2 Tests and types are gates, not suggestions

**Rule**: strict TypeScript (no `any`, no floating promises). Coverage ≥ 80% lines / 70% branches, below which CI fails. Thresholds only go up; lowering one requires an `INCIDENTS.md` entry.

**Enforced by**: `tsconfig.json`, `eslint.config.js`, `vitest.config.ts`; CI jobs `lint`, `typecheck`, `test`.

## 4.3 No secrets in git, dependencies inventoried

**Rule**: all configuration via environment variables; `.env.example` is the single inventory and a schema validates it at startup, so a missing value stops the process. Secret scanning runs on every PR and weekly; high-severity dependency vulnerabilities block merge.

**Enforced by**: `src/lib/env.ts`, `.env.example`, `security.yml` (gitleaks, `pnpm audit`, CodeQL), Dependabot.

## 4.4 Protected main, everything through PRs

**Rule**: no direct pushes to `main`, linear history, at least one CODEOWNER approval, stale approvals dismissed on new commits, admins not exempt. Every table enables RLS in the migration that creates it; a table without RLS fails CI.

**Enforced by**: `scripts/setup-branch-protection.sh`, `.github/CODEOWNERS`, CI job `db-migrations`.

## 4.5 Limit size

**Rule**: AI tends to produce huge files and long functions. Functions ≤ 50 lines, files ≤ 300 lines, cyclomatic complexity ≤ 10, ≤ 4 parameters, nesting ≤ 3; lint fails otherwise. A PR changes at most 400 lines (lockfiles, snapshots and generated code excluded); split anything larger. Pure moves/renames or generated code may carry a `size-exempt` label with the reason in the PR body, confirmed by the reviewer.

**Enforced by**: the size rule group in `eslint.config.js`; `pr-size.yml` + `scripts/check-pr-size.sh`.

## 4.6 Handover checklist before engineering accepts

**Rule**: engineering does not take over unless all of the following hold:

1. Runs locally from a clean clone;
2. README and runbook exist, with no `TODO` left in the runbook;
3. Dependency and secret inventory complete: location, rotation period, owner for each;
4. Named owner and on-call rotation;
5. Monitoring and alerting wired; a test alert reaches the channel;
6. Rollback rehearsed, with date and operator recorded in the runbook.

**Enforced by**: `docs/HANDOVER.md` (12 sign-off rows), `docs/RUNBOOK.md` template.

## 4.7 Every incident becomes an automatic check

**Rule**: the output of a post-mortem is a lint rule, a test or a CI step, not another sentence in the guidelines. Rules in documents fade; rules in CI run forever. An incident issue cannot be closed without a link to the check that was added.

**Enforced by**: `docs/INCIDENTS.md` (date / incident / root cause / check link), the required field in the `incident` issue template.

## 4.8 A second AI may review, but never replaces a human

**Rule**: a different model reviews every PR independently, scoped to security and logic, never style; it posts a single comment that serves as a checklist for the human reviewer. The AI account is not a CODEOWNER and has no approval permission; branch protection still requires a human approval. Final approval is always human.

**Enforced by**: `ai-review.yml` (comment only) + `require_code_owner_reviews` in branch protection.
