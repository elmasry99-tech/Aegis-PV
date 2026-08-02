import type { DashboardMetric } from '@/shared/types';

export const STATIC_METRICS: Omit<DashboardMetric, 'value'>[] = [
  { id: 'expected-output', label: 'Expected Output', unit: 'MW', icon: 'Activity' },
  { id: 'water-saved', label: 'Water Saved (YTD)', unit: 'kL', icon: 'Droplet' },
  { id: 'co2-reduction', label: 'CO₂ Reduction', unit: 'kg', icon: 'Leaf' },
];

export const STATIC_METRIC_VALUES = {
  expectedOutput: 4.8,
  waterSaved: 12.4,
  co2Reduction: 8420,
};
