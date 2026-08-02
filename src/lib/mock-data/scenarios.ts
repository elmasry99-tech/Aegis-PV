import type { Diagnosis, ScenarioKey } from '@/shared/types';
import { SCENARIOS } from '@/lib/constants';

export const DIAGNOSES: Record<ScenarioKey, Diagnosis> = {
  [SCENARIOS.HEALTHY]: {
    title: 'System Optimal',
    action: 'No maintenance required. Operating at peak efficiency.',
    confidence: 99,
    isFault: false,
    status: 'healthy',
  },
  [SCENARIOS.DUST]: {
    title: 'Soiling Detected',
    action: 'Schedule cleaning for Array B within 48 hours to recover 15% efficiency.',
    confidence: 92,
    isFault: true,
    status: 'warning',
  },
  [SCENARIOS.SHADING]: {
    title: 'Partial Shading',
    action: 'Object blocking panel C4 during peak hours (10AM - 2PM).',
    confidence: 88,
    isFault: true,
    status: 'warning',
  },
  [SCENARIOS.HARDWARE]: {
    title: 'Inverter Fault',
    action: 'String 3 disconnected. Dispatch technician immediately.',
    confidence: 98,
    isFault: true,
    status: 'critical',
  },
};

export const CURRENT_OUTPUT: Record<ScenarioKey, number> = {
  [SCENARIOS.HEALTHY]: 4.8,
  [SCENARIOS.DUST]: 4.2,
  [SCENARIOS.SHADING]: 4.2,
  [SCENARIOS.HARDWARE]: 0.0,
};
