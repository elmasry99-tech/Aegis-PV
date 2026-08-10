'use client';

import { Thermometer, Wind, CloudOff, TrendingUp, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROBLEM_POINTS, PROBLEM_STATS } from '@/lib/constants';
import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { useSpotlight } from '@/shared/hooks/useSpotlight';
import styles from '@/app/page.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Thermometer: <Thermometer size={20} />,
  Wind: <Wind size={20} />,
  CloudOff: <CloudOff size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  EyeOff: <EyeOff size={20} />,
};

export function ProblemSection() {
  const onMouseMove = useSpotlight<HTMLDivElement>();

  return (
    <section id="problem" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Solar&apos;s Silent Efficiency Killer</h2>
        <p className={styles.sectionDesc}>
          The GCC is one of the best places on earth for solar irradiance — and one of the
          hardest places to keep a panel clean and cool.
        </p>
      </div>

      <div className={styles.problemLayout}>
        <div className={styles.problemList}>
          {PROBLEM_POINTS.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={styles.problemPoint}
            >
              <div className={styles.problemPointIcon}>{ICON_MAP[point.icon]}</div>
              <div>
                <div className={styles.problemPointTitle}>{point.title}</div>
                <p className={styles.problemPointDesc}>{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.statStack}>
          {PROBLEM_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onMouseMove={onMouseMove}
              className={`${styles.statCard} ${stat.tone === 'good' ? styles.statCardGood : ''} glass`}
            >
              <AnimatedNumber value={stat.value} className={styles.statValue} />
              <div className={styles.statLabel}>{stat.label}</div>
              <p className={styles.statDesc}>{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
