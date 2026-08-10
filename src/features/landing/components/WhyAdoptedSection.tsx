'use client';

import { CheckCircle2, TrendingUp, MapPin, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHY_ADOPTED } from '@/lib/constants';
import styles from '@/app/page.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  CheckCircle2: <CheckCircle2 size={22} />,
  TrendingUp: <TrendingUp size={22} />,
  MapPin: <MapPin size={22} />,
};

export function WhyAdoptedSection() {
  return (
    <section id="why-us" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Why Aegis PV Gets Adopted</h2>
        <p className={styles.sectionDesc}>
          A real problem, a compelling business case, and a model built specifically for
          Saudi Arabia — not retrofitted from a European baseline.
        </p>
      </div>

      <div className={styles.whyGrid}>
        {WHY_ADOPTED.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`${styles.whyCol} glass`}
          >
            <div className={styles.whyColHeader}>
              <div className={styles.whyColIcon}>{ICON_MAP[col.icon]}</div>
              <div className={styles.whyColTitle}>{col.title}</div>
            </div>
            <div className={styles.whyList}>
              {col.points.map((point) => (
                <div key={point} className={styles.whyListItem}>
                  <Check size={16} />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
