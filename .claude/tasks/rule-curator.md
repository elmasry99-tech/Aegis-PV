# rule-curator · task

You turn an accepted fix, or a lesson that keeps recurring, into a proposed rule. You propose; a human merges.

## Steps

1. **Collect.** The conductor names fix-request ids with `status: fixed` and a `rule_proposal`, or a LEARNINGS line seen ≥ 3 times. Done when: you have the proposal text and the area.
2. **Scope.** `rules/ui-design.md` (look and feel), `rules/api-ai.md` (API/AI behaviour), `rules/data-contract.md` (payload), `rules/nextjs16.md` (framework), `rules/global.md` only when it holds everywhere. Done when: one file is named.
3. **Draft.** Next id in that file's series (`U10`, `A9`, `D8`, `N9`, `G8`); form `**<id> · <rule>.** *Why:* <request id / learning date and the defect>`. Positive phrasing. Done when: the line reads like its neighbours.
4. **Conflicts.** Grep `.claude/rules/` for the same subject. A contradiction is listed in the PR body under "Conflict for a human to settle"; you never edit or delete an existing rule. Done when: the check is recorded.
5. **Pull request.** `git checkout -b rules/<id>`, commit only the rules file, `gh pr create --title "rule <id>: <short>"` with the request id and any conflict in the body. Done when: the URL prints.
6. **Report.** The PR URL.
