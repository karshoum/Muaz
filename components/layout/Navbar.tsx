'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { buildGeneralWhatsAppUrl, isValidWhatsAppNumber } from '@/lib/whatsapp';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
  { label: 'الأقسام', href: '/products' },
  { label: 'الخدمات', href: '/services' },
  { label: 'تواصل معنا', href: '/contact' },
];

/** useSearchParams يحتاج حدود Suspense حتى لا تفشل الصفحات الثابتة عند البناء */
function SearchForm({ className, onDone }: { className?: string; onDone?: () => void }) {
  return (
    <Suspense fallback={<div className={cn('h-10 rounded-full bg-softgray/60', className)} />}>
      <SearchFormInner className={className} onDone={onDone} />
    </Suspense>
  );
}

function SearchFormInner({ className, onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(params.get('q') ?? '');
  }, [params]);

  return (
    <form
      role="search"
      className={cn('relative flex items-center', className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
        onDone?.();
      }}
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="بحث عن المنتجات"
        aria-label="بحث عن المنتجات"
        className="h-10 w-full rounded-full border border-softgray bg-white pe-4 ps-10 text-sm text-navy placeholder:text-navy-200 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
      />
      <button
        type="submit"
        aria-label="ابحث"
        className="absolute start-1 flex h-8 w-8 items-center justify-center rounded-full text-navy-300 transition-colors hover:bg-softgray hover:text-gold"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const waUrl = isValidWhatsAppNumber(settings.whatsappNumber)
    ? buildGeneralWhatsAppUrl(settings.whatsappNumber)
    : '';

  return (
    <header className="sticky top-0 z-50 border-b border-softgray bg-white/95 backdrop-blur">
      <div className="container-page">
        {/* الصف الأول: اللوجو والأيقونات */}
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy transition-colors hover:bg-softgray lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <Logo className="mx-auto lg:mx-0" />

          <div className="flex items-center gap-1.5">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل عبر واتساب"
                className="hidden h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1DA851] sm:flex"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.47-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.21.88 2.39 1.01 2.55.12.17 1.73 2.64 4.2 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
                </svg>
                واتساب
              </a>
            )}
            <Link
              href="/admin"
              aria-label="لوحة تحكم المدير"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-softgray text-navy transition-colors hover:border-gold hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* الصف الثاني: الروابط والبحث (سطح المكتب) */}
        <div className="hidden items-center justify-between gap-6 border-t border-softgray/70 py-2.5 lg:flex">
          <nav className="flex items-center gap-1" aria-label="القائمة الرئيسية">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-3.5 py-2 text-sm font-bold transition-colors',
                    active ? 'text-gold' : 'text-navy hover:text-gold',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <SearchForm className="w-72" />
        </div>

        {/* البحث على الجوال */}
        <div className="pb-3 lg:hidden">
          <SearchForm />
        </div>
      </div>

      {/* القائمة المنسدلة للجوال */}
      {menuOpen && (
        <div className="border-t border-softgray bg-white lg:hidden" data-testid="mobile-menu">
          <nav className="container-page flex flex-col py-2" aria-label="قائمة الجوال">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-lg px-3 py-3 text-sm font-bold transition-colors',
                  pathname === link.href ? 'bg-gold/10 text-gold' : 'text-navy hover:bg-softgray',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-softgray pt-2">
              <p className="px-3 pb-1 text-xs font-bold text-navy-300">الأقسام</p>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="block rounded-lg px-3 py-2.5 text-sm text-navy transition-colors hover:bg-softgray"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
