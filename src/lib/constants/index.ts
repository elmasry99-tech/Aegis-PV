export const APP_NAME = 'Aegis PV';
export const APP_TAGLINE = 'AI-Powered Solar Intelligence for GCC';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SITES: '/sites',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const SITE_PORTFOLIO = 'Riyadh Residential Portfolio (GCC Baseline)';
export const DATA_SOURCE = 'Modbus TCP';

export const SCENARIOS = {
  HEALTHY: 'healthy',
  DUST: 'dust',
  SHADING: 'shading',
  HARDWARE: 'hardware',
} as const;

export const SCENARIO_LABELS: Record<string, string> = {
  healthy: 'Scenario: Healthy',
  dust: 'Scenario: Dust Accumulation',
  shading: 'Scenario: Shading',
  hardware: 'Scenario: Equipment Fault',
};

export const CHART_TIME_LABELS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
export const CHART_EXPECTED_DATA = [0.5, 2.1, 4.2, 5.0, 4.3, 2.5, 0.4];

export const CHART_ACTUAL_DATA: Record<string, number[]> = {
  healthy: [0.5, 2.1, 4.2, 5.0, 4.3, 2.5, 0.4],
  dust: [0.4, 1.8, 3.5, 4.2, 3.6, 2.1, 0.3],
  shading: [0.5, 2.1, 1.5, 5.0, 4.3, 2.5, 0.4],
  hardware: [0.5, 2.1, 4.2, 0, 0, 0, 0],
};

export const PIPELINE_STEPS = [
  { id: 'ingest', label: 'Data Ingestion', description: 'Real-time API sync' },
  { id: 'pattern', label: 'Pattern Analysis', description: 'Loss curves trends' },
  { id: 'fault', label: 'Fault Diagnosis', description: 'Random Forest Model' },
  { id: 'action', label: 'Action Issued', description: '92% Confidence' },
] as const;

export const DASHBOARD_PIPELINE_STEPS = [
  { id: 'ingest', label: 'Data Ingest' },
  { id: 'model', label: 'Model' },
  { id: 'classify', label: 'Classify' },
] as const;

export const COLORS = {
  emerald: '#10b981',
  cyan: '#06b6d4',
  yellow: '#eab308',
  red: '#ef4444',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  border: 'rgba(255, 255, 255, 0.1)',
  bgSecondary: '#161616',
} as const;

export const IMPACT_METRICS = [
  { value: '+23%', label: 'Average Power Recovery', description: 'Per cleaning cycle compared to a heavily soiled baseline.', color: 'emerald' },
  { value: '-20%', label: 'Daily Loss Prevented', description: 'In dry seasons without regular scheduled maintenance.', color: 'cyan' },
  { value: '>50%', label: 'Output Preserved', description: 'Versus a traditional 6-month no-clean scenario.', color: 'yellow' },
] as const;

export const FEATURES = [
  {
    id: 'ai-diagnosis',
    title: 'AI-Powered Diagnosis',
    description: 'Random Forest classifier distinguishes between dust, shading, and hardware faults automatically, 24/7 without human intervention.',
    icon: 'Cpu',
  },
  {
    id: 'hardware-agnostic',
    title: 'Hardware Agnostic',
    description: 'Standard Modbus & REST API integration pulls data from any inverter brand. No proprietary hardware or vendor lock-in.',
    icon: 'Zap',
  },
  {
    id: 'locally-calibrated',
    title: 'Locally Calibrated',
    description: 'Baseline trained on GCC climate. Handles extreme heat-induced voltage drops and fine dust accumulation invisible to global models.',
    icon: 'CloudRain',
  },
] as const;
