#!/usr/bin/env bash
# commit.sh "<message>" [agent] — stage all non-ignored changes and commit with an agent trailer
set -euo pipefail
msg="${1:?message}"; agent="${2:-conductor}"
git add -A
if git diff --cached --quiet; then echo "nothing to commit" >&2; exit 1; fi
# refuse to commit anything that looks like a secret file
if git diff --cached --name-only | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$' >/dev/null; then
  echo "refusing: an .env file is staged" >&2; exit 2
fi
git commit -q -m "$msg" -m "Agent: $agent" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git rev-parse --short HEAD
