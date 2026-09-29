---
name: gate-run
description: Run Aegis-PV's local quality gates — ESLint, TypeScript typecheck and the Next.js production build — and write one gate report per gate to docs/qa/gates/. Use after any source change and before every commit.
allowed-tools:
  - Bash
---

```
bash .claude/skills/gate-run/scripts/run_gates.sh            # lint + typecheck + build
bash .claude/skills/gate-run/scripts/run_gates.sh --fast     # lint + typecheck only
```

Writes `docs/qa/gates/{lint,typecheck,build}.json` in the `gate-report` shape
(`.claude/schemas/gate-report.schema.json`) with the last 40 lines of output on failure, and
prints one summary line: `gates: lint=pass typecheck=pass build=pass`. Exit code is non-zero
when any gate failed.

The build gate runs `next build`, which stops a running `next dev` from sharing `.next/` cleanly
on Windows — stop the dev server first, or use `--fast` while iterating.
