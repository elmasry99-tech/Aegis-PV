'use client';

import { ImpactCard } from '@/shared/components/ImpactCard';
import { IMPACT_METRICS } from '@/lib/constants';
import type { ImpactStat } from '@/shared/types';
import styles from '@/app/page.module.css';

const STATS: ImpactStat[] = IMPACT_METRICS.map((m) => ({
  value: m.value,
  label: m.label,
  description: m.description,
  color: m.color as ImpactStat['color'],
}));

export function BenefitsSection() {
  return (
    <section id="benefits" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Quantified Value</h2>
        <p className={styles.sectionDesc}>
          Based on validated benchmarks from peer-reviewed research for GCC homeowners.
        </p>
      </div>
      <div className={styles.featuresGrid}>
        {STATS.map((stat, i) => (
          <ImpactCard key={stat.label} stat={stat} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}
