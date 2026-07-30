import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'عرض الكل',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="heading-underline text-xl font-extrabold text-navy sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-navy-300">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 rounded-lg border border-gold px-3.5 py-2 text-xs font-bold text-gold-600 transition-colors hover:bg-gold hover:text-navy sm:text-sm"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
