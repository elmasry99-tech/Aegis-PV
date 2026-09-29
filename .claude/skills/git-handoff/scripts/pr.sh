#!/usr/bin/env bash
# pr.sh [base] — push the current branch and open (or find) its pull request
set -euo pipefail
base="${1:-${PR_BASE:-main}}"
branch="$(git branch --show-current)"
body_file="docs/qa/pr-body.md"
mkdir -p docs/qa
{
  echo "## ${branch} → ${base}"
  echo
  echo "### Commits"
  git log --oneline "origin/${base}..HEAD" 2>/dev/null || git log --oneline -n 20
  echo
  if [[ -f docs/qa/summary.json ]]; then
    echo "### Gates"
    echo '```json'; cat docs/qa/summary.json; echo '```'
  fi
  echo
  echo "### Checklist"
  echo "- [ ] reviewed in the app (Demo + Live, light + dark)"
  echo "- [ ] gates green"
} > "$body_file"

git push -q -u origin "$branch"

if command -v gh >/dev/null 2>&1; then
  if url="$(gh pr view "$branch" --json url --jq .url 2>/dev/null)"; then echo "$url"; exit 0; fi
  gh pr create --base "$base" --head "$branch" --title "${branch}" --body-file "$body_file" | tail -1
else
  remote="$(git remote get-url origin | sed -E 's#\.git$##; s#^git@github.com:#https://github.com/#')"
  echo "gh not installed — open: ${remote}/compare/${base}...${branch}?expand=1"
  echo "body: ${body_file}"
fi
