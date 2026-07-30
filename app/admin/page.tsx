'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { PageLoader } from '@/components/ui/Spinner';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import { isValidWhatsAppNumber, formatPhoneForDisplay } from '@/lib/whatsapp';

export default function AdminDashboardPage() {
  const { products, loading } = useProducts({ includeUnpublished: true });
  const { settings } = useSettings();

  const stats = useMemo(() => {
    const published = products.filter((p) => p.published).length;
    const outOfStock = products.filter((p) => !p.inStock).length;
    const demo = products.filter((p) => p.isDemo).length;
    const withoutImages = products.filter((p) => p.images.length === 0).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    return { published, outOfStock, demo, withoutImages, totalValue };
  }, [products]);

  if (loading) return <PageLoader label="جاري تحميل البيانات..." />;

  const cards = [
    { label: 'إجمالي القطع', value: String(products.length), icon: '🛋️' },
    { label: 'منشورة للعملاء', value: String(stats.published), icon: '✅' },
    { label: 'غير متوفرة', value: String(stats.outOfStock), icon: '⛔' },
    { label: 'بيانات تجريبية', value: String(stats.demo), icon: '🧪' },
  ];

  const whatsappReady = isValidWhatsAppNumber(settings.whatsappNumber);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-underline text-xl font-extrabold text-navy">لوحة القيادة</h1>
        <p className="mt-2 text-sm text-navy-300">نظرة سريعة على حالة المعرض.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-softgray bg-white p-4">
            <span className="text-2xl" aria-hidden>
              {card.icon}
            </span>
            <p className="ltr-nums mt-2 text-2xl font-extrabold text-navy">{card.value}</p>
            <p className="mt-0.5 text-xs font-semibold text-navy-300">{card.label}</p>
          </div>
        ))}
      </div>

      {/* تنبيهات تحتاج إجراءً */}
      <div className="space-y-2.5">
        {!whatsappReady && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-800">رقم واتساب الطلبات غير مضبوط</p>
            <p className="mt-1 text-xs leading-relaxed text-red-700">
              لن يستطيع العملاء إرسال الطلبات حتى تضيف رقماً صحيحاً.
            </p>
            <Link
              href="/admin/settings"
              className="mt-2.5 inline-block rounded-lg bg-red-700 px-4 py-2 text-xs font-bold text-white"
            >
              ضبط الرقم الآن
            </Link>
          </div>
        )}

        {stats.withoutImages > 0 && (
          <div className="rounded-xl border border-gold/50 bg-gold/10 p-4">
            <p className="text-sm font-bold text-navy">
              {stats.withoutImages} قطعة بدون صور
            </p>
            <p className="mt-1 text-xs leading-relaxed text-navy-400">
              أضف صوراً لها من معرض الجهاز أو بالكاميرا لتظهر باحترافية للعملاء.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* توزيع الأقسام */}
        <section className="rounded-2xl border border-softgray bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-navy">القطع حسب القسم</h2>
          <ul className="space-y-2.5">
            {CATEGORIES.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length;
              const percent = products.length ? (count / products.length) * 100 : 0;
              return (
                <li key={cat.slug}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold">
                    <span className="text-navy">{cat.name}</span>
                    <span className="ltr-nums text-navy-300">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-softgray">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ملخص الإعدادات */}
        <section className="rounded-2xl border border-softgray bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-navy">إعدادات التواصل الحالية</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-navy-300">واتساب الطلبات</dt>
              <dd className="ltr-nums font-bold text-navy">
                {whatsappReady ? formatPhoneForDisplay(settings.whatsappNumber) : 'غير مضبوط'}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-navy-300">العنوان</dt>
              <dd className="text-end font-semibold text-navy">{settings.address || '—'}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-navy-300">العملة</dt>
              <dd className="font-bold text-navy">{settings.currency}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-navy-300">إجمالي قيمة المعروض</dt>
              <dd className="ltr-nums font-bold text-gold-600">
                {formatPrice(stats.totalValue, settings.currency)}
              </dd>
            </div>
          </dl>
          <Link
            href="/admin/settings"
            className="mt-5 inline-block rounded-lg border-2 border-gold px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-gold"
          >
            تعديل الإعدادات
          </Link>
        </section>
      </div>
    </div>
  );
}
