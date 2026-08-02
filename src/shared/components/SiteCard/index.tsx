import type { Site } from '@/shared/types';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { cn } from '@/shared/utils/cn';

interface SiteCardProps {
  site: Site;
  className?: string;
}

export function SiteCard({ site, className }: SiteCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-default bg-bg-tertiary p-4 transition-all hover:border-border-hover',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">{site.name}</span>
        <StatusBadge status={site.status} />
      </div>
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Confidence: {site.confidence}%</span>
        <StatusBadge status={site.status} label={site.statusLabel} />
      </div>
    </div>
  );
}
