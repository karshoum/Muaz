import { beforeEach, describe, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { localAdapter, resetLocalAdapterForTests } from '@/lib/data/local-adapter';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import type { ProductInput } from '@/lib/data/types';

const sample: ProductInput = {
  code: 'ALR-LV-9001',
  name: 'كنبة اختبار',
  description: 'وصف تجريبي',
  price: 300000,
  oldPrice: null,
  category: 'living',
  images: [],
  rating: 4,
  featured: false,
  published: true,
  inStock: true,
  isDemo: false,
};

beforeEach(() => {
  // قاعدة بيانات نظيفة لكل اختبار
  globalThis.indexedDB = new IDBFactory();
  resetLocalAdapterForTests();
});

describe('localAdapter — عمليات المنتجات', () => {
  it('ينشئ منتجاً بمعرّف وتواريخ تلقائية', async () => {
    const created = await localAdapter.createProduct(sample);
    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();
    expect(created.name).toBe('كنبة اختبار');
  });

  it('يقرأ المنتج المُنشأ بالمعرّف', async () => {
    const created = await localAdapter.createProduct(sample);
    const found = await localAdapter.getProduct(created.id);
    expect(found?.code).toBe('ALR-LV-9001');
  });

  it('يُرجع null للمنتج غير الموجود', async () => {
    expect(await localAdapter.getProduct('لا-يوجد')).toBeNull();
  });

  it('يعدّل بيانات المنتج ويحدّث تاريخ التعديل', async () => {
    const created = await localAdapter.createProduct(sample);
    const updated = await localAdapter.updateProduct(created.id, { price: 350000 });
    expect(updated.price).toBe(350000);
    expect(updated.name).toBe('كنبة اختبار');
  });

  it('يرفض تعديل منتج غير موجود برسالة عربية', async () => {
    await expect(localAdapter.updateProduct('غير-موجود', { price: 1 })).rejects.toThrow(
      'المنتج غير موجود.',
    );
  });

  it('يحذف المنتج', async () => {
    const created = await localAdapter.createProduct(sample);
    await localAdapter.deleteProduct(created.id);
    expect(await localAdapter.getProduct(created.id)).toBeNull();
  });

  it('يُخفي المنتجات غير المنشورة عن العملاء', async () => {
    await localAdapter.createProduct({ ...sample, code: 'ALR-LV-9002', published: false });
    expect(await localAdapter.listProducts()).toHaveLength(0);
    expect(await localAdapter.listProducts({ includeUnpublished: true })).toHaveLength(1);
  });

  it('يرتّب المنتجات من الأحدث إلى الأقدم', async () => {
    await localAdapter.createProduct({ ...sample, code: 'A-1', name: 'الأولى' });
    // فاصل زمني حتى يختلف تاريخ الإنشاء بين القطعتين
    await new Promise((resolve) => setTimeout(resolve, 5));
    const second = await localAdapter.createProduct({ ...sample, code: 'A-2', name: 'الثانية' });

    const list = await localAdapter.listProducts();
    expect(list[0].id).toBe(second.id);
    expect(list[1].name).toBe('الأولى');
  });
});

describe('localAdapter — كتالوج المعرض المبدئي', () => {
  it('يزرع الكتالوج عند أول تشغيل فقط', async () => {
    await localAdapter.seedIfEmpty();
    const first = await localAdapter.listProducts({ includeUnpublished: true });
    expect(first.length).toBeGreaterThan(0);

    await localAdapter.seedIfEmpty();
    const second = await localAdapter.listProducts({ includeUnpublished: true });
    expect(second).toHaveLength(first.length);
  });

  it('قطع الكتالوج تبدأ غير منشورة فلا يرى العميل سعراً خاطئاً', async () => {
    await localAdapter.seedIfEmpty();

    const forCustomers = await localAdapter.listProducts();
    expect(forCustomers).toHaveLength(0);

    const forAdmin = await localAdapter.listProducts({ includeUnpublished: true });
    expect(forAdmin.length).toBeGreaterThan(0);
    expect(forAdmin.every((p) => p.price === 0)).toBe(true);
    expect(forAdmin.every((p) => p.images.length > 0)).toBe(true);
  });

  it('يحذف المنتجات الموسومة تجريبية فقط ويُبقي غيرها', async () => {
    await localAdapter.createProduct({ ...sample, code: 'DEMO-1', isDemo: true });
    await localAdapter.createProduct(sample);

    const removed = await localAdapter.deleteDemoProducts();
    expect(removed).toBe(1);

    const remaining = await localAdapter.listProducts({ includeUnpublished: true });
    expect(remaining).toHaveLength(1);
    expect(remaining[0].code).toBe('ALR-LV-9001');
  });
});

describe('localAdapter — الإعدادات', () => {
  it('يُرجع القيم المبدئية قبل أي تعديل', async () => {
    const settings = await localAdapter.getSettings();
    expect(settings.currency).toBe(DEFAULT_SETTINGS.currency);
  });

  it('يحفظ رقم الواتساب الجديد ويسترجعه', async () => {
    await localAdapter.updateSettings({ whatsappNumber: '0999888777' });
    const settings = await localAdapter.getSettings();
    expect(settings.whatsappNumber).toBe('0999888777');
    // بقية الحقول تبقى كما هي
    expect(settings.currency).toBe(DEFAULT_SETTINGS.currency);
  });
});

describe('localAdapter — رفع الصور', () => {
  it('يحفظ الصورة كـ data URL في الوضع المحلي', async () => {
    const blob = new Blob(['fake-image'], { type: 'image/png' });
    const url = await localAdapter.uploadImage(blob, 'test');
    expect(url.startsWith('data:image/png')).toBe(true);
  });
});
