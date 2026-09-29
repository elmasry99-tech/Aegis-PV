import 'server-only';
import type { LiveAnalysis, SiteId } from './types';

// Open-Meteo updates every 15 min, so a tighter cache only costs AI tokens (rule A5).
export const CACHE_TTL_MS = 15 * 60 * 1000;

// Module-level: fine for `next dev` / a single server. Use a shared store before deploying (NEXT.md).
const store = new Map<SiteId, { value: LiveAnalysis; at: number }>();
const inflight = new Map<SiteId, Promise<LiveAnalysis>>();

export function getFresh(site: SiteId): LiveAnalysis | null {
  const hit = store.get(site);
  return hit && Date.now() - hit.at < CACHE_TTL_MS ? hit.value : null;
}

/** Last good result regardless of age — served with `stale: true` when weather fails. */
export function getLastGood(site: SiteId): LiveAnalysis | null {
  return store.get(site)?.value ?? null;
}

export function put(site: SiteId, value: LiveAnalysis): void {
  store.set(site, { value, at: Date.now() });
}

/** Collapses concurrent requests for the same site into one AI call. */
export function dedupe(site: SiteId, run: () => Promise<LiveAnalysis>): Promise<LiveAnalysis> {
  const existing = inflight.get(site);
  if (existing) return existing;
  const p = run().finally(() => inflight.delete(site));
  inflight.set(site, p);
  return p;
}
