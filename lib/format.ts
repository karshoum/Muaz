import { CATEGORIES } from '@/lib/constants';
import type { CategorySlug } from '@/lib/data/types';

/**
 * تنسيق السعر بالجنيه السوداني.
 * نستخدم فواصل الآلاف اللاتينية لسهولة القراءة، مع رمز العملة بالعربية.
 */
export function formatPrice(value: number, currency = 'ج.س'): string {
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: safe % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(safe);
  return `${formatted} ${currency}`;
}

/** أرقام مختصرة للوحة التحكم: 1500 ← 1.5 ألف */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace(/\.0$/, '')} ألف`;
}

const CATEGORY_CODE: Record<CategorySlug, string> = {
  bedrooms: 'BR',
  kids: 'KD',
  wardrobes: 'WD',
  living: 'LV',
  dining: 'DN',
  decor: 'DC',
};

/**
 * توليد كود قطعة فريد بصيغة: ALR-BR-4821
 * ALR = الراقي، ثم رمز القسم، ثم أربعة أرقام.
 */
export function generateProductCode(category: CategorySlug, existingCodes: string[] = []): string {
  const prefix = `ALR-${CATEGORY_CODE[category] ?? 'GN'}`;
  const taken = new Set(existingCodes);
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const suffix = String(Math.floor(1000 + Math.random() * 9000));
    const code = `${prefix}-${suffix}`;
    if (!taken.has(code)) return code;
  }
  return `${prefix}-${Date.now().toString().slice(-5)}`;
}

/** تاريخ عربي مختصر للوحة التحكم */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** تطبيع نص البحث العربي: توحيد الألف والياء والتاء المربوطة وإزالة التشكيل */
export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ْٰ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? 'غير مصنّف';
}
