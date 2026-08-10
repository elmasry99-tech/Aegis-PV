'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES, CTA_POINTS, CTA_SEEKING } from '@/lib/constants';
import styles from '@/app/page.module.css';

export function CTASection() {
  return (
    <section id="cta" className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={styles.ctaSection}
      >
        <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
          <h2 className={styles.sectionTitle}>The Case for Aegis PV</h2>
        </div>

        <div className={styles.ctaGrid}>
          <div className={styles.ctaPoints}>
            {CTA_POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={styles.ctaPoint}
              >
                <span className={styles.ctaPointNumber}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className={styles.ctaPointTitle}>{point.title}</div>
                  <p className={styles.ctaPointDesc}>{point.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.ctaSeeking}>
            <div className={styles.ctaSeekingTitle}>Seeking</div>
            <div className={styles.ctaSeekingList}>
              {CTA_SEEKING.map((item) => (
                <div key={item} className={styles.ctaSeekingItem}>
                  <Check size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className={styles.ctaBtns}>
              <Link href={ROUTES.DASHBOARD} className={styles.btnPrimary}>
                Explore the Product{' '}
                <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
              </Link>
              <Link href={ROUTES.LOGIN} className={styles.btnSecondary}>Log in</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
