/** أنواع البيانات المشتركة بين محوّل Supabase والمحوّل المحلي */

export type CategorySlug =
  | 'bedrooms'
  | 'kids'
  | 'wardrobes'
  | 'living'
  | 'dining'
  | 'decor';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

/** صورة منتج واحدة. نحتفظ دائماً بالأصل بجانب النسخة المفرّغة حتى يمكن التراجع. */
export interface ProductImage {
  id: string;
  /** الصورة المعروضة حالياً (الأصل أو المفرّغة حسب اختيار المدير) */
  url: string;
  /** الصورة الأصلية قبل تفريغ الخلفية — تُستخدم للتراجع */
  originalUrl?: string;
  /** هل الصورة المعروضة حالياً مفرّغة الخلفية؟ */
  backgroundRemoved: boolean;
}

export interface Product {
  id: string;
  /** كود القطعة الظاهر للعميل، مثل: ALR-BR-4821 */
  code: string;
  name: string;
  description: string;
  price: number;
  /** السعر قبل الخصم — اختياري */
  oldPrice?: number | null;
  category: CategorySlug;
  images: ProductImage[];
  rating: number;
  /** هل يظهر ضمن المنتجات المميزة في الصفحة الرئيسية؟ */
  featured: boolean;
  /** المنتجات غير المنشورة لا يراها العملاء */
  published: boolean;
  inStock: boolean;
  /** بيانات تجريبية قابلة للحذف الجماعي من لوحة التحكم */
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface SiteSettings {
  /** رقم واتساب استقبال الطلبات (بصيغة دولية) */
  whatsappNumber: string;
  /** رقم واتساب احتياطي — يظهر كخيار ثانٍ إن وُجد */
  whatsappNumberAlt: string;
  phone: string;
  email: string;
  address: string;
  /** نص شريط الإعلانات العلوي — اتركه فارغاً لإخفاء الشريط */
  announcement: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  /** رمز العملة الظاهر بجانب الأسعار */
  currency: string;
  /**
   * إظهار الأسعار في الموقع.
   * حين تكون false تختفي الأسعار من البطاقات وصفحات المنتجات ورسالة
   * الواتساب، ويُطلب السعر من المعرض مباشرة.
   */
  showPrices: boolean;
  workingHours: string;
  mapUrl: string;
}

/** الواجهة الموحّدة التي ينفّذها كل محوّل بيانات */
export interface DataAdapter {
  readonly name: 'supabase' | 'local';
  listProducts(options?: { includeUnpublished?: boolean }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: string, patch: Partial<ProductInput>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  deleteDemoProducts(): Promise<number>;
  uploadImage(blob: Blob, fileName: string): Promise<string>;
  getSettings(): Promise<SiteSettings>;
  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;
  seedIfEmpty(): Promise<void>;
}
