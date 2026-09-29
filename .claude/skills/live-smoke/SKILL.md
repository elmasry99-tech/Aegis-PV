---
name: live-smoke
description: Contract check for the live-analysis API — calls GET /api/live/riyadh and /api/live/dhahran on the running dev server and checks each response against the live-analysis-response schema (three payload groups, diagnosis fields, 85 % threshold rule, units). Use after any change under src/lib/live or src/app/api.
allowed-tools:
  - Bash
---

```
npm run dev   # running
bash .claude/skills/live-smoke/scripts/live_smoke.sh            # uses the 15-min cache
bash .claude/skills/live-smoke/scripts/live_smoke.sh --refresh  # forces a fresh AI run (costs tokens)
```

Writes `docs/qa/gates/live-smoke.json` (`gate-report` shape) and prints
`live-smoke: riyadh=ai(pass) dhahran=ai(pass)`. Assertions per site: HTTP 200; the `payload`
has `climate`, `operational`, `context`, `twin`; climate source is `open-meteo`; operational
source is `simulated`; diagnosis confidence and health score in 0–100; `isFault` true only
when confidence ≥ 85 or status is critical (rule A6); `evidence` has 2–5 items; `chart` has
hourly points; an unknown site returns 404.

`source: rules` passes only when `ANTHROPIC_API_KEY` is not set in `.env.local`.
