import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border text-xs font-semibold',
        'border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald',
        className
      )}
      style={{ padding: '6px 20px' }}
    >
      <CheckCircle2 size={13} />
      {confidence}% Confidence
    </span>
  );
}
