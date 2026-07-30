'use client';

import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SITE_FULL_NAME } from '@/lib/constants';

const VALUES = [
  {
    icon: '📐',
    title: 'دقة هندسية',
    text: 'كل قطعة تمرّ بمراجعة هندسية للمقاسات والخامات قبل وصولها إليك.',
  },
  {
    icon: '🌿',
    title: 'خامات مختارة',
    text: 'أخشاب وأقمشة عالية الجودة تتحمّل الاستخدام اليومي وتحافظ على مظهرها.',
  },
  {
    icon: '🤝',
    title: 'خدمة صادقة',
    text: 'نصيحة أمينة قبل الشراء، ومتابعة بعد البيع حتى تستقر القطعة في مكانها.',
  },
];

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="container-page py-10">
        <h1 className="heading-underline text-2xl font-extrabold text-navy sm:text-3xl">من نحن</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-loose text-navy-400">
            <p>
              <span className="font-bold text-navy">{SITE_FULL_NAME}</span> معرض متخصص في الأثاث
              المنزلي والديكور الداخلي في السودان. بدأنا من فكرة بسيطة: أن يجد كل بيت سوداني أثاثاً
              يجمع بين الجودة والذوق الرفيع بسعر منصف.
            </p>
            <p>
              نقدّم تشكيلة تشمل غرف النوم وغرف الأطفال والدواليب وأثاث غرف المعيشة وطاولات الطعام
              وقطع الديكور، مع إمكانية التفصيل حسب مقاسات منزلك وألوانك المفضلة.
            </p>
            <p>
              خبرتنا الهندسية في التصميم الداخلي تجعلنا لا نبيع قطعة أثاث فحسب، بل نساعدك في اختيار
              ما يناسب مساحتك وإضاءتها وطراز بيتك.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-softgray">
            <img
              src="/images/hero/hero-1.svg"
              alt="من داخل معرض الراقي الهندسي"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-softgray bg-white p-5 shadow-card"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-2xl">
                {value.icon}
              </span>
              <h2 className="text-base font-bold text-navy">{value.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-300">{value.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-navy px-6 py-9 text-center">
          <h2 className="text-xl font-extrabold text-cream">تفضّل بزيارة المعرض</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-cream/75">
            شاهد القطع على الطبيعة واستشر فريقنا في اختيار ما يناسب منزلك.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
          >
            بيانات التواصل والعنوان
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
