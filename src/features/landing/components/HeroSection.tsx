'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/lib/constants';
import laptopMockup from '@/mockup/laptop.png';
import mobileMockup from '@/mockup/mobile.png';
import styles from '@/app/page.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.heroContent} animate-fade-in`}>
        <div className={styles.heroTag}>
          <span className={styles.heroTagIcon}></span>
          AI-Powered Solar Intelligence for GCC
        </div>
        <h1 className={styles.heroTitle}>
          Detect solar faults before <span className="text-gradient">power drops.</span>
        </h1>
        <p className={styles.heroDesc}>
          Transforming raw inverter data into actionable maintenance decisions. Aegis PV uses
          AI calibrated for the GCC to detect dust accumulation, shading, and equipment faults
          in real-time — maximizing energy yield without unnecessary maintenance.
        </p>
        <div className={styles.heroBtns}>
          <Link href={ROUTES.DASHBOARD} className={styles.btnPrimary}>
            View Dashboard Example{' '}
            <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px', verticalAlign: 'middle' }} />
          </Link>
        </div>
      </div>

      <div className={styles.heroVisual}>
        <div className={styles.mockupScene}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Image
              src={laptopMockup}
              alt="Aegis PV dashboard on a laptop"
              className={styles.mockupLaptop}
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32, x: 16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className={styles.mockupMobile}
          >
            <Image
              src={mobileMockup}
              alt="Aegis PV landing page on a phone"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
