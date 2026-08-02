'use client';

import { Cpu, Zap, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURES } from '@/lib/constants';
import styles from '@/app/page.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu size={28} />,
  Zap: <Zap size={28} />,
  CloudRain: <CloudRain size={28} />,
};

export function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Built for the Harshest Environments</h2>
        <p className={styles.sectionDesc}>
          Our AI is calibrated specifically for the GCC climate, capable of distinguishing extreme
          heat and fine-particle dust from hardware failure.
        </p>
      </div>
      <div className={styles.featuresGrid}>
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`${styles.featureCard} glass`}
          >
            <div className={styles.featureIcon}>{ICON_MAP[feature.icon]}</div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
