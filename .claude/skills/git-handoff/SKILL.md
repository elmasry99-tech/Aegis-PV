---
name: git-handoff
description: Branch, commit and pull-request conventions for Aegis-PV work. Use when an agent needs to start a feature branch, commit a finished item with an agent trailer, or push and open the pull request.
allowed-tools:
  - Bash
---

Three scripts, one convention each. Run them from the repository root with Git Bash.

| Need | Command | Result |
|---|---|---|
| Start work | `bash .claude/skills/git-handoff/scripts/branch.sh live-dashboard` | on `feat/live-dashboard` (created or checked out); prints the name. Skips when already on a non-main branch. |
| Commit a finished item | `bash .claude/skills/git-handoff/scripts/commit.sh "feat(live): Open-Meteo client · gates pass" api-builder` | stages tracked + new files outside ignored paths, one commit with a `Co-Authored-By` trailer; prints the SHA |
| Open the PR | `bash .claude/skills/git-handoff/scripts/pr.sh [base]` | pushes, opens (or finds) the PR with `docs/qa/summary.json` in the body via `gh`; without `gh` prints the GitHub compare URL and the body file to paste |

Message shape: `<type>(<scope>): <what changed> · gates <pass|fail>` where type ∈ feat · fix · refactor · chore · docs · style. Never merge; a human merges. Never `--no-verify`, never force-push a shared branch.
