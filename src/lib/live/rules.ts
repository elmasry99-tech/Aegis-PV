import { lossFactors } from './twin';
import type { LiveDiagnosis, LivePayload, SiteProfile } from './types';

export const ALERT_CONFIDENCE_THRESHOLD = 85; // report §Alert design

const clamp = (v: number, lo = 0, hi = 100) => Math.round(Math.min(hi, Math.max(lo, v)));

/**
 * Deterministic "Rules layer" from the report: used when the AI is unavailable, and as the
 * sanity net for AI output. Checks known signatures in the expected-vs-actual gap.
 */
export function rulesDiagnosis(site: SiteProfile, payload: LivePayload): LiveDiagnosis {
  const { hourly, gapPct } = payload.twin;
  const producing = hourly.filter((p) => p.expectedKw > 0.3);
  const dataQuality = producing.length >= 6 ? 95 : producing.length >= 3 ? 75 : 50;
  const ratios = producing.map((p) => p.actualKw / p.expectedKw);
  const median = ratios.length ? [...ratios].sort((a, b) => a - b)[Math.floor(ratios.length / 2)] : 1;

  // Sudden step / total loss while sun is up → equipment (report: "sudden step down or complete loss").
  const dead = producing.find((p) => p.actualKw < p.expectedKw * 0.4);
  if (dead) {
    return normalizeDiagnosis({
      title: 'Possible Equipment Fault',
      cause: 'equipment',
      summary: 'Output fell far below what the weather supports, which looks like a string or inverter problem rather than dust.',
      confidence: 80,
      status: 'critical',
      severity: 'critical',
      isFault: true,
      healthScore: clamp(40 - gapPct / 2),
      affectedArea: 'Inverter / string',
      firstSeen: `${dead.time.slice(11, 16)} on ${payload.twin.analysisDate}`,
      action: 'Do not open the inverter or wiring. Contact a qualified solar technician to inspect the strings and inverter.',
      actionAudience: 'technician',
      priority: 'urgent',
      evidence: [
        `At ${dead.time.slice(11, 16)} actual output was ${dead.actualKw} kW vs ${dead.expectedKw} kW expected`,
        `Daily gap ${gapPct}% with irradiance present`,
      ],
      confidenceBreakdown: { modelProbability: 80, dataQuality, eventDuration: 70 },
      estimatedLossPct: gapPct,
    });
  }

  // Repeating dip at one hour while the rest tracks the baseline → shading signature.
  const dip = producing.find((p) => p.actualKw / p.expectedKw < median - 0.15);
  if (dip) {
    return normalizeDiagnosis({
      title: 'Partial Shading Likely',
      cause: 'shading',
      summary: 'Output dips at one time of day while the rest of the day follows the expected curve — typical of an object casting shade.',
      confidence: 75,
      status: 'warning',
      severity: 'medium',
      isFault: false,
      healthScore: clamp(90 - gapPct * 2),
      affectedArea: 'Part of the array',
      firstSeen: `${dip.time.slice(11, 16)} today`,
      action: 'From the ground, check what could shade the panels around that time (tank, antenna, tree) and note it.',
      actionAudience: 'homeowner',
      priority: 'medium',
      evidence: [`Output ratio at ${dip.time.slice(11, 16)} is ${Math.round((dip.actualKw / dip.expectedKw) * 100)}% vs ${Math.round(median * 100)}% for the rest of the day`, `Daily gap ${gapPct}%`],
      confidenceBreakdown: { modelProbability: 70, dataQuality, eventDuration: 60 },
      estimatedLossPct: gapPct,
    });
  }

  const { degradation, soiling } = lossFactors(site);
  const soilingPct = Math.round(soiling * 1000) / 10;
  const degradationPct = Math.round(degradation * 1000) / 10;
  const peakCell = Math.max(0, ...hourly.map((p) => p.cellTempC));

  if (gapPct < 3) {
    return normalizeDiagnosis({
      title: 'System Optimal',
      cause: 'none',
      summary: 'The panels are producing what today’s sunshine and heat allow. No action needed.',
      confidence: 88,
      status: 'healthy',
      severity: 'none',
      isFault: false,
      healthScore: clamp(98 - gapPct * 2),
      affectedArea: 'None',
      firstSeen: '—',
      action: 'No maintenance required. Keep your regular cleaning routine.',
      actionAudience: 'none',
      priority: 'none',
      evidence: [`Daily gap only ${gapPct}% vs the weather-adjusted baseline`, `Peak cell temperature ${peakCell} °C is handled by the baseline`],
      confidenceBreakdown: { modelProbability: 85, dataQuality, eventDuration: 90 },
      estimatedLossPct: gapPct,
    });
  }

  if (soilingPct >= degradationPct && soilingPct >= 2.5) {
    const days = site.daysSinceCleaning;
    return normalizeDiagnosis({
      title: 'Dust Build-up Likely',
      cause: 'soiling',
      summary: `Output is ${gapPct}% below the weather-adjusted baseline, spread evenly across the day — the gradual pattern dust causes after ${days} days without cleaning.`,
      confidence: clamp(70 + days),
      status: 'warning',
      severity: gapPct > 8 ? 'medium' : 'low',
      isFault: false,
      healthScore: clamp(95 - gapPct * 2.5),
      affectedArea: 'Whole array',
      firstSeen: `Gradual over ~${days} days`,
      action: gapPct > 8 ? 'Schedule a panel cleaning within 48 hours.' : 'Plan a panel cleaning within the next 7 days.',
      actionAudience: 'homeowner',
      priority: gapPct > 8 ? 'high' : 'medium',
      evidence: [
        `Gap is uniform across daylight hours (${Math.round(median * 100)}% of expected), not a sudden step`,
        `${days} days since cleaning at ~${site.soilingRatePctPerDay}%/day ≈ ${soilingPct}% dust loss`,
        `Age degradation explains ~${degradationPct}% of the ${gapPct}% gap`,
      ],
      confidenceBreakdown: { modelProbability: 75, dataQuality, eventDuration: clamp(50 + days * 3) },
      estimatedLossPct: gapPct,
    });
  }

  return normalizeDiagnosis({
    title: 'Normal Ageing',
    cause: 'degradation',
    summary: `Output is ${gapPct}% below a brand-new system, which matches normal panel ageing for a ${site.ageYears}-year-old array.`,
    confidence: 78,
    status: 'healthy',
    severity: 'low',
    isFault: false,
    healthScore: clamp(95 - gapPct * 2),
    affectedArea: 'Whole array',
    firstSeen: `Gradual over ${site.ageYears} years`,
    action: 'No action needed now. Keep monthly cleaning to avoid adding dust losses on top.',
    actionAudience: 'none',
    priority: 'low',
    evidence: [`Expected age degradation ≈ ${degradationPct}%`, `Estimated dust loss only ${soilingPct}%`],
    confidenceBreakdown: { modelProbability: 75, dataQuality, eventDuration: 90 },
    estimatedLossPct: gapPct,
  });
}

/** Clamps numbers and enforces the 85 % alert threshold (rule A6) on any diagnosis. */
export function normalizeDiagnosis(d: LiveDiagnosis): LiveDiagnosis {
  const confidence = clamp(d.confidence);
  const critical = d.status === 'critical';
  const isFault = d.isFault && (confidence >= ALERT_CONFIDENCE_THRESHOLD || critical);
  return {
    ...d,
    confidence,
    isFault,
    healthScore: clamp(d.healthScore),
    evidence: d.evidence.filter(Boolean).slice(0, 5),
    confidenceBreakdown: {
      modelProbability: clamp(d.confidenceBreakdown.modelProbability),
      dataQuality: clamp(d.confidenceBreakdown.dataQuality),
      eventDuration: clamp(d.confidenceBreakdown.eventDuration),
    },
    estimatedLossPct: Math.round(Math.max(0, d.estimatedLossPct) * 10) / 10,
  };
}
