import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent';
}

export function Badge({ children, className, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium leading-6 transition-colors duration-200',
        tone === 'neutral' &&
          'border border-line bg-surface/70 text-muted hover:border-accent/50 hover:text-accent',
        tone === 'accent' && 'border border-accent/30 bg-accent/10 text-accent',
        className,
      )}
      dir="auto"
    >
      {children}
    </span>
  );
}
