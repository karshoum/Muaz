import {
  getSupabase,
  SETTINGS_ROW_ID,
  SUPABASE_IMAGE_BUCKET,
  SUPABASE_PRODUCTS_TABLE,
  SUPABASE_SETTINGS_TABLE,
} from '@/lib/supabase/client';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { buildImageFileName } from '@/lib/image';
import { buildSeedProducts } from '@/lib/data/seed';
import type {
  DataAdapter,
  Product,
  ProductImage,
  ProductInput,
  SiteSettings,
} from '@/lib/data/types';

interface ProductRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: Product['category'];
  images: ProductImage[] | null;
  rating: number | null;
  featured: boolean;
  published: boolean;
  in_stock: boolean;
  is_demo: boolean | null;
  created_at: string;
  updated_at: string;
}

function client() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('لم تُضبط مفاتيح Supabase. راجع docs/SETUP-AR.md');
  }
  return supabase;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price) || 0,
    oldPrice: row.old_price === null ? null : Number(row.old_price),
    category: row.category,
    images: Array.isArray(row.images) ? row.images : [],
    rating: Number(row.rating ?? 5),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    inStock: Boolean(row.in_stock),
    isDemo: Boolean(row.is_demo),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(input: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.code !== undefined) row.code = input.code;
  if (input.name !== undefined) row.name = input.name;
  if (input.description !== undefined) row.description = input.description;
  if (input.price !== undefined) row.price = input.price;
  if (input.oldPrice !== undefined) row.old_price = input.oldPrice;
  if (input.category !== undefined) row.category = input.category;
  if (input.images !== undefined) row.images = input.images;
  if (input.rating !== undefined) row.rating = input.rating;
  if (input.featured !== undefined) row.featured = input.featured;
  if (input.published !== undefined) row.published = input.published;
  if (input.inStock !== undefined) row.in_stock = input.inStock;
  if (input.isDemo !== undefined) row.is_demo = input.isDemo;
  return row;
}

/** رسالة خطأ عربية مفهومة بدل رسائل Supabase الإنجليزية */
function friendlyError(error: { message: string; code?: string }): Error {
  if (error.code === '23505') {
    return new Error('كود القطعة مستخدم بالفعل. اختر كوداً آخر.');
  }
  if (error.code === '42501' || /row-level security/i.test(error.message)) {
    return new Error('ليست لديك صلاحية لهذه العملية. سجّل الدخول كمدير أولاً.');
  }
  // PostgREST يصوغ الرسالة بأكثر من شكل حسب الإصدار
  if (
    error.code === 'PGRST205' ||
    /relation .* does not exist/i.test(error.message) ||
    /could not find the table/i.test(error.message) ||
    /schema cache/i.test(error.message)
  ) {
    return new Error(
      'جداول قاعدة البيانات غير موجودة بعد. افتح لوحة Supabase ← SQL Editor، والصق محتوى ملف supabase/schema.sql ثم اضغط Run.',
    );
  }
  return new Error(error.message);
}

export const supabaseAdapter: DataAdapter = {
  name: 'supabase',

  async listProducts(options = {}) {
    const query = client()
      .from(SUPABASE_PRODUCTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (!options.includeUnpublished) query.eq('published', true);

    const { data, error } = await query;
    if (error) throw friendlyError(error);
    return (data as ProductRow[]).map(rowToProduct);
  },

  async getProduct(id) {
    const { data, error } = await client()
      .from(SUPABASE_PRODUCTS_TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw friendlyError(error);
    return data ? rowToProduct(data as ProductRow) : null;
  },

  async createProduct(input) {
    const { data, error } = await client()
      .from(SUPABASE_PRODUCTS_TABLE)
      .insert(inputToRow(input))
      .select()
      .single();
    if (error) throw friendlyError(error);
    return rowToProduct(data as ProductRow);
  },

  async updateProduct(id, patch) {
    const { data, error } = await client()
      .from(SUPABASE_PRODUCTS_TABLE)
      .update({ ...inputToRow(patch), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw friendlyError(error);
    return rowToProduct(data as ProductRow);
  },

  async deleteProduct(id) {
    const { error } = await client().from(SUPABASE_PRODUCTS_TABLE).delete().eq('id', id);
    if (error) throw friendlyError(error);
  },

  async deleteDemoProducts() {
    const { data, error } = await client()
      .from(SUPABASE_PRODUCTS_TABLE)
      .delete()
      .eq('is_demo', true)
      .select('id');
    if (error) throw friendlyError(error);
    return (data ?? []).length;
  },

  async uploadImage(blob, fileName) {
    const supabase = client();
    const path = `${new Date().getFullYear()}/${buildImageFileName(fileName, blob.type)}`;
    const { error } = await supabase.storage
      .from(SUPABASE_IMAGE_BUCKET)
      .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false });
    if (error) {
      if (/bucket not found/i.test(error.message)) {
        throw new Error(
          `مخزن الصور "${SUPABASE_IMAGE_BUCKET}" غير موجود. أنشئه من لوحة Supabase أو شغّل supabase/schema.sql`,
        );
      }
      throw friendlyError(error);
    }
    const { data } = supabase.storage.from(SUPABASE_IMAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },

  async getSettings() {
    const { data, error } = await client()
      .from(SUPABASE_SETTINGS_TABLE)
      .select('data')
      .eq('id', SETTINGS_ROW_ID)
      .maybeSingle();
    if (error) throw friendlyError(error);
    const stored = (data?.data ?? {}) as Partial<SiteSettings>;
    return { ...DEFAULT_SETTINGS, ...stored };
  },

  async updateSettings(patch) {
    const current = await this.getSettings();
    const next: SiteSettings = { ...current, ...patch };
    const { error } = await client()
      .from(SUPABASE_SETTINGS_TABLE)
      .upsert({ id: SETTINGS_ROW_ID, data: next, updated_at: new Date().toISOString() });
    if (error) throw friendlyError(error);
    return next;
  },

  /**
   * الزرع في السحابة يتطلب صلاحية كتابة (مدير مسجّل الدخول).
   * لذلك يُنفَّذ بصمت ويُتجاهل خطأ الصلاحية لزوار الموقع.
   */
  async seedIfEmpty() {
    const supabase = client();
    const { count, error } = await supabase
      .from(SUPABASE_PRODUCTS_TABLE)
      .select('id', { count: 'exact', head: true });
    if (error || (count ?? 0) > 0) return;

    const rows = buildSeedProducts().map(({ id, createdAt, updatedAt, ...rest }) =>
      inputToRow(rest),
    );
    await supabase.from(SUPABASE_PRODUCTS_TABLE).insert(rows);
  },
};
