import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-secondary border border-border-default',
        healthy: 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/30',
        warning: 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30',
        critical: 'bg-brand-red/10 text-brand-red border border-brand-red/30',
        info: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
