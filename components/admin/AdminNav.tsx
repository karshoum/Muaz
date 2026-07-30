'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isCloudMode } from '@/lib/data';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'لوحة القيادة', icon: '📊', exact: true },
  { href: '/admin/products', label: 'المنتجات', icon: '🛋️' },
  { href: '/admin/products/new', label: 'إضافة قطعة', icon: '➕' },
  { href: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
];

export function AdminNav() {
  const pathname = usePathname();
  const { email, signOut } = useAuth();
  const cloud = isCloudMode();

  return (
    <header className="border-b border-softgray bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
        <Logo href="/admin" />
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'hidden rounded-full px-3 py-1 text-[11px] font-bold sm:inline',
              cloud ? 'bg-green-100 text-green-800' : 'bg-gold/20 text-gold-700',
            )}
          >
            {cloud ? '☁️ متصل بـ Supabase' : '💾 تخزين محلي'}
          </span>
          {email && <span className="hidden text-xs text-navy-300 md:inline">{email}</span>}
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-softgray px-3 py-1.5 text-xs font-bold text-navy transition-colors hover:border-gold"
          >
            عرض الموقع
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-lg bg-navy px-3 py-1.5 text-xs font-bold text-cream transition-colors hover:bg-navy-600"
          >
            خروج
          </button>
        </div>
      </div>

      <nav className="container-page flex gap-1 overflow-x-auto pb-2" aria-label="قائمة لوحة التحكم">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold transition-colors',
                active ? 'bg-gold text-navy' : 'text-navy hover:bg-softgray',
              )}
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
