'use client';

import { useCallback, useEffect, useState } from 'react';
import { ensureSeeded, listProducts } from '@/lib/data';
import type { Product } from '@/lib/data/types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** تحميل المنتجات من طبقة البيانات (Supabase أو التخزين المحلي) */
export function useProducts(options: { includeUnpublished?: boolean } = {}): UseProductsResult {
  const includeUnpublished = options.includeUnpublished ?? false;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ننتظر اكتمال زرع البيانات التجريبية حتى لا يرى الزائر الجديد موقعاً فارغاً
      await ensureSeeded();
      setProducts(await listProducts({ includeUnpublished }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تحميل المنتجات.');
    } finally {
      setLoading(false);
    }
  }, [includeUnpublished]);

  useEffect(() => {
    void load();
  }, [load]);

  return { products, loading, error, reload: load };
}

/** تحميل منتج واحد بالمعرّف */
export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    ensureSeeded()
      .then(() => import('@/lib/data'))
      .then(({ getProduct }) => getProduct(id))
      .then((found) => {
        if (!active) return;
        setProduct(found);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'تعذّر تحميل المنتج.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { product, loading, error };
}
