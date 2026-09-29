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
- [2026-09-29] css — `globals.css` sets `* { margin: 5px }`. Tailwind spacing utilities override it, but raw elements inside new components inherit 5 px margins; set `m-0` where layout must be exact.
