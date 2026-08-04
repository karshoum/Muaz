import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

import { profile } from '@/lib/data';
import './globals.css';

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  // ٤ أوزان فقط — الوزن ٣٠٠ غير مستخدم في أي مكان، والخطوط العربية ثقيلة
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s | ${profile.shortName}`,
  },
  description: profile.summary,
  keywords: [
    'معاذ كرشوم',
    'معاذ محمد كرشوم حسن',
    'مهندس برمجيات السودان',
    'اختصاصي ذكاء اصطناعي',
    'أتمتة العمليات',
    'جامعة كردفان',
    'تقانة المعلومات',
    'مطور Next.js',
    'قواعد بيانات',
    'أم درمان',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'profile',
    locale: 'ar_SD',
    url: profile.siteUrl,
    siteName: profile.name,
    title: `${profile.name} — ${profile.headline}`,
    description: profile.subtitle,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.headline}`,
    description: profile.subtitle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#070a14' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * يُنفَّذ قبل الطلاء الأول فيمنع وميض الثيم (FOUC) واختلاف الترطيب.
 * مكتوب بلا اعتماد على أي حزمة لأنه يعمل قبل تحميل React.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored
      ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {}
})();
`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.nameEn,
  jobTitle: profile.headline,
  description: profile.summary,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: profile.siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'أم درمان',
    addressCountry: 'SD',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'جامعة كردفان',
  },
  worksFor: {
    '@type': 'CollegeOrUniversity',
    name: 'جامعة كردفان',
  },
  knowsAbout: [
    'تطوير البرمجيات',
    'الذكاء الاصطناعي التوليدي',
    'أتمتة العمليات',
    'قواعد البيانات',
    'تدريس تقانة المعلومات',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          تخطَّ إلى المحتوى الرئيسي
        </a>
        {children}
      </body>
    </html>
  );
}
