'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { createProduct, updateProduct } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import { generateProductCode } from '@/lib/format';
import type { CategorySlug, Product, ProductImage, ProductInput } from '@/lib/data/types';

interface ProductFormProps {
  /** المنتج عند التعديل، أو undefined عند الإضافة */
  product?: Product;
  existingCodes?: string[];
}

export function ProductForm({ product, existingCodes = [] }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState(product?.name ?? '');
  const [code, setCode] = useState(
    product?.code ?? generateProductCode('bedrooms', existingCodes),
  );
  const [category, setCategory] = useState<CategorySlug>(product?.category ?? 'bedrooms');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [oldPrice, setOldPrice] = useState(product?.oldPrice ? String(product.oldPrice) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [rating, setRating] = useState(String(product?.rating ?? 5));
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'اسم القطعة مطلوب.';
    if (!code.trim()) next.code = 'كود القطعة مطلوب.';
    const priceValue = Number(price);
    if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      next.price = 'أدخل سعراً صحيحاً أكبر من صفر.';
    }
    if (oldPrice.trim()) {
      const oldValue = Number(oldPrice);
      if (Number.isNaN(oldValue) || oldValue <= priceValue) {
        next.oldPrice = 'السعر قبل الخصم يجب أن يكون أكبر من السعر الحالي.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast('راجع الحقول المطلوبة.', 'error');
      return;
    }

    setBusy(true);
    const payload: ProductInput = {
      name: name.trim(),
      code: code.trim(),
      category,
      price: Number(price),
      oldPrice: oldPrice.trim() ? Number(oldPrice) : null,
      description: description.trim(),
      rating: Number(rating),
      images,
      featured,
      published,
      inStock,
      isDemo: false,
    };

    try {
      if (product) {
        await updateProduct(product.id, payload);
        toast('تم حفظ تعديلات القطعة.');
      } else {
        await createProduct(payload);
        toast('تمت إضافة القطعة بنجاح.');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'تعذّر حفظ القطعة.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-2xl border border-softgray bg-white p-5">
        <h2 className="mb-4 text-base font-bold text-navy">بيانات القطعة</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم القطعة" required error={errors.name} className="sm:col-span-2">
            {(id) => (
              <Input
                id={id}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سرير ملكي فاخر مبطّن"
              />
            )}
          </Field>

          <Field label="القسم" required>
            {(id) => (
              <Select
                id={id}
                value={category}
                onChange={(e) => {
                  const next = e.target.value as CategorySlug;
                  setCategory(next);
                  if (!product) setCode(generateProductCode(next, existingCodes));
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            label="كود القطعة"
            required
            error={errors.code}
            hint="يظهر للعميل ويُرسل ضمن رسالة الواتساب"
          >
            {(id) => (
              <div className="flex gap-2">
                <Input
                  id={id}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="ltr-nums"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCode(generateProductCode(category, existingCodes))}
                  title="توليد كود جديد"
                >
                  ⟳
                </Button>
              </div>
            )}
          </Field>

          <Field label="السعر (بالجنيه السوداني)" required error={errors.price}>
            {(id) => (
              <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450000"
                className="ltr-nums"
              />
            )}
          </Field>

          <Field
            label="السعر قبل الخصم (اختياري)"
            error={errors.oldPrice}
            hint="اتركه فارغاً إن لم يكن هناك خصم"
          >
            {(id) => (
              <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={0}
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="520000"
                className="ltr-nums"
              />
            )}
          </Field>

          <Field label="التقييم">
            {(id) => (
              <Select id={id} value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {'★'.repeat(value)} ({value})
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="الوصف" className="sm:col-span-2">
            {(id) => (
              <Textarea
                id={id}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="الخامات، المقاسات، الألوان المتاحة..."
              />
            )}
          </Field>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          <Checkbox
            label="منشور للعملاء"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <Checkbox
            label="متوفر في المخزن"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <Checkbox
            label="قطعة مميزة (تظهر بالرئيسية)"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-softgray bg-white p-5">
        <h2 className="mb-1 text-base font-bold text-navy">صور القطعة</h2>
        <p className="mb-4 text-xs text-navy-300">
          الصورة الأولى هي الرئيسية التي تظهر في المعرض.
        </p>
        <ImagePicker value={images} onChange={setImages} />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" loading={busy} className="sm:w-64">
          {product ? 'حفظ التعديلات' : 'إضافة القطعة'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push('/admin/products')}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
