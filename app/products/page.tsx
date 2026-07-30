'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState, PageLoader } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Field';
import { CATEGORIES } from '@/lib/constants';
import { normalizeArabic } from '@/lib/format';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { cn } from '@/lib/utils';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'rating';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'newest', label: 'الأحدث أولاً' },
  { value: 'price-asc', label: 'السعر: من الأقل' },
  { value: 'price-desc', label: 'السعر: من الأعلى' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];

function ProductsBrowser() {
  const params = useSearchParams();
  const { products, loading, error } = useProducts();
  const { settings } = useSettings();
  const [sort, setSort] = useState<SortKey>('newest');

  const activeCategory = params.get('category') ?? '';
  const query = params.get('q') ?? '';

  const visible = useMemo(() => {
    const normalizedQuery = normalizeArabic(query);
    let result = products;

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (normalizedQuery) {
      result = result.filter((p) => {
        const haystack = normalizeArabic(`${p.name} ${p.description} ${p.code}`);
        return haystack.includes(normalizedQuery);
      });
    }

    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return sorted;
  }, [products, activeCategory, query, sort]);

  const categoryName = CATEGORIES.find((c) => c.slug === activeCategory)?.name;

  return (
    <main className="container-page py-8">
      <nav aria-label="مسار التصفح" className="mb-4 text-xs text-navy-300">
        <Link href="/" className="hover:text-gold">
          الرئيسية
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-navy">{categoryName ?? 'المعرض'}</span>
      </nav>

      <div className="mb-6">
        <h1 className="heading-underline text-2xl font-extrabold text-navy">
          {categoryName ?? 'كل المنتجات'}
        </h1>
        {query && (
          <p className="mt-3 text-sm text-navy-300">
            نتائج البحث عن: <span className="font-bold text-navy">{query}</span>
          </p>
        )}
      </div>

      {/* فلترة الأقسام */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link
          href="/products"
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors sm:text-sm',
            !activeCategory
              ? 'border-gold bg-gold text-navy'
              : 'border-softgray bg-white text-navy hover:border-gold',
          )}
        >
          الكل
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors sm:text-sm',
              activeCategory === cat.slug
                ? 'border-gold bg-gold text-navy'
                : 'border-softgray bg-white text-navy hover:border-gold',
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-300">
          <span className="font-bold text-navy">{visible.length}</span> قطعة
        </p>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="ترتيب النتائج"
          className="w-48"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <PageLoader label="جاري تحميل المنتجات..." />
      ) : error ? (
        <EmptyState title="تعذّر تحميل المنتجات" message={error} />
      ) : visible.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج"
          message={
            query || activeCategory
              ? 'جرّب تغيير كلمة البحث أو اختيار قسم آخر.'
              : 'لم تُضف أي منتجات بعد. أضِفها من لوحة تحكم المدير.'
          }
          action={
            <Link
              href="/products"
              className="rounded-lg border-2 border-gold px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold"
            >
              عرض كل المنتجات
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} settings={settings} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <ProductsBrowser />
      </Suspense>
      <Footer />
    </>
  );
}
