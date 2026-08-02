import type { SiteStatus } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

interface StatusBadgeProps {
  status: SiteStatus;
  label?: string;
  className?: string;
}

const STATUS_STYLES: Record<SiteStatus, string> = {
  healthy: 'text-brand-emerald',
  warning: 'text-brand-yellow',
  critical: 'text-brand-red',
};

const DOT_STYLES: Record<SiteStatus, string> = {
  healthy: 'bg-brand-emerald shadow-[0_0_6px_#10b981]',
  warning: 'bg-brand-yellow shadow-[0_0_6px_#eab308]',
  critical: 'bg-brand-red shadow-[0_0_6px_#ef4444] animate-pulse',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', STATUS_STYLES[status], className)}>
      <span className={cn('h-2 w-2 rounded-full', DOT_STYLES[status])} />
      {label && <span className="text-sm font-medium">{label}</span>}
    </span>
  );
}
