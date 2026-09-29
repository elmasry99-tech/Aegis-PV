'use client';

import type { ReactNode } from 'react';
import { Zap, Activity, BatteryCharging, SunMedium } from 'lucide-react';
import type { DashboardView } from '@/features/dashboard/types';
import { CountUp } from './CountUp';
import { GlassCard } from './GlassCard';
import styles from '@/app/dashboard/dashboard.module.css';

interface StatProps {
  label: string;
  icon: ReactNode;
  value: number;
  unit: string;
  decimals?: number;
  foot: ReactNode;
  delay: number;
}

function Stat({ label, icon, value, unit, decimals = 1, foot, delay }: StatProps) {
  return (
    <GlassCard className={styles.stat} delay={delay} as="div">
      <div className={styles.statLabel}>
        <span className={styles.statIcon}>{icon}</span>
        {label}
      </div>
      <div className={styles.statValue}>
        <CountUp value={value} decimals={decimals} />
        <span className={styles.statUnit}>{unit}</span>
      </div>
      <div className={styles.statFoot}>{foot}</div>
    </GlassCard>
  );
}

export function StatsRow({ view }: { view: DashboardView }) {
  const m = view.metrics;
  const nowGap = m.expectedOutputKw > 0 ? ((m.currentOutputKw - m.expectedOutputKw) / m.expectedOutputKw) * 100 : 0;
  const idle = !view.isDaylight;

  return (
    <div className={styles.statsRow}>
      <Stat
        label="Current Output"
        icon={<Zap size={15} />}
        value={m.currentOutputKw}
        unit="kW"
        decimals={2}
        delay={0.05}
        foot={
          idle ? 'Night — system idle' : (
            <span className={nowGap < -2 ? styles.down : styles.up}>
              <strong>{nowGap > 0 ? '+' : ''}{nowGap.toFixed(1)}%</strong> vs expected
            </span>
          )
        }
      />
      <Stat
        label="Expected Output"
        icon={<Activity size={15} />}
        value={m.expectedOutputKw}
        unit="kW"
        decimals={2}
        delay={0.1}
        foot="Digital-twin baseline for current weather"
      />
      <Stat
        label="Energy Today"
        icon={<BatteryCharging size={15} />}
        value={m.energyTodayKwh}
        unit="kWh"
        delay={0.15}
        foot={
          <span>
            of {m.expectedEnergyTodayKwh.toFixed(1)} kWh expected ·{' '}
            <strong className={m.gapPct > 3 ? styles.down : styles.up}>{m.gapPct.toFixed(1)}% gap</strong>
          </span>
        }
      />
      <Stat
        label="Irradiance"
        icon={<SunMedium size={15} />}
        value={m.ghi}
        unit="W/m²"
        decimals={0}
        delay={0.2}
        foot={`${m.ambientTempC.toFixed(0)} °C air · ${m.cellTempC.toFixed(0)} °C panels`}
      />
    </div>
  );
}
