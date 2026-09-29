'use client';

import { Check, X, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from '@/lib/constants';
import styles from '@/app/page.module.css';

function Cell({ value, isBrand }: { value: string; isBrand?: boolean }) {
  if (value === 'yes') return <span className={styles.compareIconYes}><Check size={18} /></span>;
  if (value === 'no') return <span className={styles.compareIconNo}><X size={18} /></span>;
  if (value === 'partial') return <span className={styles.compareIconPartial}><Minus size={18} /></span>;
  if (isBrand) return <span className={styles.compareBrandValue}>{value}</span>;
  return <span>{value}</span>;
}

export function ComparisonSection() {
  return (
    <section id="compare" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>How Aegis PV Compares</h2>
        <p className={styles.sectionDesc}>
          Between passive consumer loggers and enterprise-only diagnostics, there&apos;s nothing
          built for the GCC residential homeowner. Until now.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={styles.compareWrap}
      >
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th></th>
              {COMPARISON_COLUMNS.map((col) => (
                <th key={col} className={col === 'Aegis-PV Proposed' ? styles.compareBrandCol : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <motion.tr
                key={row.label}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <td>{row.label}</td>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className={COMPARISON_COLUMNS[i] === 'Aegis-PV Proposed' ? styles.compareBrandCol : undefined}
                  >
                    <Cell value={value} isBrand={COMPARISON_COLUMNS[i] === 'Aegis-PV Proposed'} />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}
