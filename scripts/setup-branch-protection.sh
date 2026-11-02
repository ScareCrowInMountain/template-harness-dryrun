#!/usr/bin/env bash
# One-time: enforce the rules this template assumes on `main`.
#   - PRs only (no direct push), linear history
#   - 1 approving review from a CODEOWNER; stale approvals dismissed on new commits
#   - required status checks (names must match the `name:` of each job)
#   - admins are NOT exempt
# The AI reviewer can only comment; it is never a CODEOWNER, so a human must approve.
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
BRANCH="${2:-main}"

gh api -X PUT "repos/${REPO}/branches/${BRANCH}/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - <<JSON
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["lint", "typecheck", "test", "build", "harness", "pr-size", "gitleaks", "semgrep", "db-migrations"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
JSON

echo "Branch protection applied to ${REPO}:${BRANCH}"
