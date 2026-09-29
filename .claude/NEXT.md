# Parked — measured and ready, not started

The current scope is **`/dashboard` UI pass + Live mode + evidence page** (see `README.md`).
Everything below was agreed as out of scope for now.

| item | why parked | notes |
|---|---|---|
| UI pass for `/dashboard/{diagnostics,pipeline,sites,impact,demo}` | agreed: main dashboard only | reuse the new dashboard primitives (`GlassCard`, `HealthRing`, `ModeToggle`) |
| Live data on `/dashboard/diagnostics` | same | it reads the same `DashboardView` if wired to `useDashboardView()` |
| Deploy to Vercel | agreed: local only | module-level cache in `src/lib/live/cache.ts` is per-instance; use a shared store (KV) before deploying |
| Real inverter adapter (Modbus/REST) | report Phase 1 | replace `simulateInverter()` behind the same `OperationalPoint` type (`src/lib/live/types.ts`) |
| Trained models (Isolation Forest / Random Forest) | report Phase 2 needs labelled GCC data | the rules engine in `src/lib/live/rules.ts` is the report's "Rules layer" stand-in |
| Auto-refresh every 15 min | agreed: on open + manual ⟳ | react-query `refetchInterval` is a one-line change |
| Real authentication | hard-coded `admin/admin` in `src/lib/auth.ts` | report Phase 3 |
| Riyadh-specific soiling rate | not in ref [3] | find a central-region field study and replace the assumption |
| Automated tests | no test runner in the repo yet | `tdd` skill is vendored; the twin and rules engine are pure functions and the first seam |
| Pre-existing lint errors (3) | outside this scope; baseline before the live-dashboard work | `react-hooks/set-state-in-effect` in `ThemeContext.tsx:25`, `dashboard/demo/page.tsx:102`, `dashboard/pipeline/page.tsx:542`; 2 warnings in `dashboard/sites/page.tsx`. Fix pattern in LEARNINGS (useSyncExternalStore). |
| Verify the AI path with a real key | no key on the dev machine during the build | add `ANTHROPIC_API_KEY` to `.env.local`, then `bash .claude/skills/live-smoke/scripts/live_smoke.sh --refresh` must print `riyadh=ai(pass) dhahran=ai(pass)` |
