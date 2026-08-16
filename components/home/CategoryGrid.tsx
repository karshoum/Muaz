'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CATEGORIES } from '@/lib/constants';
import { useProducts } from '@/lib/hooks/useProducts';

/**
 * شبكة الأقسام بنفس مظهر التصميم: صورة القسم مع شريط ذهبي سفلي
 * يحمل اسم القسم ووصفاً قصيراً.
 *
 * الصورة تُؤخذ من أول قطعة حقيقية في القسم، فلا يرى العميل رسماً
 * توضيحياً لقسم فيه بضاعة فعلية، وتتحدّث الواجهة وحدها كلما أضاف
 * المدير قطعة جديدة. القسم الفارغ وحده يبقى على الرسم الاحتياطي.
 */
export function CategoryGrid() {
  const { products } = useProducts();

  const coverByCategory = useMemo(() => {
    const covers: Record<string, string> = {};
    // المنتجات مرتّبة من الأحدث، فنمرّ عكسياً ليفوز الأحدث بصورة القسم
    for (let i = products.length - 1; i >= 0; i -= 1) {
      const url = products[i].images[0]?.url;
      if (url) covers[products[i].category] = url;
    }
    return covers;
  }, [products]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="category-grid">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group overflow-hidden rounded-xl border border-softgray bg-white shadow-card transition-shadow hover:shadow-card-hover"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-softgray">
            <img
              src={coverByCategory[category.slug] ?? category.image}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="bg-gold px-4 py-3 text-navy">
            <h3 className="text-base font-extrabold">{category.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-navy/80">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
