import { describe, expect, it, vi } from 'vitest';
import {
  buildCopyText,
  buildOrderMessage,
  buildProductOrderUrl,
  buildWhatsAppUrl,
  copyToClipboard,
  formatPhoneForDisplay,
  isValidWhatsAppNumber,
  normalizePhone,
} from '@/lib/whatsapp';
import type { Product } from '@/lib/data/types';

const product: Product = {
  id: 'p-1',
  code: 'ALR-BR-1042',
  name: 'سرير ملكي فاخر مبطّن',
  description: 'سرير مزدوج بتصميم ملكي عصري',
  price: 450000,
  oldPrice: 520000,
  category: 'bedrooms',
  images: [],
  rating: 5,
  featured: true,
  published: true,
  inStock: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('normalizePhone — تطبيع أرقام السودان', () => {
  it('يحوّل الرقم المحلي الذي يبدأ بصفر إلى الصيغة الدولية', () => {
    expect(normalizePhone('0912345678')).toBe('249912345678');
  });

  it('يقبل الرقم المكتوب بمفتاح الدولة وعلامة +', () => {
    expect(normalizePhone('+249 91 234 5678')).toBe('249912345678');
  });

  it('يقبل البادئة الدولية 00', () => {
    expect(normalizePhone('00249912345678')).toBe('249912345678');
  });

  it('يضيف مفتاح السودان للرقم المكوّن من تسع خانات', () => {
    expect(normalizePhone('912345678')).toBe('249912345678');
  });

  it('يتعامل مع الأرقام العربية الهندية', () => {
    expect(normalizePhone('٠٩١٢٣٤٥٦٧٨')).toBe('249912345678');
  });

  it('يترك الأرقام الدولية لدول أخرى كما هي', () => {
    expect(normalizePhone('+201001234567')).toBe('201001234567');
  });

  it('يُرجع نصاً فارغاً للمدخلات الفارغة أو غير الصالحة', () => {
    expect(normalizePhone('')).toBe('');
    expect(normalizePhone(null)).toBe('');
    expect(normalizePhone(undefined)).toBe('');
    expect(normalizePhone('غير رقم')).toBe('');
  });
});

describe('isValidWhatsAppNumber', () => {
  it('يقبل رقماً سودانياً صحيحاً', () => {
    expect(isValidWhatsAppNumber('0912345678')).toBe(true);
    expect(isValidWhatsAppNumber('+249912345678')).toBe(true);
  });

  it('يرفض الأرقام القصيرة أو الفارغة', () => {
    expect(isValidWhatsAppNumber('12345')).toBe(false);
    expect(isValidWhatsAppNumber('')).toBe(false);
  });
});

describe('formatPhoneForDisplay', () => {
  it('يعرض الرقم السوداني مجزّأً وسهل القراءة', () => {
    expect(formatPhoneForDisplay('0912345678')).toBe('+249 91 234 5678');
  });
});

describe('buildOrderMessage — رسالة الطلب', () => {
  const message = buildOrderMessage(product, {
    productUrl: 'https://example.com/products/p-1',
    currency: 'ج.س',
  });

  it('يتضمن اسم القطعة', () => {
    expect(message).toContain('سرير ملكي فاخر مبطّن');
  });

  it('يتضمن كود القطعة', () => {
    expect(message).toContain('ALR-BR-1042');
  });

  it('يتضمن السعر بالجنيه السوداني', () => {
    expect(message).toContain('450,000 ج.س');
  });

  it('يتضمن رابط المنتج عند توفره', () => {
    expect(message).toContain('https://example.com/products/p-1');
  });

  it('يعمل بدون رابط منتج', () => {
    const withoutUrl = buildOrderMessage(product);
    expect(withoutUrl).toContain('ALR-BR-1042');
    expect(withoutUrl).not.toContain('🔗');
  });
});

describe('buildCopyText — النص المنسوخ للحافظة', () => {
  it('يجمع الاسم والكود والسعر', () => {
    const text = buildCopyText(product, 'ج.س');
    expect(text).toContain('سرير ملكي فاخر مبطّن');
    expect(text).toContain('ALR-BR-1042');
    expect(text).toContain('450,000 ج.س');
  });
});

describe('buildWhatsAppUrl — تشكيل الرابط', () => {
  it('يبني رابط wa.me بالرقم المطبَّع والرسالة المرمّزة', () => {
    const url = buildWhatsAppUrl('0912345678', 'مرحباً بك');
    expect(url.startsWith('https://wa.me/249912345678?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('مرحباً بك'));
  });

  it('يرمّز الأسطر الجديدة والرموز بشكل صحيح', () => {
    const url = buildWhatsAppUrl('+249912345678', 'سطر\nسطر ثانٍ & رمز');
    expect(url).toContain('%0A');
    expect(url).toContain('%26');
    expect(url).not.toContain('\n');
  });

  it('يُرجع نصاً فارغاً إذا كان الرقم غير صالح بدل رابط معطوب', () => {
    expect(buildWhatsAppUrl('', 'رسالة')).toBe('');
  });

  it('الرابط الناتج قابل للتحليل كعنوان صحيح', () => {
    const url = new URL(buildWhatsAppUrl('0912345678', 'اختبار'));
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe('/249912345678');
    expect(url.searchParams.get('text')).toBe('اختبار');
  });
});

describe('buildProductOrderUrl — الرابط الكامل لطلب منتج', () => {
  it('يجمع بيانات المنتج والإعدادات في رابط واحد', () => {
    const url = buildProductOrderUrl(
      product,
      { whatsappNumber: '0912345678', currency: 'ج.س' },
      'https://example.com/products/p-1',
    );
    const text = new URL(url).searchParams.get('text') ?? '';
    expect(url).toContain('wa.me/249912345678');
    expect(text).toContain('ALR-BR-1042');
    expect(text).toContain('450,000 ج.س');
  });
});

describe('copyToClipboard', () => {
  it('يستخدم واجهة الحافظة الحديثة عند توفرها', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await expect(copyToClipboard('نص')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('نص');
  });

  it('يعود للطريقة البديلة إذا فشلت الحافظة الحديثة', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.assign(document, { execCommand });

    await expect(copyToClipboard('نص')).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('لا يرمي استثناءً عند فشل كل الطرق', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    Object.assign(document, {
      execCommand: vi.fn().mockImplementation(() => {
        throw new Error('unsupported');
      }),
    });

    await expect(copyToClipboard('نص')).resolves.toBe(false);
  });
});
