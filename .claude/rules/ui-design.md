# Rules · UI design

Scope: `src/app/dashboard/**`, `src/features/dashboard/**`, shared components. The reference
for quality is the landing page (`src/app/page.tsx` + `src/features/landing/**`). Format: `id · rule · why`.

- **U1 · Tokens only.** Colours come from the CSS variables / Tailwind theme in `globals.css` (`brand-emerald`, `brand-cyan`, `brand-yellow`, `brand-red`, `bg-*`, `text-*`, `border-*`). No raw hex in components except inside chart libraries, where `COLORS` from `lib/constants` is used. *Why:* light/dark parity.
- **U2 · Both themes.** Every new surface is checked in light and dark (`data-theme="dark"` on `<html>`). No `rgba(255,255,255,…)` strokes that vanish in light mode. *Why:* the old chart grid was invisible in light mode.
- **U3 · Landing-page language.** Cards use the `glass` + `spotlight-card` treatment with `useSpotlight`; entrances use framer-motion `opacity/y` with ≤ 0.5 s and staggered `delay`; headings use Outfit (`h1–h6`), numbers animate. *Why:* agreed quality bar.
- **U4 · Status colour = meaning.** emerald = healthy, yellow = warning, red = critical, cyan = informational/live. Never use red for decoration. *Why:* the report's severity levels.
- **U5 · Mode is always visible.** The header shows which mode (Demo/Live), which site, when it was updated, and the source (AI / Rules / stale). *Why:* users must know whether data is live.
- **U6 · Same panels, both modes.** Live and Demo render the same components from one `DashboardView` shape; no live-only layout. *Why:* agreed spec — "it should be as scenarios".
- **U7 · Units are kW / kWh.** Residential scale. *Why:* report targets homes; the old "MW" label contradicted the kW chart.
- **U8 · Responsive.** Works at 480, 768, 1024, 1280, 1440 widths with no horizontal scroll (visual-probe covers ≥ 540; check 480 with Playwright `webapp-testing` or DevTools device mode). *Why:* ux-reviewer viewports.
- **U9 · Accessible.** Interactive controls are `<button>`/`<a>` with visible focus and `aria-pressed`/`aria-label` where icon-only; motion respects `prefers-reduced-motion`. *Why:* web-design-guidelines.
