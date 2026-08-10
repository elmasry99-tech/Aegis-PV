'use client';

import { motion } from 'framer-motion';
import { DUST_EVIDENCE, EVIDENCE_SOURCES } from '@/lib/constants';
import styles from '@/app/page.module.css';

function barColor(efficiency: number): string {
  if (efficiency >= 12) return '#059669';
  if (efficiency >= 8) return '#ca8a04';
  if (efficiency >= 3) return '#ea580c';
  return '#dc2626';
}

export function EvidenceSection() {
  const maxEfficiency = DUST_EVIDENCE[0].efficiency;

  return (
    <section id="evidence" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>The Evidence</h2>
        <p className={styles.sectionDesc}>
          Cell efficiency versus dust density, from clean glass to a heavily soiled array.
          Every point on this curve is a homeowner losing yield without knowing why.
        </p>
      </div>

      <div className={`${styles.evidenceWrap} glass`}>
        {DUST_EVIDENCE.map((row, i) => (
          <motion.div
            key={row.dust}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={styles.evidenceRow}
          >
            <span className={styles.evidenceLabel}>{row.dust} mg/cm²</span>
            <div className={styles.evidenceBarTrack}>
              <motion.div
                className={styles.evidenceBarFill}
                style={{ background: barColor(row.efficiency) }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(row.efficiency / maxEfficiency) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.evidenceValue} style={{ color: barColor(row.efficiency) }}>
              {row.efficiency.toFixed(2)}%
              <span className={styles.evidenceDelta}>
                {row.delta === 0 ? 'baseline' : `${row.delta.toFixed(1)}%`}
              </span>
            </span>
          </motion.div>
        ))}

        <p className={styles.evidenceSources}>
          Sources: {EVIDENCE_SOURCES.join(' · ')}
        </p>
      </div>
    </section>
  );
}
