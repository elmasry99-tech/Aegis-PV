import 'server-only';
import { AI_MODEL, aiDiagnosis, AiUnavailableError } from './ai';
import { dedupe, getFresh, getLastGood, put } from './cache';
import { buildPayload, chartFrom, metricsFrom } from './payload';
import { normalizeDiagnosis, rulesDiagnosis } from './rules';
import { SITE_PROFILES } from './sites';
import type { LiveAnalysis, SiteId } from './types';
import { fetchWeather, WeatherError } from './weather';

export class LiveUnavailableError extends Error {}

/** Ingestion → digital twin → AI (or rules) → dashboard-ready result, with cache and fallbacks (rule A4). */
export async function analyzeSite(siteId: SiteId, { refresh = false } = {}): Promise<LiveAnalysis> {
  if (!refresh) {
    const cached = getFresh(siteId);
    if (cached) return cached;
  }
  return dedupe(siteId, () => runAnalysis(siteId));
}

async function runAnalysis(siteId: SiteId): Promise<LiveAnalysis> {
  const site = SITE_PROFILES[siteId];

  let weather;
  try {
    weather = await fetchWeather(site);
  } catch (e) {
    const last = getLastGood(siteId);
    const reason = e instanceof WeatherError ? e.message : 'weather unavailable';
    console.warn(`[live] ${siteId} weather failed: ${reason}`);
    if (last) return { ...last, stale: true, fallbackReason: reason };
    throw new LiveUnavailableError(`Live weather is unavailable right now (${reason}). Try again in a minute.`);
  }

  const payload = buildPayload(site, weather);
  const rules = rulesDiagnosis(site, payload);

  let source: LiveAnalysis['source'] = 'ai';
  let fallbackReason: string | null = null;
  let diagnosis = rules;
  const started = Date.now();
  try {
    const ai = normalizeDiagnosis(await aiDiagnosis(payload));
    // Keep the card honest if the model under-delivers evidence.
    diagnosis = ai.evidence.length >= 2 ? ai : { ...ai, evidence: [...ai.evidence, ...rules.evidence].slice(0, 5) };
  } catch (e) {
    source = 'rules';
    fallbackReason = e instanceof AiUnavailableError ? e.message : 'AI unavailable';
    console.warn(`[live] ${siteId} AI fallback: ${fallbackReason}`);
  }
  console.info(`[live] ${siteId} source=${source} ${Date.now() - started}ms`);

  const result: LiveAnalysis = {
    site: { id: site.id, name: site.name, city: site.city, lat: site.lat, lon: site.lon },
    generatedAt: new Date().toISOString(),
    source,
    model: source === 'ai' ? AI_MODEL : null,
    stale: false,
    fallbackReason,
    isDaylight: payload.twin.isDaylight,
    metrics: metricsFrom(site, weather, payload),
    chart: chartFrom(payload),
    diagnosis,
    payload,
  };
  put(siteId, result);
  return result;
}
