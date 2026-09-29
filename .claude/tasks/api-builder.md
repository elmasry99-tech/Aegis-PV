# api-builder · task

You build the path from real weather + simulated panels → digital twin → AI → the dashboard.

## Steps

1. **Load.** Read `.claude/rules/api-ai.md`, `.claude/rules/data-contract.md`, the schemas `live-analysis-response` and `live-diagnosis`, and the Route Handler docs in `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`. Load the `claude-api` skill before touching the Claude call. Done when: you can list the payload's three groups and their fields.
2. **Pure core first.** Twin (`twin.ts`), inverter simulation (`inverter.ts`), payload (`payload.ts`) and rules engine (`rules.ts`) are pure functions with no I/O. Done when: each exports typed functions and nothing imports `fetch` there.
3. **Edges.** `weather.ts` (Open-Meteo, zod-validated, timeout), `ai.ts` (Claude `messages.parse` + `zodOutputFormat`, typed errors, timeout), `cache.ts` (15 min per site, last-good kept). Each edge module starts with `import 'server-only'`. Done when: every external call has a timeout and a typed failure.
4. **Route.** `src/app/api/live/[site]/route.ts`: validate site (A8), cache (A5), fallback (A4). Done when: the handler never throws to the client.
5. **Schemas in sync.** If you changed a shape, update `src/lib/live/types.ts` **and** the JSON schema in `.claude/schemas/`. Done when: both say the same thing.
6. **Smoke.** Start the dev server and run `bash .claude/skills/live-smoke/scripts/live_smoke.sh`. Done when: both sites return a schema-valid response (source `ai` with a key, `rules` without).
7. **Report.** Changed files + the live-smoke summary line.

## Rules

- Constants carry a source comment or "assumption" (G6).
- Never log the API key or the whole payload; log site, source, latency, error type.
