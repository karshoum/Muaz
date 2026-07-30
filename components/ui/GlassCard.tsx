import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** يضيف ارتفاعًا وحدًّا مضيئًا عند المرور */
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  interactive = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-3xl shadow-soft',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </div>
  );
}
