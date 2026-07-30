'use client';

import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { EmptyState, PageLoader } from '@/components/ui/Spinner';
import { useProduct, useProducts } from '@/lib/hooks/useProducts';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { product, loading, error } = useProduct(params.id);
  const { products } = useProducts({ includeUnpublished: true });

  return (
    <div className="space-y-5">
      <nav className="text-xs text-navy-300">
        <Link href="/admin/products" className="hover:text-gold">
          المنتجات
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-navy">تعديل قطعة</span>
      </nav>

      <h1 className="heading-underline text-xl font-extrabold text-navy">تعديل القطعة</h1>

      {loading ? (
        <PageLoader />
      ) : !product ? (
        <EmptyState
          title="القطعة غير موجودة"
          message={error ?? 'ربما حُذفت هذه القطعة من قبل.'}
          action={
            <Link
              href="/admin/products"
              className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-navy"
            >
              العودة إلى المنتجات
            </Link>
          }
        />
      ) : (
        <ProductForm
          product={product}
          existingCodes={products.filter((p) => p.id !== product.id).map((p) => p.code)}
        />
      )}
    </div>
  );
}
