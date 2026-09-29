import type { ClimatePoint, OperationalPoint, SiteProfile } from './types';

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

export const TWIN_METHOD =
  'Expected AC kW = kWp × GTI/1000 × (1 + γ·(Tcell − 25 °C)) × η_inverter, with Tcell = Tambient + GTI/800 × (NOCT − 20). ' +
  'GTI is Open-Meteo plane-of-array irradiance for the array tilt/azimuth. Age degradation and soiling are NOT in the baseline, so they appear in the gap.';

/** NOCT cell-temperature model (wind not modelled). */
export function cellTemperature(site: SiteProfile, p: Pick<ClimatePoint, 'ambientTempC' | 'gti'>): number {
  return round(p.ambientTempC + (p.gti / 800) * (site.noctC - 20), 1);
}

/** Digital twin: expected AC power of a clean, new system under this weather (rule D5). */
export function expectedPowerKw(site: SiteProfile, p: Pick<ClimatePoint, 'ambientTempC' | 'gti'>): number {
  if (p.gti <= 0) return 0;
  const tCell = cellTemperature(site, p);
  const thermal = 1 + (site.tempCoeffPctPerC / 100) * (tCell - 25);
  return round(Math.max(0, site.arrayKwp * (p.gti / 1000) * thermal * (site.inverterEfficiencyPct / 100)));
}

/** Fraction of output left after age degradation and dust since the last cleaning. */
export function lossFactors(site: SiteProfile) {
  const degradation = (site.degradationPctPerYear * site.ageYears) / 100;
  const soiling = Math.min(0.6, (site.soilingRatePctPerDay * site.daysSinceCleaning) / 100);
  return { degradation, soiling, remaining: (1 - degradation) * (1 - soiling) };
}

/** Deterministic ±amplitude jitter so simulated readings look measured but stay reproducible. */
function jitter(seed: string, amplitude: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return ((((h >>> 0) % 10_000) / 10_000) * 2 - 1) * amplitude;
}

/**
 * Simulated inverter (rule D3): the twin's expected output × Saudi-average age degradation ×
 * soiling since the last cleaning × small measurement noise. Not real telemetry.
 */
export function simulateInverter(site: SiteProfile, p: ClimatePoint): OperationalPoint {
  const expected = expectedPowerKw(site, p);
  const { remaining } = lossFactors(site);
  const acPowerKw = expected > 0 ? round(expected * remaining * (1 + jitter(`${site.id}${p.time}`, 0.015))) : 0;
  const dcPowerKw = round(acPowerKw / (site.inverterEfficiencyPct / 100));
  const producing = p.gti > 20 && dcPowerKw > 0;
  const tCell = cellTemperature(site, p);
  const dcVoltageV = producing
    ? round(site.modulesPerString * site.moduleVmpV * (1 + (site.voltageTempCoeffPctPerC / 100) * (tCell - 25)), 1)
    : 0;
  const perString = producing ? (dcPowerKw * 1000) / site.strings / dcVoltageV : 0;
  const stringCurrentA = Array.from({ length: site.strings }, (_, i) =>
    round(perString * (1 + jitter(`${site.id}${p.time}s${i}`, 0.005)), 2)
  );
  return {
    time: p.time,
    dcVoltageV,
    stringCurrentA,
    dcPowerKw,
    acPowerKw,
    acVoltageV: producing ? round(site.acVoltageV * (1 + jitter(`${site.id}${p.time}ac`, 0.01)), 1) : 0,
  };
}
