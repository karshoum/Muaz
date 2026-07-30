import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_FULL_NAME } from '@/lib/constants';
import { Providers } from '@/app/providers';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_FULL_NAME} | أثاث وديكور في السودان`,
    template: `%s | ${SITE_FULL_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'أثاث السودان',
    'ديكور الخرطوم',
    'غرف نوم',
    'دواليب',
    'طاولات طعام',
    'معرض الراقي الهندسي',
  ],
  openGraph: {
    title: SITE_FULL_NAME,
    description: SITE_DESCRIPTION,
    locale: 'ar_SD',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1D232A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen bg-cream font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
