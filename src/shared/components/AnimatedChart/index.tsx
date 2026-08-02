'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_TIME_LABELS, CHART_EXPECTED_DATA, CHART_ACTUAL_DATA, COLORS } from '@/lib/constants';
import type { ScenarioKey } from '@/shared/types';

interface ChartPoint {
  time: string;
  expected: number;
  actual: number;
}

function buildChartData(scenario: ScenarioKey): ChartPoint[] {
  const actual = CHART_ACTUAL_DATA[scenario] ?? CHART_EXPECTED_DATA;
  return CHART_TIME_LABELS.map((time, i) => ({
    time,
    expected: CHART_EXPECTED_DATA[i],
    actual: actual[i],
  }));
}

interface TooltipEntry {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-border-default bg-bg-secondary px-4 py-3 text-sm shadow-xl"
      style={{ borderColor: COLORS.border }}
    >
      <p className="font-medium text-white mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} style={{ color: entry.color }}>
          {entry.name}: {entry.value} kW
        </p>
      ))}
    </div>
  );
}

interface AnimatedChartProps {
  scenario: ScenarioKey;
  height?: number;
}

export function AnimatedChart({ scenario, height = 280 }: AnimatedChartProps) {
  const data = buildChartData(scenario);
  const actualColor = scenario === 'healthy' ? COLORS.emerald : COLORS.red;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fill: COLORS.textMuted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: COLORS.textMuted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: COLORS.textSecondary, fontSize: 12 }}
          iconType="plainline"
        />
        <Line
          type="monotone"
          dataKey="expected"
          name="Expected Output (kW)"
          stroke="rgba(255,255,255,0.25)"
          strokeDasharray="5 5"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual Output (kW)"
          stroke={actualColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
