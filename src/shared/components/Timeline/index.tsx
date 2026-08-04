import { CloudRain, CheckCircle2 } from 'lucide-react';
import type { FaultHistoryEntry } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

const ICON_MAP: Record<string, React.ReactNode> = {
  CloudRain: <CloudRain size={16} />,
  CheckCircle2: <CheckCircle2 size={16} />,
};

const SEVERITY_STYLES = {
  success: { wrapper: 'bg-brand-emerald/10', icon: 'text-brand-emerald' },
  warning: { wrapper: 'bg-brand-yellow/10', icon: 'text-brand-yellow' },
  critical: { wrapper: 'bg-brand-red/10', icon: 'text-brand-red' },
};

interface TimelineProps {
  entries: FaultHistoryEntry[];
  className?: string;
}

export function Timeline({ entries, className }: TimelineProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {entries.map((entry) => {
        const styles = SEVERITY_STYLES[entry.severity];
        return (
          <div key={entry.id} className="flex items-center gap-4">
            <div className={cn('rounded-lg p-2 shrink-0', styles.wrapper, styles.icon)}>
              {ICON_MAP[entry.icon]}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{entry.title}</p>
              <p className="text-xs text-text-secondary">{entry.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
