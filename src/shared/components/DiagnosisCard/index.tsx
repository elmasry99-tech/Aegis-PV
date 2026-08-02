'use client';

import { Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Diagnosis } from '@/shared/types';
import { ConfidenceBadge } from '@/shared/components/ConfidenceBadge';
import { cn } from '@/shared/utils/cn';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  className?: string;
}

export function DiagnosisCard({ diagnosis, className }: DiagnosisCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all duration-500',
        diagnosis.isFault
          ? 'border-brand-red/30 bg-brand-red/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
          : 'border-brand-emerald/30 bg-brand-emerald/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]',
        className
      )}
    >
      <div className="mb-3">
        <ConfidenceBadge confidence={diagnosis.confidence} />
      </div>

      <p className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-2">
        <Cpu size={16} />
        AI Diagnosis Center
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={diagnosis.title}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.25 }}
        >
          <h3
            className={cn(
              'text-xl font-bold mb-2',
              diagnosis.isFault ? 'text-brand-red' : 'text-brand-emerald'
            )}
          >
            {diagnosis.title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{diagnosis.action}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
