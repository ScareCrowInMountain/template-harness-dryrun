# Incidents → automatic checks

Rule: every incident adds a lint rule, a test, or a CI step. Words in a guideline
fade; a CI check runs forever. A row with an empty "Check added" cell is a bug.

| Date       | Incident (1 line)                                             | Root cause                                   | Check added (link)                                                   |
| ---------- | ------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| 2026-11-02 | (example) Table shipped without RLS; anon could read all rows | Migration forgot `enable row level security` | `ci.yml` → `db-migrations` job fails on any public table without RLS |
| 2026-11-02 | (example) 1,800-line PR merged with a logic bug nobody read   | PR too big to review                         | `pr-size.yml` fails > 400 lines                                      |
| 2026-11-02 | (example) Service-role key committed                          | No secret scanning                           | `security.yml` → gitleaks on every PR + weekly                       |
