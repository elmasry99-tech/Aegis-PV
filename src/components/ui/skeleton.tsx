import { cn } from '@/shared/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-bg-tertiary',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
