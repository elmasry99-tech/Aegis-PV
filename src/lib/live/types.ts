import { z } from 'zod';

/** Mirrors .claude/schemas/live-diagnosis.schema.json — change both together. */
export const LiveDiagnosisSchema = z.object({
  title: z.string().describe('At most 5 words, e.g. "Soiling Detected" or "System Optimal"'),
  cause: z.enum(['none', 'soiling', 'shading', 'thermal', 'degradation', 'equipment', 'data-quality']),
  summary: z.string().describe('1-2 plain-language sentences for a non-technical homeowner'),
  confidence: z.number().describe('whole number 0-100'),
  status: z.enum(['healthy', 'warning', 'critical']),
  severity: z.enum(['none', 'low', 'medium', 'high', 'critical']),
  isFault: z.boolean().describe('true only when confidence >= 85, or status is critical'),
  healthScore: z.number().describe('whole number 0-100, from current performance, open faults and data quality'),
  affectedArea: z.string().describe('e.g. "Whole array", "String 2", "None"'),
  firstSeen: z.string().describe('human time, e.g. "Gradual over ~14 days" or "10:00 today"'),
  action: z.string().describe('one clear next step'),
  actionAudience: z.enum(['homeowner', 'technician', 'none']),
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']),
  evidence: z.array(z.string()).describe('2-5 short bullets naming the data that supported the decision'),
  confidenceBreakdown: z.object({
    modelProbability: z.number().describe('whole number 0-100'),
    dataQuality: z.number().describe('whole number 0-100'),
    eventDuration: z.number().describe('whole number 0-100'),
  }),
  estimatedLossPct: z.number().describe('share of expected energy lost today, percent'),
});
export type LiveDiagnosis = z.infer<typeof LiveDiagnosisSchema>;

export const SITE_IDS = ['riyadh', 'dhahran'] as const;
export type SiteId = (typeof SITE_IDS)[number];

export interface SiteProfile {
  id: SiteId;
  name: string;
  city: string;
  lat: number;
  lon: number;
  arrayKwp: number;
  moduleWp: number;
  modulesPerString: number;
  strings: number;
  moduleEfficiencyPct: number;
  moduleVmpV: number;
  tempCoeffPctPerC: number;
  voltageTempCoeffPctPerC: number;
  noctC: number;
  tiltDeg: number;
  /** compass degrees, 180 = south */
  azimuthDeg: number;
  ageYears: number;
  degradationPctPerYear: number;
  daysSinceCleaning: number;
  soilingRatePctPerDay: number;
  inverterEfficiencyPct: number;
  acVoltageV: number;
  sources: Record<string, string>;
}

export interface ClimatePoint {
  time: string;
  ghi: number;
  dni: number;
  dhi: number;
  gti: number;
  ambientTempC: number;
  humidityPct: number;
  windKmh: number;
  cloudCoverPct: number;
}

export interface WeatherSnapshot {
  current: ClimatePoint & { isDay: boolean };
  /** hourly points for the analysis day (local time, preceding-hour means) */
  hourly: ClimatePoint[];
  analysisDate: string;
}

export interface OperationalPoint {
  time: string;
  dcVoltageV: number;
  stringCurrentA: number[];
  dcPowerKw: number;
  acPowerKw: number;
  acVoltageV: number;
}

export interface TwinPoint {
  time: string;
  cellTempC: number;
  expectedKw: number;
  actualKw: number;
}

/** Exactly what is sent to the AI — rules/data-contract.md. */
export interface LivePayload {
  climate: { source: 'open-meteo'; current: WeatherSnapshot['current']; hourly: ClimatePoint[] };
  operational: {
    source: 'simulated';
    note: string;
    current: OperationalPoint & { energyTodayKwh: number };
    hourly: OperationalPoint[];
  };
  context: {
    location: { name: string; city: string; lat: number; lon: number; timezone: string };
    system: Omit<SiteProfile, 'id' | 'name' | 'city' | 'lat' | 'lon' | 'sources'>;
    sources: Record<string, string>;
  };
  twin: {
    method: string;
    analysisDate: string;
    localTime: string;
    isDaylight: boolean;
    hourly: TwinPoint[];
    expectedEnergyKwh: number;
    actualEnergyKwh: number;
    gapPct: number;
  };
}

export interface LiveMetrics {
  currentOutputKw: number;
  expectedOutputKw: number;
  energyTodayKwh: number;
  expectedEnergyTodayKwh: number;
  gapPct: number;
  ghi: number;
  gti: number;
  ambientTempC: number;
  cellTempC: number;
  humidityPct: number;
}

export interface ChartPoint {
  time: string;
  expected: number;
  actual: number;
}

/** Mirrors .claude/schemas/live-analysis-response.schema.json. */
export interface LiveAnalysis {
  site: { id: SiteId; name: string; city: string; lat: number; lon: number };
  generatedAt: string;
  source: 'ai' | 'rules';
  model: string | null;
  stale: boolean;
  fallbackReason: string | null;
  isDaylight: boolean;
  metrics: LiveMetrics;
  chart: ChartPoint[];
  diagnosis: LiveDiagnosis;
  payload: LivePayload;
}
