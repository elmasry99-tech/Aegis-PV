export type ImpactMetric = {
  label: string;
  value: number;
  unit: string;
  baseline: number; // without intervention
  description: string;
  icon: string; // lucide icon name as string
  color: string; // CSS color
};

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: 'Energy Recovered',
    value: 3420,
    unit: 'kWh',
    baseline: 0,
    description: 'Additional energy recovered through early fault detection',
    icon: 'Zap',
    color: '#10b981',
  },
  {
    label: 'Cost Savings',
    value: 8240,
    unit: 'SAR',
    baseline: 0,
    description: 'Estimated revenue from recovered energy production',
    icon: 'DollarSign',
    color: '#06b6d4',
  },
  {
    label: 'Water Saved',
    value: 12400,
    unit: 'L',
    baseline: 18600,
    description: 'Optimized cleaning schedules reduce water waste',
    icon: 'Droplets',
    color: '#3b82f6',
  },
  {
    label: 'CO₂ Reduction',
    value: 8420,
    unit: 'kg',
    baseline: 6100,
    description: 'Additional CO₂ avoided through efficiency recovery',
    icon: 'Leaf',
    color: '#22c55e',
  },
  {
    label: 'Equipment Waste Prevented',
    value: 2,
    unit: 'units',
    baseline: 0,
    description: 'Early fault detection prevented inverter replacements',
    icon: 'Shield',
    color: '#a855f7',
  },
];

// Monthly trend data for charts
export const MONTHLY_ENERGY_RECOVERY = [
  { month: 'Feb', withAI: 280, withoutAI: 0 },
  { month: 'Mar', withAI: 310, withoutAI: 0 },
  { month: 'Apr', withAI: 290, withoutAI: 10 },
  { month: 'May', withAI: 340, withoutAI: 15 },
  { month: 'Jun', withAI: 420, withoutAI: 20 },
  { month: 'Jul', withAI: 580, withoutAI: 25 },
];
