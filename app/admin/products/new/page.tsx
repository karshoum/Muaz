'use client';

import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { PageLoader } from '@/components/ui/Spinner';
import { useProducts } from '@/lib/hooks/useProducts';

export default function NewProductPage() {
  const { products, loading } = useProducts({ includeUnpublished: true });

  return (
    <div className="space-y-5">
      <nav className="text-xs text-navy-300">
        <Link href="/admin/products" className="hover:text-gold">
          المنتجات
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-navy">إضافة قطعة</span>
      </nav>

      <h1 className="heading-underline text-xl font-extrabold text-navy">إضافة قطعة جديدة</h1>

      {loading ? (
        <PageLoader />
      ) : (
        <ProductForm existingCodes={products.map((p) => p.code)} />
      )}
    </div>
  );
}
