# Runbook — template-ts-supabase

> Fill every `TODO` before handover. A runbook with TODOs is not a runbook.

## Service summary

| Item                  | Value                 |
| --------------------- | --------------------- |
| Owner (team / person) | TODO                  |
| On-call rotation      | TODO (link)           |
| Repo                  | TODO                  |
| Prod URL              | TODO                  |
| Supabase project      | TODO (dashboard link) |
| Dashboards            | TODO                  |
| Alert channel         | TODO                  |

## Dependencies & secrets

| Name                            | Where it lives        | Rotation  | Owner |
| ------------------------------- | --------------------- | --------- | ----- |
| `SUPABASE_URL`                  | env / CI secret       | n/a       | TODO  |
| `SUPABASE_ANON_KEY`             | env / CI secret       | on leak   | TODO  |
| `SUPABASE_SERVICE_ROLE_KEY`     | server env only       | quarterly | TODO  |
| `ANTHROPIC_API_KEY` (AI review) | GitHub Actions secret | quarterly | TODO  |

Full list = `.env.example`. If a variable is used and not listed there, `src/lib/env.ts` must be updated in the same PR.

## Run locally

```bash
pnpm install
supabase start          # prints URL + keys
cp .env.example .env    # paste keys
pnpm dev
```

## Health check

```bash
pnpm tsx src/index.ts   # prints {"ok":true,"db":"up",...}; exit 1 if down
```

## Alerts → what to do

| Alert              | Likely cause                  | First action                                                    |
| ------------------ | ----------------------------- | --------------------------------------------------------------- |
| health `db: down`  | Supabase unreachable / paused | Check Supabase status page, project not paused, key not rotated |
| error rate > 2% 5m | bad deploy                    | Roll back (below)                                               |
| TODO               |                               |                                                                 |

## Deploy

TODO: command / pipeline link. Every deploy must be traceable to a merged PR.

## Rollback (rehearse before handover; record the date here: TODO)

1. App: redeploy previous tag: `TODO`
2. DB: migrations are forward-only. For a bad migration, ship a new migration that reverses it. Never edit an applied migration.
3. Confirm with health check + dashboards.

## Known failure modes

See `docs/INCIDENTS.md`. Every entry there has a matching automatic check.
