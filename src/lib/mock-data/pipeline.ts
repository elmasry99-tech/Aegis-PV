export type PipelineStage = {
  id: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  inputs: string[];
  outputs: string[];
  detail: string; // longer explanation
  duration: number; // ms (simulated processing time)
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'sensor',
    label: 'Sensor Data',
    description: 'Real-time inverter readings via Modbus TCP',
    icon: 'Radio',
    inputs: [],
    outputs: ['DC Voltage', 'DC Current', 'AC Power', 'Temperature'],
    detail:
      'Modbus TCP polling at 1Hz from string inverters. Raw measurements include DC input voltage, current per string, AC output power, and module temperature sensors.',
    duration: 200,
  },
  {
    id: 'weather',
    label: 'Weather Data',
    description: 'Meteorological station & satellite irradiance',
    icon: 'Cloud',
    inputs: [],
    outputs: ['GHI', 'DNI', 'Ambient Temp', 'Humidity'],
    detail:
      'On-site pyranometer data combined with satellite-derived irradiance (GHI, DNI). Ambient temperature and humidity from co-located weather station.',
    duration: 150,
  },
  {
    id: 'processing',
    label: 'Data Processing',
    description: 'Alignment, cleaning, outlier detection',
    icon: 'Filter',
    inputs: ['Sensor Data', 'Weather Data'],
    outputs: ['Cleaned Dataset', 'Anomaly Flags'],
    detail:
      'Time-alignment of inverter and weather streams. Missing value imputation, rolling-window outlier detection using z-score > 3σ. Produces a 15-minute aggregated clean dataset.',
    duration: 300,
  },
  {
    id: 'features',
    label: 'Feature Engineering',
    description: 'Performance ratio, spectral analysis',
    icon: 'BarChart2',
    inputs: ['Cleaned Dataset'],
    outputs: ['Performance Ratio', 'PR Trend', 'Spectral Signature', 'Thermal Index'],
    detail:
      'Compute Performance Ratio (PR = Yield/Reference Yield). Derive PR 7-day trend slope, fast Fourier transform for spectral signature detection, and thermal uniformity index across strings.',
    duration: 400,
  },
  {
    id: 'model',
    label: 'AI Classification',
    description: 'Random Forest + LSTM ensemble',
    icon: 'Cpu',
    inputs: ['Feature Vector'],
    outputs: ['Class Probabilities', 'Confidence Score'],
    detail:
      'Ensemble of Random Forest (tabular features) and LSTM (time-series patterns). Trained on 18 months of labeled fault data. Outputs per-class probabilities for: Healthy, Soiling, Shading, Equipment Fault.',
    duration: 600,
  },
  {
    id: 'prediction',
    label: 'Prediction',
    description: 'Fault class + confidence score',
    icon: 'Target',
    inputs: ['Class Probabilities'],
    outputs: ['Fault Classification', 'Confidence %'],
    detail:
      'Argmax of class probabilities gives the fault type. Confidence score is calibrated via Platt scaling. Predictions below 70% confidence are flagged for human review.',
    duration: 100,
  },
  {
    id: 'action',
    label: 'Recommended Action',
    description: 'Prioritized maintenance dispatch',
    icon: 'Wrench',
    inputs: ['Fault Classification', 'Site Data'],
    outputs: ['Maintenance Alert', 'Priority Score', 'ETA'],
    detail:
      'Maps fault type to maintenance action using a priority matrix (fault severity × revenue impact). Dispatches alert to maintenance team with estimated recovery yield and recommended response window.',
    duration: 200,
  },
];

export const FEATURE_IMPORTANCE = [
  { feature: 'Performance Ratio',  importance: 0.31 },
  { feature: 'PR 7-day Trend',     importance: 0.24 },
  { feature: 'Thermal Index',      importance: 0.18 },
  { feature: 'Spectral Signature', importance: 0.14 },
  { feature: 'Humidity',           importance: 0.08 },
  { feature: 'Irradiance',         importance: 0.05 },
];
