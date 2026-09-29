# .claude — Aegis-PV

Agents, skills, rules, tasks and schemas for building **Aegis-PV**: a Next.js 16 / React 19
solar-intelligence dashboard for GCC homes (report: `Aegis-PV.docx`). Structure ported from
`pre_agents_used/.claude_old` (conductor → specialist → validator → fix → rule-curator), with
every piece that belonged to the old e-learning/film pipeline removed and the rest rewritten
for this repo. Extra skills vendored from skills.sh sources (see **Vendored skills**).

## Decisions this setup encodes

| | |
|---|---|
| Current feature | **Live mode** on `/dashboard` + a UI quality pass to landing-page standard. See `NEXT.md` for what is parked. |
| Modes | `Demo` (4 static scenarios, unchanged data) · `Live` (Riyadh · Al-Malqa, Dhahran · KFUPM). |
| AI | Claude via `@anthropic-ai/sdk`, structured output, called only from a Route Handler. Model from `AEGIS_AI_MODEL`, default `claude-opus-5-5` at `effort: low`. |
| Weather | Open-Meteo (no key). `global_tilted_irradiance` with the site's tilt/azimuth is the twin's input. |
| Panel data | Simulated inverter from Saudi averages — see `rules/data-contract.md`. Never presented as real telemetry. |
| Refresh | Analyse on open / site switch; server cache 15 min per site; ⟳ forces a run. |
| Failure | AI fails → rules engine, badged. Weather fails → last good result, badged stale. The dashboard never breaks. |
| Evidence | Dashboard looks like a scenario; a small button opens `/dashboard/evidence?site=…` with the full payload. |
| Alerts | Normal diagnostic alerts only ≥ 85 % confidence (report §Alert design). |

## Inventory

Pipeline (who runs when): **conductor** reads `NEXT.md`/the user's request, dispatches one
specialist per step, then `validator` → `ux-reviewer` → `fix-agent` (if needed) → `rule-curator`.

### Agents (7) — `agents/*.md`, each follows `tasks/<name>.md`

| | agent | role |
|---|---|---|
| orchestr. | `conductor` | runs the work one step at a time, records state, commits, opens the PR |
| build | `ui-designer` | dashboard UI to the landing page's standard |
| build | `api-builder` | Route Handlers, Open-Meteo, digital twin, Claude call, rules fallback |
| review | `validator` | runs every gate (lint, typecheck, build, API contract, live smoke) |
| review | `ux-reviewer` | the human eye: screenshots at 5 viewports × light/dark, judged against the landing page |
| review | `fix-agent` | executes exactly one fix request |
| review | `rule-curator` | promotes a recurring fix to a rule (proposal PR, human merges) |

### Rules (5) — `rules/*.md`, format `id · rule · why`

`global` (report-faithful claims) · `nextjs16` · `ui-design` · `api-ai` · `data-contract`

### Schemas (4) — `schemas/*.schema.json`

`live-analysis-response` (what `/api/live/[site]` returns) · `live-diagnosis` (what Claude must
return) · `gate-report` · `fix-request`

### Skills

Own (written for this repo):

| skill | use |
|---|---|
| `git-handoff` | branch / commit / PR conventions with agent trailers |
| `gate-run` | one command runs lint, typecheck, build and writes gate reports |
| `visual-probe` | headless Chrome screenshots of a route at 5 viewports × 2 themes |
| `live-smoke` | hits `/api/live/{riyadh,dhahran}` and checks the response against the schema |

Vendored (unchanged, licences kept inside each folder):

| skill | source | use here |
|---|---|---|
| `react-best-practices` | vercel-labs/agent-skills | React/Next performance rules when writing components |
| `composition-patterns` | vercel-labs/agent-skills | component API design |
| `web-design-guidelines` | vercel-labs/agent-skills | UI audit (fetches the live Web Interface Guidelines) |
| `frontend-design` | anthropics/skills | distinctive, production-grade UI direction |
| `webapp-testing` | anthropics/skills | Playwright recipes for driving the app |
| `grill-me` | mattpocock/skills (AI Hero) | one-question-at-a-time idea interview (used to shape this feature) |
| `to-spec` | mattpocock/skills (AI Hero) | turn a conversation into a spec |
| `tdd` | mattpocock/skills (AI Hero) | red-green-refactor at the highest seam |
| `diagnosing-bugs` | mattpocock/skills (AI Hero) | diagnosis loop for hard bugs |
| `systematic-debugging` | obra/superpowers | root-cause-first debugging |
| `verification-before-completion` | obra/superpowers | evidence before claiming "done" |

## What was not ported (and why)

From `pre_agents_used`: every film / storyboard / script / audio / voice / Arabic / SCORM /
slide-deck agent, rule and skill (`film-*`, `scene-designer`, `scriptwriter`, `storyboarder`,
`voice-binder`, `audio-*`, `arabic-*`, `packager`, `page-assembler`, `activity-*`,
`assessment-*`, `beat-lint`, `motion-baseline`, `scorm-package`, `deck-upgrade`, the DPO
house rules). They describe a course-production pipeline that does not exist here; porting
them would mislead agents. `visual-probe` was rewritten (the old one vendored Linux `.so`
Chromium libs and does not run on this Windows box). `LEARNINGS.md` starts fresh but keeps
the old log's format and its tool-agnostic lessons.

## Layout

```
.claude/
  README.md  LEARNINGS.md  NEXT.md
  agents/  tasks/  rules/  schemas/  skills/
docs/qa/          gate reports + fix requests (git-ignored, regenerated)
```
