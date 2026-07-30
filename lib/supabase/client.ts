import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

/**
 * هل ضُبطت مفاتيح Supabase؟
 * إن لم تُضبط، يعمل التطبيق كاملاً على التخزين المحلي (IndexedDB)
 * دون أي خطأ — راجع docs/SETUP-AR.md لتفعيل السحابة.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey && url.startsWith('http'));
}

let cached: SupabaseClient | null = null;

/** عميل Supabase — يُرجع null إذا لم تُضبط المفاتيح */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return cached;
}

export const SUPABASE_PRODUCTS_TABLE = 'products';
export const SUPABASE_SETTINGS_TABLE = 'settings';
export const SUPABASE_IMAGE_BUCKET = 'product-images';
/** الإعدادات محفوظة في صف واحد ثابت المعرّف */
export const SETTINGS_ROW_ID = 1;
