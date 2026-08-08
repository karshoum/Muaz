'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductImage } from '@/components/product/ProductImage';
import { PriceTag } from '@/components/product/PriceTag';
import { RatingStars } from '@/components/product/RatingStars';
import { WhatsAppOrderButton } from '@/components/product/WhatsAppOrderButton';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/home/SectionHeader';
import { EmptyState, PageLoader } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useProduct, useProducts } from '@/lib/hooks/useProducts';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { categoryLabel } from '@/lib/format';
import { buildCopyText, copyToClipboard } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { product, loading } = useProduct(params.id);
  const { products } = useProducts();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);

  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="container-page py-8">
        {loading ? (
          <PageLoader label="جاري تحميل بيانات القطعة..." />
        ) : !product ? (
          <EmptyState
            title="القطعة غير موجودة"
            message="ربما حُذفت هذه القطعة أو أن الرابط غير صحيح."
            action={
              <Link
                href="/products"
                className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
              >
                العودة إلى المعرض
              </Link>
            }
          />
        ) : (
          <>
            <nav aria-label="مسار التصفح" className="mb-5 text-xs text-navy-300">
              <Link href="/" className="hover:text-gold">
                الرئيسية
              </Link>
              <span className="mx-1.5">/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-gold">
                {categoryLabel(product.category)}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="font-semibold text-navy">{product.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* معرض الصور */}
              <div>
                <ProductImage
                  image={product.images[activeImage] ?? product.images[0]}
                  alt={product.name}
                  className="aspect-[4/3] w-full rounded-2xl border border-softgray"
                  imgClassName="object-contain bg-white"
                />
                {product.images.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`عرض الصورة ${index + 1}`}
                        className={cn(
                          'h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors',
                          index === activeImage ? 'border-gold' : 'border-softgray hover:border-gold/60',
                        )}
                      >
                        <ProductImage image={image} alt="" className="h-full w-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* التفاصيل */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-700">
                    {categoryLabel(product.category)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    )}
                  >
                    {product.inStock ? 'متوفر' : 'غير متوفر حالياً'}
                  </span>
                </div>

                <h1 className="text-2xl font-extrabold leading-snug text-navy sm:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <RatingStars value={product.rating} size="md" showValue />
                  <span className="ltr-nums rounded-md bg-softgray px-2.5 py-1 text-xs font-bold text-navy-400">
                    كود القطعة: {product.code}
                  </span>
                </div>

                {settings.showPrices ? (
                  <PriceTag
                    price={product.price}
                    oldPrice={product.oldPrice}
                    currency={settings.currency}
                    size="lg"
                    className="mt-5"
                  />
                ) : (
                  <p className="mt-5 text-xl font-extrabold text-gold-600">
                    السعر عند الطلب — راسلنا على واتساب
                  </p>
                )}

                {product.description && (
                  <div className="mt-5 rounded-xl border border-softgray bg-white p-4">
                    <h2 className="mb-2 text-sm font-bold text-navy">الوصف</h2>
                    <p className="whitespace-pre-line text-sm leading-loose text-navy-400">
                      {product.description}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <WhatsAppOrderButton
                    product={product}
                    settings={settings}
                    size="lg"
                    fullWidth
                    label="اطلب هذه القطعة عبر واتساب"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={async () => {
                      const ok = await copyToClipboard(
                        buildCopyText(product, settings.currency, settings.showPrices),
                      );
                      toast(
                        ok ? 'تم نسخ بيانات القطعة.' : 'تعذّر النسخ، انسخ البيانات يدوياً.',
                        ok ? 'success' : 'error',
                      );
                    }}
                    className="sm:w-auto"
                  >
                    نسخ البيانات
                  </Button>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-navy-300">
                  {settings.showPrices
                    ? 'عند الضغط على زر واتساب تُنسخ بيانات القطعة تلقائياً وتُفتح محادثة تحتوي على اسم القطعة والكود والسعر جاهزة للإرسال.'
                    : 'عند الضغط على زر واتساب تُنسخ بيانات القطعة تلقائياً وتُفتح محادثة تحتوي على اسم القطعة والكود جاهزة للإرسال، ويوافيك المعرض بالسعر.'}
                </p>
              </div>
            </div>

            {related.length > 0 && (
              <section className="mt-14">
                <SectionHeader
                  title="قطع مشابهة"
                  href={`/products?category=${product.category}`}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((item) => (
                    <ProductCard key={item.id} product={item} settings={settings} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
