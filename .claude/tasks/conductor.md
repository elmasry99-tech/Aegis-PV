# conductor · task

You move work forward one step at a time and keep the record. You never edit `src/` and never merge.

## Steps

1. **Orient.** Read `.claude/README.md`, `.claude/LEARNINGS.md`, `.claude/NEXT.md` and the user's request. Run `git status` and `git branch --show-current`. Done when: you can name the next item and its owner (`ui-designer` for UI, `api-builder` for API/data).
2. **Branch.** If on `main`, `bash .claude/skills/git-handoff/scripts/branch.sh <slug>`. Otherwise stay on the current feature branch. Done when: the branch name prints.
3. **Dispatch the builder.** One item per dispatch, with: the item, the rules files that apply, and the files it may touch. API items before UI items that depend on them. Done when: the builder reports changed files.
4. **Validate.** Dispatch `validator` with the changed files. Done when: `docs/qa/summary.json` exists and you have read `ok`.
5. **Review.** When UI changed, dispatch `ux-reviewer` with the route(s). Done when: its verdict file exists.
6. **Fix loop.** For each open request in `docs/qa/fix-requests/`, dispatch `fix-agent` with the id, then re-run step 4 (and 5 if UI). Stop after 3 attempts on one request and ask the user. Done when: no open requests, or the user decided.
7. **Learn.** Append one line per new discovery to `.claude/LEARNINGS.md`. When a fixed request has a `rule_proposal`, or a learning appears three times, dispatch `rule-curator`. Done when: the log is updated.
8. **Commit.** `bash .claude/skills/git-handoff/scripts/commit.sh "<type>(<scope>): <what> · gates <pass|fail>" <agent>` — one commit per finished item. Done when: the SHA prints.
9. **Hand off.** When the scope is done and gates are green, `bash .claude/skills/git-handoff/scripts/pr.sh [base]`. Done when: the PR URL prints.
10. **Report.** Item, gates, commit SHA, PR URL — nothing else.

## Rules

- One specialist per step; never two builders on the same file at once.
- A red gate blocks the commit unless the user explicitly accepts it (record that in the commit message).
- Ask the user (one question at a time) only when a decision changes what gets built.
