import { describe, expect, it } from 'vitest';
import {
  categoryLabel,
  formatCount,
  formatPrice,
  generateProductCode,
  normalizeArabic,
} from '@/lib/format';

describe('formatPrice — تنسيق السعر بالجنيه السوداني', () => {
  it('يضيف فواصل الآلاف ورمز العملة', () => {
    expect(formatPrice(450000, 'ج.س')).toBe('450,000 ج.س');
  });

  it('يستخدم الجنيه السوداني كعملة افتراضية', () => {
    expect(formatPrice(1500)).toBe('1,500 ج.س');
  });

  it('يعرض الكسور عند وجودها فقط', () => {
    expect(formatPrice(1500.5)).toBe('1,500.5 ج.س');
    // بلا كسور: الرقم نفسه لا يحمل فاصلة عشرية (رمز العملة ج.س يحوي نقطة أصلاً)
    expect(formatPrice(1500, 'SDG')).toBe('1,500 SDG');
  });

  it('يتعامل مع القيم غير الصالحة بأمان', () => {
    expect(formatPrice(Number.NaN)).toBe('0 ج.س');
  });

  it('يحترم عملة مخصصة', () => {
    expect(formatPrice(200, 'ر.س')).toBe('200 ر.س');
  });
});

describe('generateProductCode — توليد كود القطعة', () => {
  it('يبدأ ببادئة المعرض ورمز القسم', () => {
    expect(generateProductCode('bedrooms')).toMatch(/^ALR-BR-\d{4}$/);
    expect(generateProductCode('kids')).toMatch(/^ALR-KD-\d{4}$/);
    expect(generateProductCode('decor')).toMatch(/^ALR-DC-\d{4}$/);
  });

  it('لا يكرّر كوداً مستخدماً من قبل', () => {
    const existing = Array.from({ length: 30 }, (_, i) =>
      `ALR-WD-${String(1000 + i)}`,
    );
    const code = generateProductCode('wardrobes', existing);
    expect(existing).not.toContain(code);
  });

  it('ينتج أكواداً مختلفة عند الاستدعاء المتكرر', () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateProductCode('living')));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe('normalizeArabic — تطبيع نص البحث', () => {
  it('يوحّد أشكال الألف', () => {
    expect(normalizeArabic('أثاث')).toBe(normalizeArabic('اثاث'));
  });

  it('يوحّد الياء والألف المقصورة', () => {
    expect(normalizeArabic('كرسى')).toBe(normalizeArabic('كرسي'));
  });

  it('يوحّد التاء المربوطة والهاء', () => {
    expect(normalizeArabic('طاولة')).toBe(normalizeArabic('طاوله'));
  });

  it('يزيل التشكيل والمسافات الزائدة', () => {
    expect(normalizeArabic('  سَرِير   ملكي ')).toBe('سرير ملكي');
  });
});

describe('categoryLabel', () => {
  it('يُرجع الاسم العربي للقسم', () => {
    expect(categoryLabel('bedrooms')).toBe('غرف نوم');
    expect(categoryLabel('dining')).toBe('طاولات طعام');
  });

  it('يُرجع قيمة افتراضية للأقسام غير المعروفة', () => {
    expect(categoryLabel('unknown')).toBe('غير مصنّف');
  });
});

describe('formatCount', () => {
  it('يعرض الأرقام الصغيرة كما هي', () => {
    expect(formatCount(999)).toBe('999');
  });

  it('يختصر الآلاف', () => {
    expect(formatCount(1500)).toBe('1.5 ألف');
    expect(formatCount(2000)).toBe('2 ألف');
  });
});
