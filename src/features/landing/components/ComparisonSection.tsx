'use client';

import { Check, X, Minus } from 'lucide-react';
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from '@/lib/constants';
import styles from '@/app/page.module.css';

function Cell({ value }: { value: string }) {
  if (value === 'yes') return <span className={styles.compareIconYes}><Check size={18} /></span>;
  if (value === 'no') return <span className={styles.compareIconNo}><X size={18} /></span>;
  if (value === 'partial') return <span className={styles.compareIconPartial}><Minus size={18} /></span>;
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

      <div className={styles.compareWrap}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th></th>
              {COMPARISON_COLUMNS.map((col) => (
                <th key={col} className={col === 'Aegis PV' ? styles.compareBrandCol : undefined}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className={COMPARISON_COLUMNS[i] === 'Aegis PV' ? styles.compareBrandCol : undefined}
                  >
                    <Cell value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
