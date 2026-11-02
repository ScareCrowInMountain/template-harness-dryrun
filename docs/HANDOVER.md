# Handover checklist — AI-built project → engineering

Engineering does not accept the project until every row is ✅. "Mostly" is ❌.

| #   | Requirement                                             | How to verify                                                                        | Status |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| 1   | Runs locally from a clean clone                         | `pnpm install && supabase start && pnpm dev` on a fresh machine                      | ☐      |
| 2   | README explains what it is, who it is for, how to run   | Read it; someone outside the project can follow it                                   | ☐      |
| 3   | Runbook complete, no `TODO` left                        | `grep -c TODO docs/RUNBOOK.md` → 0                                                   | ☐      |
| 4   | Dependency + secret inventory complete                  | Every env var in code is in `.env.example` and `RUNBOOK.md`                          | ☐      |
| 5   | Named owner + on-call                                   | `RUNBOOK.md` summary table; `CODEOWNERS` has real handles                            | ☐      |
| 6   | Monitoring + alerting wired                             | Trigger a test alert; it reaches the channel                                         | ☐      |
| 7   | Rollback rehearsed                                      | Date + who did it in `RUNBOOK.md`                                                    | ☐      |
| 8   | CI green on `main`                                      | lint, typecheck, test (coverage gate), build, db-migrations, gitleaks, audit, codeql | ☐      |
| 9   | Branch protection applied                               | `scripts/setup-branch-protection.sh` run; direct push to `main` rejected             | ☐      |
| 10  | Every table has RLS + policies                          | `db-migrations` job passes                                                           | ☐      |
| 11  | No PR > 400 lines merged without `size-exempt` + reason | PR history                                                                           | ☐      |
| 12  | Open incidents all have an automatic check              | `docs/INCIDENTS.md` has no empty "Check added" cell                                  | ☐      |

Sign-off: ______ (engineering) ______ (handing over) Date: ______
