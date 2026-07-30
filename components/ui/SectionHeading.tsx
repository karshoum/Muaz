import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        {eyebrow}
      </span>

      <h2 className="text-balance text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            'text-pretty text-base leading-8 text-muted',
            align === 'center' ? 'max-w-2xl' : 'max-w-3xl',
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
