'use client';

import { Activity, BarChart3, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PIPELINE_STEPS } from '@/lib/constants';
import styles from '@/app/page.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  ingest: <Activity />,
  pattern: <BarChart3 />,
  fault: <Cpu />,
  action: <ShieldCheck />,
};

export function PipelineSection() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>From Inverter Data to Action</h2>
        <p className={styles.sectionDesc}>
          A four-stage AI pipeline that replaces manual guesswork with precise diagnostics.
        </p>
      </div>
      <div className={styles.pipelineFlow}>
        <motion.div
          className={styles.pipelineLine}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeInOut', delay: 0.2 }}
        />
        {PIPELINE_STEPS.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`${styles.pipelineStep} glass`}
          >
            <span className={styles.pipelineIcon}>{ICON_MAP[step.id]}</span>
            <div className={styles.pipelineLabel}>{step.label}</div>
            <p className={styles.pipelineDesc}>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
