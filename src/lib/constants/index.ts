export const APP_NAME = 'Aegis PV';
export const APP_TAGLINE = 'AI-Powered Solar Intelligence for GCC';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
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
  emerald: '#059669',
  cyan: '#0891b2',
  yellow: '#ca8a04',
  red: '#dc2626',
  textSecondary: '#52525b',
  textMuted: '#71717a',
  border: 'rgba(0, 0, 0, 0.1)',
  bgSecondary: '#f4f4f5',
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

// ─── Problem section ─────────────────────────────────────────────────────────
export const PROBLEM_POINTS = [
  {
    icon: 'Thermometer',
    title: 'Extreme heat',
    description: 'Ambient temperatures exceed 50°C, causing severe voltage drops in PV modules.',
  },
  {
    icon: 'Wind',
    title: 'Fine desert dust',
    description: 'Airborne dust scatters incoming light, directly reducing irradiance on the cells.',
  },
  {
    icon: 'CloudOff',
    title: 'No self-cleaning season',
    description: 'With no rainy season, dust accumulates continuously, year-round, with nothing to wash it away.',
  },
  {
    icon: 'TrendingUp',
    title: 'Vision 2030 adoption boom',
    description: 'KSA Vision 2030 is driving rapid residential solar adoption across the Kingdom.',
  },
  {
    icon: 'EyeOff',
    title: 'Zero visibility for owners',
    description: 'Most homeowners have no way to see actual performance degradation until it shows up on their bill.',
  },
] as const;

export const PROBLEM_STATS = [
  { value: '20%', label: 'Daily energy loss', description: 'In dry periods, with no visible warning to the homeowner.', tone: 'bad' },
  { value: '>50%', label: 'Power drop in 6 months', description: 'Cumulative loss from an uncleaned array left unmonitored.', tone: 'bad' },
  { value: '+23%', label: 'Power recovery', description: 'Regained after a single, correctly-timed cleaning cycle — once you know it needs it.', tone: 'good' },
] as const;

// ─── Evidence section ────────────────────────────────────────────────────────
export const DUST_EVIDENCE = [
  { dust: 0, isc: 0.0776, voc: 2.321, pm: 0.0995, efficiency: 13.88, delta: 0 },
  { dust: 0.33, isc: null, voc: null, pm: null, efficiency: 12.29, delta: -11.4 },
  { dust: 0.66, isc: null, voc: null, pm: null, efficiency: 10.51, delta: -24.3 },
  { dust: 1.32, isc: null, voc: null, pm: null, efficiency: 7.69, delta: -44.6 },
  { dust: 2.65, isc: null, voc: null, pm: null, efficiency: 4.77, delta: -65.6 },
  { dust: 5.29, isc: null, voc: null, pm: null, efficiency: 1.83, delta: -86.8 },
] as const;

export const EVIDENCE_SOURCES = [
  'Zorrilla-Casanova et al., MDPI',
  'Dust accumulation & PV performance study, MDPI',
] as const;

// ─── Competitive comparison ──────────────────────────────────────────────────
export const COMPARISON_COLUMNS = ['Enphase or SolarEdge', 'Applus+', '3E SynaptiQ', 'Aegis-PV Proposed'] as const;

export const COMPARISON_ROWS = [
  {
    label: 'Fault Detection and Diagnostics',
    values: ['Yes', 'Yes', 'Yes', 'Planned'],
  },
  {
    label: 'Advanced Analytics or AI',
    values: ['Yes or varies by platform', 'ML and data science', 'Advanced analytics and digital twin', 'Planned ML diagnosis'],
  },
  {
    label: 'Soiling or Dust Analysis',
    values: ['Limited or system dependent', 'Soiling rate and loss analysis', 'Loss and root cause analytics', 'Core proposed feature'],
  },
  {
    label: 'Shading or Performance Loss Diagnosis',
    values: ['Some diagnostics available', 'Performance analytics', 'Root cause loss analysis', 'Core proposed feature'],
  },
  {
    label: 'Hardware Agnostic',
    values: ['No — mainly vendor ecosystems', 'Partial — integrates plant or SCADA data', 'Yes', 'Planned through Modbus or REST'],
  },
  {
    label: 'GCC Specific Climate Calibration',
    values: ['Not established in reviewed sources', 'Not established in reviewed sources', 'Not established in reviewed sources', 'Proposed GCC focus'],
  },
  {
    label: 'Residential Focus',
    values: ['Strong', 'No — mainly professional or utility', 'No — professional asset management', 'Core target market'],
  },
  {
    label: 'Actionable Maintenance Guidance',
    values: ['Alerts and troubleshooting vary', 'Analyst supported insights', 'Recommendations and task management', 'Planned homeowner actions'],
  },
  {
    label: 'Digital Twin',
    values: ['Not core in reviewed sources', 'Not established for this comparison', 'Yes', 'Proposed'],
  },
  {
    label: 'Typical Positioning',
    values: ['Residential vendor ecosystem', 'Professional utility scale analytics', 'Professional renewable asset management', 'GCC residential solar intelligence'],
  },
] as const;

// ─── Why Aegis PV gets adopted ───────────────────────────────────────────────
export const WHY_ADOPTED = [
  {
    icon: 'CheckCircle2',
    title: 'Solves a real problem',
    points: [
      'Tells owners exactly when something is wrong, and why.',
      'Identifies root cause: dust, shading, heat, or equipment fault.',
      'Enables faster decisions, fewer losses, lower repair costs.',
      'Prevents small issues from becoming expensive failures.',
    ],
  },
  {
    icon: 'TrendingUp',
    title: 'Compelling business case',
    points: [
      'Increases yield through precise, targeted maintenance.',
      'Reduces unnecessary service calls.',
      'Reduces downtime and boosts long-term ROI.',
      'Scales easily via standard APIs.',
    ],
  },
  {
    icon: 'MapPin',
    title: 'Built for Saudi Arabia',
    points: [
      'Saudi panels are hit hardest: extreme dust plus 50°C+ heat.',
      'Model calibrated to local GCC conditions, not European baselines.',
      'More accurate than any global tool applied locally.',
      "Directly supports Vision 2030's renewable goals.",
    ],
  },
] as const;

// ─── Broader impact ──────────────────────────────────────────────────────────
export const BROADER_IMPACT = [
  'Fewer unnecessary cleaning cycles — saves water, labor, and cost in a water-scarce region.',
  'Extends panel lifespan by catching degrading conditions early.',
  "Supports Vision 2030's renewable energy targets at the residential scale.",
] as const;

// ─── Closing / call to action ────────────────────────────────────────────────
export const CTA_POINTS = [
  {
    title: 'The market gap is real',
    description: 'Nothing serves the GCC residential homeowner between passive loggers and enterprise platforms.',
  },
  {
    title: 'The differentiators are defensible',
    description: "Saudi-calibrated AI, hardware agnosticism, and plain-language diagnostics can't be replicated by tweaking a global tool.",
  },
  {
    title: 'The opportunity is now',
    description: 'KSA residential solar is growing fast under Vision 2030 — early movers who own the diagnostic layer define the category.',
  },
] as const;

export const CTA_SEEKING = [
  'Competition recognition',
  'Pilot partnerships with GCC residential solar installers',
  'Labeled local soiling datasets for model refinement',
] as const;
