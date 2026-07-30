import { formatPrice } from '@/lib/format';
import { SITE_FULL_NAME } from '@/lib/constants';
import type { Product, SiteSettings } from '@/lib/data/types';

const SUDAN_COUNTRY_CODE = '249';

/**
 * تطبيع رقم الهاتف إلى الصيغة الدولية المطلوبة لروابط wa.me (أرقام فقط بلا +).
 *
 * يعالج الصيغ الشائعة في السودان:
 *   0912345678      ← رقم محلي يبدأ بصفر
 *   912345678       ← رقم بلا صفر ولا مفتاح دولة
 *   +249 91 234 5678 / 00249912345678 / 249912345678
 *
 * يُرجع سلسلة فارغة إذا كان الرقم غير صالح.
 */
export function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return '';

  // تحويل الأرقام العربية الهندية إلى لاتينية قبل أي معالجة
  const latin = String(raw).replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });

  const hasPlus = latin.trim().startsWith('+');
  let digits = latin.replace(/\D/g, '');
  if (!digits) return '';

  // 00 بادئة دولية
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith(SUDAN_COUNTRY_CODE)) {
    // رقم سوداني كامل بالفعل
    return digits;
  }

  // رقم دولي صريح لدولة أخرى (كُتب بعلامة +) يُترك كما هو
  if (hasPlus) return digits;

  if (digits.startsWith('0')) {
    // رقم محلي سوداني: 09xxxxxxxx ← 2499xxxxxxxx
    return SUDAN_COUNTRY_CODE + digits.replace(/^0+/, '');
  }

  // تسعة أرقام تبدأ بـ 9 = رقم سوداني بلا مفتاح
  if (digits.length === 9 && digits.startsWith('9')) {
    return SUDAN_COUNTRY_CODE + digits;
  }

  return digits;
}

/** هل الرقم صالح للاستخدام في رابط واتساب؟ */
export function isValidWhatsAppNumber(raw: string | null | undefined): boolean {
  const digits = normalizePhone(raw);
  return digits.length >= 10 && digits.length <= 15;
}

/** الرقم بصيغة عرض مقروءة: ‎+249 91 234 5678 */
export function formatPhoneForDisplay(raw: string | null | undefined): string {
  const digits = normalizePhone(raw);
  if (!digits) return '';
  if (digits.startsWith(SUDAN_COUNTRY_CODE)) {
    const rest = digits.slice(SUDAN_COUNTRY_CODE.length);
    const groups = rest.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
    return `+${SUDAN_COUNTRY_CODE} ${groups}`.trim();
  }
  return `+${digits}`;
}

export interface OrderMessageOptions {
  /** رابط صفحة المنتج الكامل — يُضاف للرسالة إن توفر */
  productUrl?: string;
  currency?: string;
}

/**
 * بناء نص رسالة الطلب المنسّقة التي تصل التاجر عبر واتساب.
 * تتضمن: اسم القطعة، الكود، والسعر — كما هو مطلوب.
 */
export function buildOrderMessage(product: Product, options: OrderMessageOptions = {}): string {
  const currency = options.currency ?? 'ج.س';
  const lines = [
    'السلام عليكم ورحمة الله 👋',
    `أرغب في طلب هذه القطعة من ${SITE_FULL_NAME}:`,
    '',
    `🛋️ القطعة: ${product.name}`,
    `🔖 الكود: ${product.code}`,
    `💰 السعر: ${formatPrice(product.price, currency)}`,
  ];

  if (options.productUrl) {
    lines.push(`🔗 الرابط: ${options.productUrl}`);
  }

  lines.push('', 'برجاء إفادتي بالتوفر وطريقة التوصيل. شكراً لكم.');
  return lines.join('\n');
}

/** نص مختصر يُنسخ إلى حافظة العميل عند الطلب */
export function buildCopyText(product: Product, currency = 'ج.س'): string {
  return [
    product.name,
    `الكود: ${product.code}`,
    `السعر: ${formatPrice(product.price, currency)}`,
  ].join(' | ');
}

/**
 * بناء رابط واتساب الجاهز للفتح.
 * يُرجع سلسلة فارغة إذا كان الرقم غير صالح حتى لا نفتح رابطاً معطوباً.
 */
export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string {
  const digits = normalizePhone(phone);
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** الرابط الكامل لطلب منتج بعينه، انطلاقاً من إعدادات الموقع */
export function buildProductOrderUrl(
  product: Product,
  settings: Pick<SiteSettings, 'whatsappNumber' | 'currency'>,
  productUrl?: string,
): string {
  const message = buildOrderMessage(product, {
    productUrl,
    currency: settings.currency,
  });
  return buildWhatsAppUrl(settings.whatsappNumber, message);
}

/** رابط واتساب عام للاستفسار (بدون منتج محدد) */
export function buildGeneralWhatsAppUrl(phone: string, customMessage?: string): string {
  const message =
    customMessage ?? `السلام عليكم، أرغب في الاستفسار عن منتجات ${SITE_FULL_NAME}.`;
  return buildWhatsAppUrl(phone, message);
}

/**
 * نسخ نص إلى الحافظة مع بديل للمتصفحات القديمة أو السياقات غير الآمنة.
 * لا يرمي استثناءً أبداً — يُرجع نجاح العملية فقط، حتى لا يمنع فشلُ
 * النسخِ فتحَ واتساب.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // نتابع إلى الطريقة البديلة
  }

  try {
    if (typeof document === 'undefined') return false;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
