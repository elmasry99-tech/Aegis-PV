import type { Site, ScenarioKey } from '@/shared/types';
import { SCENARIOS } from '@/lib/constants';

export const SITES_BY_SCENARIO: Record<ScenarioKey, Site[]> = {
  [SCENARIOS.HEALTHY]: [
    { id: 'al-olaya', name: 'Al Olaya Array', confidence: 98, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'diplomatic', name: 'Diplomatic Qtr', confidence: 99, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'king-abdullah', name: 'King Abdullah Dist', confidence: 95, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'malaz', name: 'Malaz District', confidence: 97, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'qurtubah', name: 'Qurtubah Array', confidence: 96, statusLabel: 'Optimal', status: 'healthy' },
  ],
  [SCENARIOS.DUST]: [
    { id: 'al-olaya', name: 'Al Olaya Array', confidence: 92, statusLabel: 'Soiling', status: 'warning' },
    { id: 'diplomatic', name: 'Diplomatic Qtr', confidence: 99, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'king-abdullah', name: 'King Abdullah Dist', confidence: 95, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'malaz', name: 'Malaz District', confidence: 87, statusLabel: 'Soiling', status: 'warning' },
    { id: 'qurtubah', name: 'Qurtubah Array', confidence: 94, statusLabel: 'Optimal', status: 'healthy' },
  ],
  [SCENARIOS.SHADING]: [
    { id: 'al-olaya', name: 'Al Olaya Array', confidence: 88, statusLabel: 'Shading', status: 'warning' },
    { id: 'diplomatic', name: 'Diplomatic Qtr', confidence: 99, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'king-abdullah', name: 'King Abdullah Dist', confidence: 95, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'malaz', name: 'Malaz District', confidence: 96, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'qurtubah', name: 'Qurtubah Array', confidence: 83, statusLabel: 'Shading', status: 'warning' },
  ],
  [SCENARIOS.HARDWARE]: [
    { id: 'al-olaya', name: 'Al Olaya Array', confidence: 92, statusLabel: 'Soiling', status: 'warning' },
    { id: 'diplomatic', name: 'Diplomatic Qtr', confidence: 99, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'king-abdullah', name: 'King Abdullah Dist', confidence: 98, statusLabel: 'Fault', status: 'critical' },
    { id: 'malaz', name: 'Malaz District', confidence: 94, statusLabel: 'Optimal', status: 'healthy' },
    { id: 'qurtubah', name: 'Qurtubah Array', confidence: 91, statusLabel: 'Soiling', status: 'warning' },
  ],
};
