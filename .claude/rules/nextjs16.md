# Rules · Next.js 16 / React 19

Scope: all code under `src/`. Format: `id · rule · why`.

- **N1 · Read the bundled docs first.** Before using any Next API, read the matching page in `node_modules/next/dist/docs/01-app/`. Training-data Next is stale. *Why:* AGENTS.md.
- **N2 · Server-only work in Route Handlers.** External calls that need secrets (Claude) or should be cached (Open-Meteo) live in `src/app/api/**/route.ts` or modules imported only from there. Such modules start with `import 'server-only'`. *Why:* keep `ANTHROPIC_API_KEY` off the client bundle.
- **N3 · Dynamic params are promises.** Route Handler `ctx.params` and page `searchParams` are `Promise`s — `await` them; type with `RouteContext<'/api/live/[site]'>` / `PageProps`. *Why:* Next 16 API.
- **N4 · No `route.ts` next to a `page.tsx`.** APIs go under `src/app/api/`. *Why:* route resolution conflict.
- **N5 · Client data via react-query.** Client components fetch through a hook in `src/features/*/hooks/` using `@tanstack/react-query`; no `useEffect` fetches. *Why:* existing convention (`useDiagnosis`, `useSites`).
- **N6 · Validate at the boundary.** Every external response (Open-Meteo, Claude, our own API on the client) is parsed with a `zod` schema before use. *Why:* never trust shape.
- **N7 · Feature folders.** New code follows `src/features/<feature>/{components,hooks,services,types}` and `src/lib/<domain>/`; shared primitives in `src/shared/components/`. *Why:* existing architecture.
- **N8 · `useSearchParams` needs Suspense.** Prefer reading `searchParams` in a server `page.tsx` and passing props to a client component. *Why:* build fails on missing Suspense boundary.
