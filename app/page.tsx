'use client';

import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { SectionHeader } from '@/components/home/SectionHeader';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState, Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSettings } from '@/lib/settings/SettingsProvider';

const FEATURES = [
  { icon: '🚚', title: 'توصيل وتركيب', text: 'خدمة توصيل وتركيب داخل الخرطوم وبقية الولايات' },
  { icon: '🛠️', title: 'ضمان الجودة', text: 'خامات مختارة وتشطيب هندسي دقيق لكل قطعة' },
  { icon: '💬', title: 'طلب فوري', text: 'اطلب أي قطعة مباشرة عبر واتساب في ثوانٍ' },
  { icon: '🎨', title: 'تفصيل حسب الطلب', text: 'نصمّم قطعاً بمقاسات وألوان تناسب مساحتك' },
];

export default function HomePage() {
  const { products, loading } = useProducts();
  const { settings } = useSettings();

  const featured = products.filter((p) => p.featured).slice(0, 8);
  const latest = products.slice(0, 8);
  const showcase = featured.length > 0 ? featured : latest;

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main>
        <HeroSlider />

        {/* الأقسام */}
        <section className="container-page py-10 sm:py-14">
          <SectionHeader
            title="الأقسام"
            subtitle="تصفح تشكيلتنا حسب القسم الذي يناسبك"
            href="/products"
          />
          <CategoryGrid />
        </section>

        {/* شريط المزايا */}
        <section className="bg-white py-8">
          <div className="container-page grid grid-cols-2 gap-4 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-xl">
                  {feature.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-navy">{feature.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-navy-300">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* المنتجات */}
        <section className="container-page py-10 sm:py-14">
          <SectionHeader
            title={featured.length > 0 ? 'قطع مميزة' : 'أحدث القطع'}
            subtitle="اضغط على زر واتساب لطلب أي قطعة مباشرة"
            href="/products"
          />

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner className="h-9 w-9" />
            </div>
          ) : showcase.length === 0 ? (
            <EmptyState
              title="لا توجد منتجات بعد"
              message="ابدأ بإضافة قطع الأثاث من لوحة تحكم المدير لتظهر هنا مباشرة."
              action={
                <Link
                  href="/admin"
                  className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
                >
                  الذهاب إلى لوحة التحكم
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {showcase.map((product) => (
                <ProductCard key={product.id} product={product} settings={settings} />
              ))}
            </div>
          )}
        </section>

        {/* دعوة للتواصل */}
        <section className="container-page pb-14">
          <div className="pattern-gold overflow-hidden rounded-2xl bg-navy px-6 py-10 text-center sm:px-12">
            <h2 className="text-xl font-extrabold text-cream sm:text-2xl">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-cream/75">
              نصنع قطع الأثاث حسب الطلب بمقاسات وألوان تناسب مساحتك. تواصل معنا وسنساعدك في اختيار
              الأنسب لمنزلك.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-gold px-7 py-3 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
            >
              تواصل معنا
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
