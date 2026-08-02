import type { FaultHistoryEntry } from '@/shared/types';

export const FAULT_HISTORY: FaultHistoryEntry[] = [
  {
    id: 'fh-1',
    title: 'Dust Detected',
    description: '2 days ago • Array C',
    icon: 'CloudRain',
    severity: 'warning',
  },
  {
    id: 'fh-2',
    title: 'Maintenance Logged',
    description: '5 days ago • Cleaning completed',
    icon: 'CheckCircle2',
    severity: 'success',
  },
];
