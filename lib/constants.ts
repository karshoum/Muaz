import type { Category, SiteSettings } from '@/lib/data/types';

export const SITE_NAME = 'معرض الراقي الهندسي';
export const SITE_TAGLINE = 'للأثاث والديكور';
export const SITE_FULL_NAME = `${SITE_NAME} ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  'معرض الراقي الهندسي للأثاث والديكور في السودان — غرف نوم، غرف أطفال، دواليب، أثاث غرف المعيشة، طاولات طعام، وديكور ومستلزمات المنزل. اطلب مباشرة عبر واتساب.';

/** أقسام المعرض كما تظهر في شبكة الأقسام بالصفحة الرئيسية */
export const CATEGORIES: Category[] = [
  {
    slug: 'bedrooms',
    name: 'غرف نوم',
    description: 'تصفح أحدث موديلات غرف النوم',
    image: '/images/categories/bedrooms.svg',
  },
  {
    slug: 'kids',
    name: 'غرف أطفال',
    description: 'أثاث أطفال عصري وآمن',
    image: '/images/categories/kids.svg',
  },
  {
    slug: 'wardrobes',
    name: 'دواليب',
    description: 'دواليب بتصاميم هندسية مميزة',
    image: '/images/categories/wardrobes.svg',
  },
  {
    slug: 'living',
    name: 'أثاث غرف المعيشة',
    description: 'تصفح أحدث موديلات غرف المعيشة',
    image: '/images/categories/living.svg',
  },
  {
    slug: 'dining',
    name: 'طاولات طعام',
    description: 'تصفح أحدث موديلات غرف الطعام',
    image: '/images/categories/dining.svg',
  },
  {
    slug: 'decor',
    name: 'ديكور ومستلزمات المنزل',
    description: 'نصفح أحدث ديكورات ومستلزمات المنزل',
    image: '/images/categories/decor.svg',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<Category['slug'], Category>;

export function categoryName(slug: string): string {
  return CATEGORY_MAP[slug as Category['slug']]?.name ?? 'غير مصنّف';
}

/** شرائح البانر الرئيسي */
export const HERO_SLIDES = [
  {
    title: 'فخامة الأثاث العصري لمنزلك',
    subtitle: 'تشكيلة مختارة بعناية من أرقى قطع الأثاث والديكور',
    image: '/images/hero/hero-1.svg',
    cta: 'تسوق الآن',
    href: '/products',
  },
  {
    title: 'غرف نوم بتصاميم هندسية مميزة',
    subtitle: 'راحة تدوم وأناقة لا تُنسى',
    image: '/images/hero/hero-2.svg',
    cta: 'تصفح غرف النوم',
    href: '/products?category=bedrooms',
  },
  {
    title: 'ديكور يليق بذوقك الرفيع',
    subtitle: 'لمسات أخيرة تصنع الفرق في منزلك',
    image: '/images/hero/hero-3.svg',
    cta: 'اكتشف الديكورات',
    href: '/products?category=decor',
  },
];

export const MAIN_NAV = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
  { label: 'الأقسام', href: '/products' },
  { label: 'الخدمات', href: '/services' },
  { label: 'المعرض', href: '/products' },
  { label: 'تواصل معنا', href: '/contact' },
];

/**
 * القيم المبدئية لبيانات التواصل.
 * جميعها قابلة للتعديل من: لوحة التحكم ← الإعدادات، دون لمس الكود.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: '+249912345678',
  whatsappNumberAlt: '',
  phone: '+249912345678',
  email: 'info@alraqi-furniture.com',
  address: 'الخرطوم — السودان',
  announcement: 'توصيل داخل الخرطوم • اطلب الآن مباشرة عبر واتساب',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  tiktok: '',
  twitter: '',
  currency: 'ج.س',
  workingHours: 'السبت - الخميس: 9 صباحاً - 9 مساءً',
  mapUrl: '',
};

/** الحد الأقصى لعرض/ارتفاع الصورة المحفوظة (بكسل) لتقليل الحجم */
export const IMAGE_MAX_DIMENSION = 1400;
/** الحد الأقصى لحجم الملف المرفوع قبل الضغط */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
