'use client';

import { Download, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { navLinks, profile } from '@/lib/data';
import { cn } from '@/lib/utils';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* ————— ظل الشريط عند التمرير ————— */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ————— تمييز القسم النشط ————— */
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* ————— قفل التمرير + Escape + حبس التركيز داخل القائمة الجانبية ————— */
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const first = drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const nodes = drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-line/60 shadow-soft'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-3 sm:h-[72px]"
        aria-label="التنقّل الرئيسي"
      >
        {/* الشعار */}
        <a
          href="#hero"
          className="flex shrink-0 items-center gap-2.5 rounded-xl"
          aria-label={`${profile.shortName} — العودة إلى الأعلى`}
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-xl grad-cta text-sm font-bold text-white shadow-soft"
            aria-hidden="true"
          >
            {profile.initials}
          </span>
          <span className="hidden text-sm font-bold leading-tight text-ink sm:block">
            {profile.shortName}
          </span>
        </a>

        {/* روابط سطح المكتب */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                aria-current={active === link.id ? 'true' : undefined}
                className={cn(
                  'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                  active === link.id
                    ? 'text-accent'
                    : 'text-muted hover:text-ink',
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent transition-transform duration-300',
                    active === link.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* الإجراءات */}
        <div className="flex items-center gap-2">
          <a
            href={profile.cvPath}
            download
            className="hidden items-center gap-2 rounded-xl grad-cta px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            السيرة الذاتية
          </a>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="فتح قائمة التنقّل"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface/70 text-muted transition-colors hover:border-accent/40 hover:text-accent lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ————— القائمة الجانبية للجوال (تنزلق من جهة البداية = اليمين) ————— */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            'absolute inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={close}
        />

        <div
          ref={drawerRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التنقّل"
          className={cn(
            'absolute inset-y-0 start-0 flex h-full w-[82%] max-w-xs flex-col gap-1 border-e border-line bg-surface p-5 shadow-lift transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full',
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-ink">القائمة</span>
            <button
              type="button"
              onClick={() => {
                close();
                triggerRef.current?.focus();
              }}
              aria-label="إغلاق القائمة"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={close}
              className={cn(
                'rounded-xl px-4 py-3 text-base font-medium transition-colors',
                active === link.id
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-line/40 hover:text-ink',
              )}
            >
              {link.label}
            </a>
          ))}

          <a
            href={profile.cvPath}
            download
            onClick={close}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl grad-cta px-4 py-3 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            تحميل السيرة الذاتية
          </a>
        </div>
      </div>
    </header>
  );
}
