#!/usr/bin/env bash
# Fail when a PR changes more than MAX_LINES lines (added + deleted), excluding
# lockfiles, snapshots and generated files. Big PRs don't get reviewed; they get
# skimmed. Split them.
set -euo pipefail

MAX_LINES="${MAX_LINES:-400}"
BASE="${BASE_REF:-origin/main}"

EXCLUDE=(
  ':!pnpm-lock.yaml' ':!package-lock.json' ':!yarn.lock'
  ':!**/__snapshots__/**' ':!**/*.snap'
  ':!supabase/types/**' ':!**/*.generated.*'
  ':!dist/**' ':!coverage/**'
)

read -r ADDED DELETED < <(
  git diff --numstat "${BASE}...HEAD" -- . "${EXCLUDE[@]}" \
    | awk '{ a += ($1 == "-" ? 0 : $1); d += ($2 == "-" ? 0 : $2) } END { print a+0, d+0 }'
)
TOTAL=$((ADDED + DELETED))

echo "PR size: +${ADDED} -${DELETED} = ${TOTAL} lines (limit ${MAX_LINES})"
if (( TOTAL > MAX_LINES )); then
  echo "::error::PR changes ${TOTAL} lines; limit is ${MAX_LINES}. Split it into smaller PRs."
  echo "Add label 'size-exempt' only for pure renames/moves or generated code, and say why in the PR body."
  exit 1
fi
