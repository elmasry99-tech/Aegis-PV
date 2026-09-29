# Aegis-PV learnings — continuous discovery log

Living log of conventions, gotchas and recurring fixes. **Read at the start of every task;
append a one-line entry whenever you discover something (low threshold — when in doubt, log
it).** The conductor consolidates recurring entries into `rules/` via the `rule-curator`.

Format: `- [YYYY-MM-DD] <area> — <what happened / how to apply>`

## Carried over from the previous programme (tool-agnostic)

- [2026-07-02] workflow — Long chats cause missed instructions → keep a per-item Definition-of-Done checklist and show proof (command output) before saying "done".
- [2026-07-05] headless — Headless Chrome `--screenshot` on pages with rAF loops or Google Fonts can hang; cap `--virtual-time-budget` and use a fresh `--user-data-dir` per run or Chrome writes no PNG.
- [2026-07-05] headless — To check JS errors headlessly, inject `window.onerror → document.title = "ERR:" + msg` in a probe and read the title from `--dump-dom`.
- [2026-07-03] review — Re-derive expected counts/greps after a restructure; a lower count after removing a duplicate is not a regression.

## Domain

- [2026-09-29] report — The report (`Aegis-PV.docx`) describes Aegis-PV as **proposed**. Never write UI copy that claims a trained model, field-validated accuracy or real inverter telemetry. Live mode is "simulated inverter + real weather + AI reasoning".
- [2026-09-29] soiling — Ref [3] (Al Garni 2022, Energies 15:8033): Dhahran module uncleaned 6 months lost >50 % (≈0.28 %/day); one sandstorm −20 %; overall 2–50 %; advise cleaning ≈ monthly. No Riyadh per-day figure in that paper — Riyadh's rate is an explicit assumption in `src/lib/live/sites.ts`.
- [2026-09-29] dust — Ref [2] (Energies 16:6794): efficiency 13.88 % clean → 1.83 % at 5.29 mg/cm². Use as context only; it is lab data, not a field rate.

## Technical

- [2026-09-29] open-meteo — `global_tilted_irradiance` accepts `tilt` and `azimuth` (0 = south, −90 = east). Hourly values are the **preceding-hour mean**; `current` is 15-min. Times are local when `timezone=Asia/Riyadh`.
- [2026-09-29] next16 — This repo's Next is 16.2 with breaking changes; read `node_modules/next/dist/docs/` before using an API. Route Handlers are uncached by default; there cannot be a `route.ts` beside a `page.tsx`.
- [2026-09-29] auth — `/dashboard` is a public preview (no sidebar, no login); every other `/dashboard/*` path redirects to `/login` unless `aegis_auth` is set. New public pages must be added to the preview list in `src/app/dashboard/layout.tsx`.
- [2026-09-29] next16 — `RouteContext<'/…'>` and `PageProps<'/…'>` are generated per route; a new route fails `tsc` until `npx next typegen` (or dev/build) runs. `gate-run` does this first.
- [2026-09-29] css — The unlayered `* { margin: 5px; padding: 0 }` in globals.css beats Tailwind v4's *layered* spacing utilities (`p-4`, `mb-2` silently lose). New dashboard/evidence code keeps spacing in CSS modules and resets `margin: 0` under its root class.
- [2026-09-29] lint — Baseline had 3 pre-existing `react-hooks/set-state-in-effect` errors (ThemeContext, dashboard/demo, dashboard/pipeline). For URL-derived state use `useSyncExternalStore` + "user choice ?? URL value" instead of setState in an effect.
- [2026-09-29] dev — The user usually has `next dev` already running on :3000 for this folder; a second `npm run dev` exits ("Another next dev server is already running"). Reuse :3000; don't kill it.
- [2026-09-29] headless — Windows headless Chrome floors the layout viewport at ~526 px: `--window-size=480` renders a 526 px page and crops the PNG, which *looks* like horizontal overflow. visual-probe uses 540 as its narrowest width.
- [2026-09-29] motion — Never branch framer-motion `initial` on `useReducedMotion()`: it is null on the server and true on a reduced-motion client → hydration mismatch ("attributes didn't match"). Entrances/swaps on dashboard pages are CSS keyframes (SSR-safe, off under `prefers-reduced-motion`).
- [2026-09-29] motion — `AnimatePresence mode="wait"` swaps and framer `animate={{width}}` stall under reduced motion in headless Chrome (blank ThemeToggle icon, empty diagnosis title, empty bars). ThemeToggle now cross-fades two always-mounted icons in CSS.
- [2026-09-29] debug — Next 16 dev forwards browser console errors to `.next/dev/logs/next-development.log` (`"source":"Browser","level":"ERROR"`). Diff its line count before/after a probe to catch hydration errors headlessly.
