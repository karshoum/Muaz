import Link from 'next/link';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** معيّن هندسي ذهبي — العنصر المتكرر في هوية المعرض */
function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} aria-hidden focusable="false">
      <path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 6.2 17.8 12 12 17.8 6.2 12z" fill="currentColor" opacity=".35" />
      <path d="M12 9.4 14.6 12 12 14.6 9.4 12z" fill="currentColor" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  href?: string;
}

export function Logo({ className, variant = 'dark', href = '/' }: LogoProps) {
  const isLight = variant === 'light';

  return (
    <Link
      href={href}
      aria-label={`${SITE_NAME} ${SITE_TAGLINE} — الصفحة الرئيسية`}
      className={cn('group flex items-center gap-2.5', className)}
    >
      <Diamond className={cn('h-6 w-6 shrink-0 text-gold transition-transform group-hover:rotate-45')} />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            'text-lg font-extrabold tracking-tight sm:text-xl',
            isLight ? 'text-cream' : 'text-navy',
          )}
        >
          {SITE_NAME}
        </span>
        <span className="text-[11px] font-semibold tracking-[0.2em] text-gold sm:text-xs">
          {SITE_TAGLINE}
        </span>
      </span>
      <Diamond
        className={cn(
          'hidden h-6 w-6 shrink-0 text-gold transition-transform group-hover:-rotate-45 sm:block',
        )}
      />
    </Link>
  );
}
