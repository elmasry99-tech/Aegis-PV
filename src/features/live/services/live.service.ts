import { z } from 'zod';
import { LiveDiagnosisSchema, SITE_IDS, type LiveAnalysis, type SiteId } from '@/lib/live/types';

// Boundary check on our own API (rule N6): the fields the dashboard renders must be present.
const LiveAnalysisShape = z.object({
  site: z.object({ id: z.enum(SITE_IDS), name: z.string(), city: z.string(), lat: z.number(), lon: z.number() }),
  generatedAt: z.string(),
  source: z.enum(['ai', 'rules']),
  model: z.string().nullable(),
  stale: z.boolean(),
  fallbackReason: z.string().nullable(),
  isDaylight: z.boolean(),
  metrics: z.record(z.string(), z.number()),
  chart: z.array(z.object({ time: z.string(), expected: z.number(), actual: z.number() })),
  diagnosis: LiveDiagnosisSchema,
  payload: z.object({ climate: z.unknown(), operational: z.unknown(), context: z.unknown(), twin: z.unknown() }),
});

export async function fetchLiveAnalysis(site: SiteId, refresh = false): Promise<LiveAnalysis> {
  const res = await fetch(`/api/live/${site}${refresh ? '?refresh=1' : ''}`, { cache: 'no-store' });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body as { error?: string } | null)?.error ?? `Live analysis failed (${res.status})`;
    throw new Error(message);
  }
  const parsed = LiveAnalysisShape.safeParse(body);
  if (!parsed.success) throw new Error('Live analysis returned an unexpected shape');
  return body as LiveAnalysis;
}
