'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Field';
import { ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState, PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { ProductImage } from '@/components/product/ProductImage';
import { deleteDemoProducts, deleteProduct, updateProduct } from '@/lib/data';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { CATEGORIES } from '@/lib/constants';
import { categoryLabel, formatDate, formatPrice, normalizeArabic } from '@/lib/format';
import type { Product } from '@/lib/data/types';

export default function AdminProductsPage() {
  const { products, loading, reload } = useProducts({ includeUnpublished: true });
  const { settings } = useSettings();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState<Product | null>(null);
  const [demoConfirm, setDemoConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const demoCount = products.filter((p) => p.isDemo).length;

  const visible = useMemo(() => {
    const q = normalizeArabic(query);
    return products.filter((product) => {
      if (category && product.category !== category) return false;
      if (!q) return true;
      return normalizeArabic(`${product.name} ${product.code}`).includes(q);
    });
  }, [products, query, category]);

  const confirmDelete = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await deleteProduct(target.id);
      toast('تم حذف القطعة.');
      setTarget(null);
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'تعذّر حذف القطعة.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmDemoCleanup = async () => {
    setBusy(true);
    try {
      const count = await deleteDemoProducts();
      toast(`تم حذف ${count} قطعة تجريبية.`);
      setDemoConfirm(false);
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'تعذّر حذف البيانات التجريبية.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (product: Product) => {
    try {
      await updateProduct(product.id, { published: !product.published });
      await reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'تعذّر تحديث حالة النشر.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-underline text-xl font-extrabold text-navy">إدارة المنتجات</h1>
          <p className="mt-2 text-sm text-navy-300">
            <span className="ltr-nums font-bold text-navy">{products.length}</span> قطعة في المعرض
          </p>
        </div>
        <div className="flex gap-2">
          {demoCount > 0 && (
            <Button variant="outline" onClick={() => setDemoConfirm(true)}>
              🧹 مسح البيانات التجريبية ({demoCount})
            </Button>
          )}
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center rounded-lg bg-gold px-5 text-sm font-bold text-navy transition-colors hover:bg-gold-400"
          >
            ➕ إضافة قطعة
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم أو الكود..."
          aria-label="بحث في المنتجات"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="تصفية بالقسم"
          className="sm:w-56"
        >
          <option value="">كل الأقسام</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <PageLoader />
      ) : visible.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? 'لا توجد منتجات' : 'لا توجد نتائج'}
          message={
            products.length === 0
              ? 'ابدأ بإضافة أول قطعة أثاث، وصوّرها من الكاميرا أو ارفعها من معرض جهازك.'
              : 'جرّب تغيير كلمة البحث أو القسم.'
          }
          action={
            <Link
              href="/admin/products/new"
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy"
            >
              إضافة قطعة جديدة
            </Link>
          }
        />
      ) : (
        <>
          {/* جدول لسطح المكتب */}
          <div className="hidden overflow-x-auto rounded-2xl border border-softgray bg-white lg:block">
            <table className="w-full text-sm">
              <thead className="bg-softgray/50 text-xs text-navy-400">
                <tr>
                  <th className="p-3 text-start font-bold">القطعة</th>
                  <th className="p-3 text-start font-bold">الكود</th>
                  <th className="p-3 text-start font-bold">القسم</th>
                  <th className="p-3 text-start font-bold">السعر</th>
                  <th className="p-3 text-start font-bold">الحالة</th>
                  <th className="p-3 text-start font-bold">أُضيفت</th>
                  <th className="p-3 text-start font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => (
                  <tr key={product.id} className="border-t border-softgray">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          image={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-lg"
                        />
                        <span className="font-bold text-navy">{product.name}</span>
                      </div>
                    </td>
                    <td className="ltr-nums p-3 text-navy-300">{product.code}</td>
                    <td className="p-3 text-navy-400">{categoryLabel(product.category)}</td>
                    <td className="ltr-nums p-3 font-bold text-gold-600">
                      {formatPrice(product.price, settings.currency)}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => void togglePublished(product)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          product.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-softgray text-navy-300'
                        }`}
                      >
                        {product.published ? 'منشورة' : 'مخفية'}
                      </button>
                    </td>
                    <td className="p-3 text-xs text-navy-300">{formatDate(product.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-md bg-softgray px-2.5 py-1.5 text-xs font-bold text-navy hover:bg-gold/30"
                        >
                          تعديل
                        </Link>
                        <button
                          type="button"
                          onClick={() => setTarget(product)}
                          className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* بطاقات للجوال */}
          <ul className="space-y-3 lg:hidden">
            {visible.map((product) => (
              <li
                key={product.id}
                className="flex gap-3 rounded-2xl border border-softgray bg-white p-3"
              >
                <ProductImage
                  image={product.images[0]}
                  alt={product.name}
                  className="h-20 w-20 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-navy">{product.name}</h3>
                  <p className="ltr-nums mt-0.5 text-xs text-navy-300">{product.code}</p>
                  <p className="ltr-nums mt-1 text-sm font-bold text-gold-600">
                    {formatPrice(product.price, settings.currency)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-md bg-softgray px-2.5 py-1.5 text-xs font-bold text-navy"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      onClick={() => void togglePublished(product)}
                      className="rounded-md bg-softgray px-2.5 py-1.5 text-xs font-bold text-navy"
                    >
                      {product.published ? 'إخفاء' : 'نشر'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget(product)}
                      className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="حذف القطعة"
        message={`سيتم حذف "${target?.name ?? ''}" نهائياً. لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="نعم، احذف"
        loading={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setTarget(null)}
      />

      <ConfirmDialog
        open={demoConfirm}
        title="مسح البيانات التجريبية"
        message={`سيتم حذف ${demoCount} قطعة تجريبية أُضيفت تلقائياً عند أول تشغيل. لن تتأثر القطع التي أضفتها بنفسك.`}
        confirmLabel="نعم، امسحها"
        loading={busy}
        onConfirm={() => void confirmDemoCleanup()}
        onCancel={() => setDemoConfirm(false)}
      />
    </div>
  );
}
