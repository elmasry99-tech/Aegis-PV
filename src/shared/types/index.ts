import type { SCENARIOS } from '@/lib/constants';

export type ScenarioKey = (typeof SCENARIOS)[keyof typeof SCENARIOS];

export type SiteStatus = 'healthy' | 'warning' | 'critical';
export type DiagnosisStatus = 'healthy' | 'warning' | 'critical';
export type FaultSeverity = 'success' | 'warning' | 'critical';

export interface Diagnosis {
  title: string;
  action: string;
  confidence: number;
  isFault: boolean;
  status: DiagnosisStatus;
}

export interface Site {
  id: string;
  name: string;
  confidence: number;
  statusLabel: string;
  status: SiteStatus;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  icon: string;
}

export interface FaultHistoryEntry {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: FaultSeverity;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  borderDash?: number[];
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
}

export interface PipelineStep {
  id: string;
  label: string;
  description?: string;
  isActive?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ImpactStat {
  value: string;
  label: string;
  description: string;
  color: 'emerald' | 'cyan' | 'yellow';
}
