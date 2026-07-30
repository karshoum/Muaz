import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

export function RatingStars({ value, className, size = 'sm', showValue }: RatingStarsProps) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  const dimension = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      role="img"
      aria-label={`التقييم ${rounded} من 5`}
      data-testid="rating-stars"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className={cn(dimension, index < rounded ? 'text-gold' : 'text-softgray')}
          fill="currentColor"
          aria-hidden
        >
          <path d="m12 2 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.1 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2z" />
        </svg>
      ))}
      {showValue && <span className="ms-1 text-xs font-semibold text-navy-300">{rounded}.0</span>}
    </div>
  );
}
