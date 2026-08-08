/**
 * الواجهة الموحّدة للبيانات.
 *
 * كل التطبيق يستورد من هنا فقط — لا يستورد أي مكوّن محوّلاً بعينه.
 * إن ضُبطت مفاتيح Supabase استُخدمت السحابة، وإلا عمل التطبيق
 * على التخزين المحلي (IndexedDB) دون أي تعديل في الكود.
 */
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { localAdapter } from '@/lib/data/local-adapter';
import { supabaseAdapter } from '@/lib/data/supabase-adapter';
import type { DataAdapter } from '@/lib/data/types';

export function getAdapter(): DataAdapter {
  return isSupabaseConfigured() ? supabaseAdapter : localAdapter;
}

/** هل نعمل حالياً على قاعدة بيانات سحابية؟ */
export function isCloudMode(): boolean {
  return isSupabaseConfigured();
}

export const listProducts: DataAdapter['listProducts'] = (options) =>
  getAdapter().listProducts(options);

export const getProduct: DataAdapter['getProduct'] = (id) => getAdapter().getProduct(id);

export const createProduct: DataAdapter['createProduct'] = (input) =>
  getAdapter().createProduct(input);

export const updateProduct: DataAdapter['updateProduct'] = (id, patch) =>
  getAdapter().updateProduct(id, patch);

export const deleteProduct: DataAdapter['deleteProduct'] = (id) =>
  getAdapter().deleteProduct(id);

export const deleteDemoProducts: DataAdapter['deleteDemoProducts'] = () =>
  getAdapter().deleteDemoProducts();

export const uploadImage: DataAdapter['uploadImage'] = (blob, fileName) =>
  getAdapter().uploadImage(blob, fileName);

export const getSettings: DataAdapter['getSettings'] = () => getAdapter().getSettings();

export const updateSettings: DataAdapter['updateSettings'] = (patch) =>
  getAdapter().updateSettings(patch);

export const seedIfEmpty: DataAdapter['seedIfEmpty'] = () => getAdapter().seedIfEmpty();

let seedPromise: Promise<void> | null = null;

/**
 * يضمن اكتمال زرع البيانات التجريبية **قبل** أي قراءة للمنتجات.
 *
 * بدون هذا الضمان يتسابق الزرع مع أول استعلام، فيرى الزائر الجديد
 * موقعاً فارغاً حتى يحدّث الصفحة. الوعد مخزّن مرة واحدة لكل جلسة
 * فلا يتكرر الزرع ولا ينتظر أحد أكثر من مرة.
 */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    // فشل الزرع (صلاحيات، متصفح بلا IndexedDB) لا يمنع عرض الموقع
    seedPromise = getAdapter()
      .seedIfEmpty()
      .catch(() => undefined);
  }
  return seedPromise;
}

/**
 * يُلغي حفظ نتيجة الزرع ليُعاد في المرة القادمة.
 *
 * ضروري بعد تسجيل دخول المدير: محاولة الزرع الأولى تجري والزائر مجهول،
 * فترفضها قواعد RLS بحق. بدون هذا الإلغاء تبقى النتيجة الفاشلة محفوظة
 * ولا يُزرع الكتالوج أبداً ما دامت الصفحة مفتوحة.
 */
export function resetSeedGate(): void {
  seedPromise = null;
}

export * from '@/lib/data/types';
