import Link from 'next/link';
import { CATEGORIES } from '@/lib/constants';

/**
 * شبكة الأقسام بنفس مظهر التصميم: صورة القسم مع شريط ذهبي سفلي
 * يحمل اسم القسم ووصفاً قصيراً.
 */
export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="category-grid">
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group overflow-hidden rounded-xl border border-softgray bg-white shadow-card transition-shadow hover:shadow-card-hover"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={category.image}
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
