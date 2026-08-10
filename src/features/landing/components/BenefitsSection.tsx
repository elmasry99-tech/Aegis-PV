'use client';

import { Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImpactCard } from '@/shared/components/ImpactCard';
import { IMPACT_METRICS, BROADER_IMPACT } from '@/lib/constants';
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

      <div className={styles.impactList}>
        {BROADER_IMPACT.map((point, i) => (
          <motion.div
            key={point}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={styles.impactListItem}
          >
            <Droplets size={18} />
            <span>{point}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
