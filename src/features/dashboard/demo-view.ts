import { CHART_ACTUAL_DATA, CHART_EXPECTED_DATA, CHART_TIME_LABELS, SCENARIO_LABELS } from '@/lib/constants';
import { CURRENT_OUTPUT, DIAGNOSES } from '@/lib/mock-data';
import { STATIC_METRIC_VALUES } from '@/lib/mock-data/metrics';
import type { LiveDiagnosis } from '@/lib/live/types';
import type { ScenarioKey } from '@/shared/types';
import type { DashboardView } from './types';

// The report's fault-card fields for each static scenario. Title/action/confidence come from
// the existing DIAGNOSES so the demo text is unchanged.
const DEMO_DETAILS: Record<ScenarioKey, Omit<LiveDiagnosis, 'title' | 'action' | 'confidence' | 'isFault' | 'status'>> = {
  healthy: {
    cause: 'none',
    summary: 'Actual output tracks the weather-adjusted baseline all day.',
    severity: 'none',
    healthScore: 97,
    affectedArea: 'None',
    firstSeen: '—',
    actionAudience: 'none',
    priority: 'none',
    evidence: ['Actual matches expected within 1 % at every hour', 'No step changes or repeating dips'],
    confidenceBreakdown: { modelProbability: 98, dataQuality: 99, eventDuration: 99 },
    estimatedLossPct: 0,
  },
  dust: {
    cause: 'soiling',
    summary: 'A steady, even loss across the whole day — the gradual pattern dust causes.',
    severity: 'medium',
    healthScore: 78,
    affectedArea: 'Array B',
    firstSeen: 'Gradual over ~10 days',
    actionAudience: 'homeowner',
    priority: 'high',
    evidence: ['Output 12–17 % below baseline at every daylight hour', 'Irradiance and temperature explain none of the gap', 'Loss has grown steadily since the last cleaning'],
    confidenceBreakdown: { modelProbability: 91, dataQuality: 96, eventDuration: 90 },
    estimatedLossPct: 15,
  },
  shading: {
    cause: 'shading',
    summary: 'Output drops around mid-morning and recovers after — the same shape each day.',
    severity: 'medium',
    healthScore: 82,
    affectedArea: 'Panel C4',
    firstSeen: '10:00 daily',
    actionAudience: 'homeowner',
    priority: 'medium',
    evidence: ['Dip to 36 % of expected at 10:00, full output at 12:00', 'Same dip seen on previous days'],
    confidenceBreakdown: { modelProbability: 86, dataQuality: 95, eventDuration: 84 },
    estimatedLossPct: 9,
  },
  hardware: {
    cause: 'equipment',
    summary: 'Output fell to zero at noon while the sun was still strong — an electrical fault, not weather.',
    severity: 'critical',
    healthScore: 18,
    affectedArea: 'String 3 / inverter',
    firstSeen: '12:00 today',
    actionAudience: 'technician',
    priority: 'urgent',
    evidence: ['Sudden step from 4.2 kW to 0 kW at 12:00', 'Irradiance still above 800 W/m²', 'String 3 current reads 0 A'],
    confidenceBreakdown: { modelProbability: 98, dataQuality: 97, eventDuration: 95 },
    estimatedLossPct: 58,
  },
};

const sum = (xs: readonly number[]) => Math.round(xs.reduce((a, b) => a + b, 0) * 2 * 10) / 10; // 2-hour steps

export function demoView(scenario: ScenarioKey): DashboardView {
  const d = DIAGNOSES[scenario];
  const actual = CHART_ACTUAL_DATA[scenario] ?? CHART_EXPECTED_DATA;
  const expectedEnergy = sum(CHART_EXPECTED_DATA);
  const actualEnergy = sum(actual);
  return {
    mode: 'demo',
    key: scenario,
    title: 'AI Operations Center',
    subtitle: `Riyadh residential · ${SCENARIO_LABELS[scenario].replace('Scenario: ', '')}`,
    source: 'demo',
    model: null,
    stale: false,
    fallbackReason: null,
    updatedAt: null,
    isDaylight: true,
    metrics: {
      currentOutputKw: CURRENT_OUTPUT[scenario],
      expectedOutputKw: STATIC_METRIC_VALUES.expectedOutput,
      energyTodayKwh: actualEnergy,
      expectedEnergyTodayKwh: expectedEnergy,
      gapPct: Math.round(((expectedEnergy - actualEnergy) / expectedEnergy) * 1000) / 10,
      ghi: 812,
      ambientTempC: 41,
      cellTempC: 63,
    },
    chart: CHART_TIME_LABELS.map((time, i) => ({ time, expected: CHART_EXPECTED_DATA[i], actual: actual[i] })),
    diagnosis: { ...DEMO_DETAILS[scenario], title: d.title, action: d.action, confidence: d.confidence, isFault: d.isFault, status: d.status },
  };
}
