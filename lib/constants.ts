import type { Category, SiteSettings } from '@/lib/data/types';

export const SITE_NAME = 'معرض الراقي الهندسي';
export const SITE_TAGLINE = 'للأثاث والديكور';
export const SITE_FULL_NAME = `${SITE_NAME} ${SITE_TAGLINE}`;
export const SITE_DESCRIPTION =
  'معرض الراقي الهندسي للأثاث والديكور في السودان — غرف نوم، غرف أطفال، دواليب، أثاث غرف المعيشة، طاولات طعام، وديكور ومستلزمات المنزل. اطلب مباشرة عبر واتساب.';

/**
 * أقسام المعرض كما تظهر في شبكة الأقسام بالصفحة الرئيسية.
 *
 * حقل `image` هو صورة احتياطية فقط: شبكة الأقسام تعرض صورة حقيقية من
 * أول قطعة في القسم متى وُجدت، فتتحدّث الواجهة تلقائياً كلما أضاف المدير
 * قطعة جديدة. الرسم التوضيحي لا يظهر إلا في قسم لا يحوي أي قطعة بعد.
 */
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
    image: '/images/products/sectional-cream.jpg',
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
    image: '/images/products/cabinet-white-gold.jpg',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<Category['slug'], Category>;

export function categoryName(slug: string): string {
  return CATEGORY_MAP[slug as Category['slug']]?.name ?? 'غير مصنّف';
}

/**
 * شرائح البانر الرئيسي — صور حقيقية من قطع المعرض.
 * الرسوم التوضيحية القديمة في /images/hero محفوظة كاحتياطي فقط.
 */
export const HERO_SLIDES = [
  {
    title: 'فخامة الأثاث العصري لمنزلك',
    subtitle: 'تشكيلة مختارة بعناية من أرقى قطع الأثاث والديكور',
    image: '/images/products/sofa-royal-green.jpg',
    cta: 'تسوق الآن',
    href: '/products',
  },
  {
    title: 'أطقم مجالس بتصاميم هندسية مميزة',
    subtitle: 'راحة تدوم وأناقة لا تُنسى',
    image: '/images/products/sectional-cream.jpg',
    cta: 'تصفح غرف المعيشة',
    href: '/products?category=living',
  },
  {
    title: 'ديكور يليق بذوقك الرفيع',
    subtitle: 'لمسات أخيرة تصنع الفرق في منزلك',
    image: '/images/products/cabinet-white-gold.jpg',
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
  whatsappNumber: '+249129946237',
  whatsappNumberAlt: '',
  phone: '+249129946237',
  email: 'info@alraqi-furniture.com',
  address: 'الخرطوم — السودان',
  announcement: 'توصيل داخل الخرطوم • اطلب الآن مباشرة عبر واتساب',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  tiktok: '',
  twitter: '',
  currency: 'ج.س',
  // الأسعار مخفية افتراضياً — العميل يسأل عن السعر عبر واتساب
  showPrices: false,
  workingHours: 'السبت - الخميس: 9 صباحاً - 9 مساءً',
  mapUrl: '',
};

/** الحد الأقصى لعرض/ارتفاع الصورة المحفوظة (بكسل) لتقليل الحجم */
export const IMAGE_MAX_DIMENSION = 1400;
/** الحد الأقصى لحجم الملف المرفوع قبل الضغط */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
