---
name: visual-probe
description: Screenshot an Aegis-PV route with headless Chrome at five viewports (540, 768, 1280, 1440, 1600 wide) in light and dark theme, for the ux-reviewer to open with Read. Use after any UI change; needs the dev server running.
allowed-tools:
  - Bash
---

```
npm run dev                                                    # in another terminal / background
bash .claude/skills/visual-probe/scripts/probe.sh /dashboard demo
bash .claude/skills/visual-probe/scripts/probe.sh "/dashboard?mode=live&site=dhahran" live-dhahran
bash .claude/skills/visual-probe/scripts/probe.sh "/dashboard/evidence?site=riyadh" evidence
```

Writes `docs/qa/visual/<label>/<width>-<theme>.png` and `manifest.txt` (one image per line,
in review order). Theme is forced with the `?theme=dark|light` query the root layout honours
(it is saved to that browser profile's localStorage; each shot uses a fresh profile). Base URL defaults to `http://localhost:3000`; override with `BASE_URL`.

Uses Chrome (or Edge) `--headless=new` with a fresh `--user-data-dir` per shot and a
`--virtual-time-budget` so framer-motion entrances finish and live data has loaded
(see LEARNINGS 2026-07-05 headless). Set `BUDGET_MS` (default 9000) higher for a cold
live-mode request.
