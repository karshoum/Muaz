'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { useToast } from '@/components/ui/Toast';
import { CATEGORIES, SITE_FULL_NAME } from '@/lib/constants';
import { formatPhoneForDisplay, isValidWhatsAppNumber, buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.4" />
    </>
  ),
  tiktok: (
    <path d="M16 3c.4 2.2 1.9 3.7 4 4v3c-1.5 0-2.9-.4-4-1.2V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3z" />
  ),
  twitter: (
    <path d="M21 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.5 1a3.9 3.9 0 0 0-6.6 3.5A11 11 0 0 1 3.5 4.6a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.8-.5a3.9 3.9 0 0 0 3.1 3.8c-.6.2-1.2.2-1.8.1a3.9 3.9 0 0 0 3.6 2.7A7.8 7.8 0 0 1 2 17.5 11 11 0 0 0 8 19.3c7.2 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.3 1.8-2.1z" />
  ),
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'فيسبوك',
  instagram: 'إنستقرام',
  tiktok: 'تيك توك',
  twitter: 'إكس (تويتر)',
};

export function Footer() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const socials = (['instagram', 'facebook', 'tiktok', 'twitter'] as const).filter((key) =>
    settings[key]?.trim(),
  );

  return (
    <footer className="mt-16 bg-navy text-cream">
      <div className="pattern-gold h-1.5 w-full bg-gold/20" aria-hidden />
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        {/* العمود الأول: الهوية والتواصل */}
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {SITE_FULL_NAME} — تشكيلة مختارة من الأثاث والديكور العصري، بخدمة توصيل وتركيب داخل
            السودان.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-cream/80">
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <span className="text-gold" aria-hidden>
                  📍
                </span>
                <span>{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex items-center gap-2.5">
                <span className="text-gold" aria-hidden>
                  📞
                </span>
                <a href={`tel:${settings.phone}`} className="ltr-nums hover:text-gold">
                  {formatPhoneForDisplay(settings.phone)}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2.5">
                <span className="text-gold" aria-hidden>
                  ✉️
                </span>
                <a href={`mailto:${settings.email}`} className="ltr-nums hover:text-gold">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.workingHours && (
              <li className="flex items-start gap-2.5">
                <span className="text-gold" aria-hidden>
                  🕒
                </span>
                <span>{settings.workingHours}</span>
              </li>
            )}
          </ul>
        </div>

        {/* العمود الثاني: الأقسام */}
        <div>
          <h3 className="mb-4 text-base font-bold text-gold">الأقسام</h3>
          <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 md:grid-cols-1">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="text-cream/75 transition-colors hover:text-gold"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* العمود الثالث: روابط سريعة والنشرة */}
        <div>
          <h3 className="mb-4 text-base font-bold text-gold">الخدمات</h3>
          <ul className="mb-6 space-y-2 text-sm">
            {[
              { label: 'المعرض', href: '/products' },
              { label: 'من نحن', href: '/about' },
              { label: 'خدماتنا', href: '/services' },
              { label: 'تواصل معنا', href: '/contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-cream/75 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 text-base font-bold text-gold">اشترك في نشرتنا</h3>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmail('');
              toast('تم تسجيل بريدك، شكراً لاشتراكك!');
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              aria-label="بريدك الإلكتروني للنشرة"
              className="h-10 min-w-0 flex-1 rounded-lg border border-cream/20 bg-navy-600 px-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              aria-label="اشتراك"
              className="flex h-10 w-11 shrink-0 items-center justify-center rounded-lg bg-gold text-navy transition-colors hover:bg-gold-400"
            >
              ✉
            </button>
          </form>

          {socials.length > 0 && (
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map((key) => (
                <a
                  key={key}
                  href={settings[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={SOCIAL_LABELS[key]}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    {SOCIAL_ICONS[key]}
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_FULL_NAME}. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-gold">
              الشروط والأحكام
            </Link>
            <Link href="/contact" className="hover:text-gold">
              سياسة الخصوصية
            </Link>
          </div>
        </div>
      </div>

      {/* زر واتساب عائم — يظهر على كل الصفحات */}
      {isValidWhatsAppNumber(settings.whatsappNumber) && (
        <a
          href={buildGeneralWhatsAppUrl(settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          data-testid="floating-whatsapp"
          className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card-hover transition-transform hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm4.52 12.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.47-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.21.88 2.39 1.01 2.55.12.17 1.73 2.64 4.2 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
          </svg>
        </a>
      )}
    </footer>
  );
}
