#!/usr/bin/env bash
# branch.sh <slug> — create or check out feat/<slug>; no-op when already on a feature branch
set -euo pipefail
slug="${1:?slug}"
current="$(git branch --show-current)"
if [[ "$current" != "main" && "$current" != "master" ]]; then echo "$current"; exit 0; fi
branch="feat/${slug}"
if git show-ref --quiet "refs/heads/$branch"; then git checkout -q "$branch"; else git checkout -q -b "$branch"; fi
echo "$branch"
