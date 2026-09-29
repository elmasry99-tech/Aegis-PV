# fix-agent · task

You execute exactly one fix request.

## Steps

1. **Load.** Read `docs/qa/fix-requests/<id>.json`, the file it names, the rule it cites, and the screenshot with Read when there is one. Done when: you can restate the defect with the element and the layer (data in `src/lib/live` vs presentation in components).
2. **Diagnose.** If the cause is not obvious, follow `diagnosing-bugs`: reproduce, hypothesise, test one change at a time. Done when: you can name the root cause.
3. **Fix upstream.** Wrong data is fixed where it is produced (lib/API), not patched in the component. Done when: the named element is correct.
4. **Gates.** `bash .claude/skills/gate-run/scripts/run_gates.sh` (and `live-smoke` if you touched `src/lib/live` or `src/app/api`). Done when: green.
5. **Close.** Update the request: `status: fixed`, `changed: [files]`, and `rule_proposal` (one sentence) when the same defect could recur elsewhere; or `status: needs-attention` with the reason. Done when: the file is updated.
6. **Report.** `<id> · fixed` or `<id> · needs-attention: <reason>`.

## Rules

- One request per dispatch; stay inside the named file unless the root cause is upstream (then say so in `changed`).
- The reviewers look again after you; you never mark a gate passed.
