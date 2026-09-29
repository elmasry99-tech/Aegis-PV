import type { SiteId, SiteProfile } from './types';

export const SITE_TIMEZONE = 'Asia/Riyadh';

const DEGRADATION_SOURCE =
  '0.8 %/yr: assumption — typical c-Si field degradation in hot-desert climates (above the ~0.5 %/yr temperate median).';
const MODULE_SOURCE =
  'Mono-PERC 500 W, 20.5 % efficiency, −0.35 %/°C power and −0.28 %/°C voltage coefficients, NOCT 45 °C: typical datasheet values (assumption).';

/**
 * Two simulated homes with typical Saudi residential systems (agreed profiles).
 * Every rate carries its source (rule G6).
 */
export const SITE_PROFILES: Record<SiteId, SiteProfile> = {
  riyadh: {
    id: 'riyadh',
    name: 'Al-Malqa Residence',
    city: 'Riyadh',
    lat: 24.806,
    lon: 46.617,
    arrayKwp: 6.0,
    moduleWp: 500,
    modulesPerString: 6,
    strings: 2,
    moduleEfficiencyPct: 20.5,
    moduleVmpV: 41.5,
    tempCoeffPctPerC: -0.35,
    voltageTempCoeffPctPerC: -0.28,
    noctC: 45,
    tiltDeg: 25,
    azimuthDeg: 180,
    ageYears: 4,
    degradationPctPerYear: 0.8,
    daysSinceCleaning: 14,
    soilingRatePctPerDay: 0.25,
    inverterEfficiencyPct: 97,
    acVoltageV: 230,
    sources: {
      soiling:
        '0.25 %/day: assumption — Al Garni 2022 (Energies 15:8033, report ref [3]) reports central Saudi Arabia as less soiling-limited than the coast but gives no Riyadh per-day rate.',
      degradation: DEGRADATION_SOURCE,
      module: MODULE_SOURCE,
    },
  },
  dhahran: {
    id: 'dhahran',
    name: 'KFUPM Campus Home',
    city: 'Dhahran',
    lat: 26.307,
    lon: 50.146,
    arrayKwp: 5.0,
    moduleWp: 500,
    modulesPerString: 5,
    strings: 2,
    moduleEfficiencyPct: 20.5,
    moduleVmpV: 41.5,
    tempCoeffPctPerC: -0.35,
    voltageTempCoeffPctPerC: -0.28,
    noctC: 45,
    tiltDeg: 26,
    azimuthDeg: 180,
    ageYears: 2,
    degradationPctPerYear: 0.8,
    daysSinceCleaning: 6,
    soilingRatePctPerDay: 0.28,
    inverterEfficiencyPct: 97,
    acVoltageV: 230,
    sources: {
      soiling:
        '0.28 %/day: Al Garni 2022 (Energies 15:8033, report ref [3]) — a Dhahran module left uncleaned for 6 months lost >50 % of its output (≈50 % / 180 days).',
      degradation: DEGRADATION_SOURCE,
      module: MODULE_SOURCE,
    },
  },
};

export function isSiteId(value: string): value is SiteId {
  return value in SITE_PROFILES;
}
