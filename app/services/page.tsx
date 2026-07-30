'use client';

import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { buildGeneralWhatsAppUrl, isValidWhatsAppNumber } from '@/lib/whatsapp';

const SERVICES = [
  {
    icon: '🛋️',
    title: 'بيع الأثاث الجاهز',
    text: 'تشكيلة واسعة من غرف النوم والمعيشة والطعام وقطع الديكور جاهزة للتسليم الفوري.',
  },
  {
    icon: '✏️',
    title: 'التفصيل حسب الطلب',
    text: 'نصنع القطعة بالمقاس واللون والخامة التي تختارها لتناسب مساحتك تماماً.',
  },
  {
    icon: '🏠',
    title: 'استشارات التصميم الداخلي',
    text: 'مساعدة هندسية في توزيع الأثاث واختيار الألوان بما يناسب حجم الغرفة وإضاءتها.',
  },
  {
    icon: '🚚',
    title: 'التوصيل والتركيب',
    text: 'فريق متخصص يوصّل القطع ويركّبها في مكانها داخل الخرطوم وبقية الولايات.',
  },
  {
    icon: '🧰',
    title: 'الصيانة وقطع الغيار',
    text: 'خدمة صيانة وتوفير قطع غيار للأثاث الذي اشتريته من المعرض.',
  },
  {
    icon: '🏢',
    title: 'تجهيز المشاريع',
    text: 'تجهيز الشقق والفنادق والمكاتب بأثاث متكامل بأسعار الجملة.',
  },
];

export default function ServicesPage() {
  const { settings } = useSettings();
  const waUrl = isValidWhatsAppNumber(settings.whatsappNumber)
    ? buildGeneralWhatsAppUrl(
        settings.whatsappNumber,
        'السلام عليكم، أرغب في الاستفسار عن خدماتكم.',
      )
    : '';

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="container-page py-10">
        <h1 className="heading-underline text-2xl font-extrabold text-navy sm:text-3xl">خدماتنا</h1>
        <p className="mt-4 max-w-2xl text-sm leading-loose text-navy-400">
          لا نكتفي ببيع الأثاث — نرافقك من اختيار القطعة حتى تركيبها في مكانها.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-softgray bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-2xl">
                {service.icon}
              </span>
              <h2 className="text-base font-bold text-navy">{service.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-300">{service.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-gold/40 bg-gold/10 px-6 py-9 text-center">
          <h2 className="text-lg font-extrabold text-navy">تحتاج خدمة معيّنة؟</h2>
          <p className="max-w-xl text-sm text-navy-400">
            راسلنا على واتساب واشرح لنا ما تحتاجه، وسنرد عليك بالتفاصيل والأسعار.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#25D366] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
              >
                راسلنا على واتساب
              </a>
            )}
            <Link
              href="/products"
              className="rounded-lg border-2 border-gold px-6 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold"
            >
              تصفح المعرض
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
