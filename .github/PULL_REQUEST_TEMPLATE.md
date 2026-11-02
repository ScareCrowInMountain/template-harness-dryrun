## What / Why

<!-- One paragraph. Link the issue. -->

## AI involvement

- [ ] Generated/assisted by AI (tool: ______ )
- [ ] I read every line of this diff and can explain it in review

## Checklist (reviewer blocks merge if any box is unchecked without a reason)

- [ ] ≤ 400 changed lines (or `size-exempt` label + reason below)
- [ ] Tests added/updated; coverage gate passes
- [ ] No secrets, no new env var without `.env.example` + `src/lib/env.ts`
- [ ] New table ⇒ RLS enabled + policy in the same migration
- [ ] Runbook updated if ops behavior changed (new cron, queue, external call, alert)
- [ ] Rollback: how do we undo this? ______

## Incident follow-up (only if this PR is from an incident)

- [ ] Added the automatic check (lint rule / test / CI step) — link: ______
- [ ] Logged in `docs/INCIDENTS.md`
