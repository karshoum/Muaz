import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  oldPrice?: number | null;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export function PriceTag({ price, oldPrice, currency = 'ج.س', className, size = 'md' }: PriceTagProps) {
  const hasDiscount = typeof oldPrice === 'number' && oldPrice > price;

  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-extrabold text-gold-600', SIZES[size])} data-testid="price">
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-xs font-medium text-navy-200 line-through" data-testid="old-price">
          {formatPrice(oldPrice as number, currency)}
        </span>
      )}
    </div>
  );
}
