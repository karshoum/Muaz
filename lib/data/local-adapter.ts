import { openDB, type IDBPDatabase } from 'idb';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import { blobToDataUrl } from '@/lib/image';
import { buildSeedProducts } from '@/lib/data/seed';
import type { DataAdapter, Product, ProductInput, SiteSettings } from '@/lib/data/types';

const DB_NAME = 'alraqi-furniture';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';
const SETTINGS_STORE = 'settings';
const SETTINGS_KEY = 'site';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(
      new Error('التخزين المحلي غير متاح في هذه البيئة (IndexedDB غير مدعوم).'),
    );
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
          const store = db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
          store.createIndex('category', 'category');
          store.createIndex('createdAt', 'createdAt');
        }
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE);
        }
      },
    });
  }
  return dbPromise;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * محوّل التخزين المحلي (IndexedDB).
 *
 * تنبيه: البيانات هنا محفوظة داخل متصفح الجهاز الحالي فقط،
 * ولا يراها العملاء على أجهزة أخرى. للاستخدام الحقيقي فعّل Supabase
 * حسب دليل docs/SETUP-AR.md.
 */
export const localAdapter: DataAdapter = {
  name: 'local',

  async listProducts(options = {}) {
    const db = await getDb();
    const all = (await db.getAll(PRODUCTS_STORE)) as Product[];
    const filtered = options.includeUnpublished ? all : all.filter((p) => p.published);
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getProduct(id) {
    const db = await getDb();
    const product = (await db.get(PRODUCTS_STORE, id)) as Product | undefined;
    return product ?? null;
  },

  async createProduct(input) {
    const db = await getDb();
    const now = new Date().toISOString();
    const product: Product = { ...input, id: newId(), createdAt: now, updatedAt: now };
    await db.put(PRODUCTS_STORE, product);
    return product;
  },

  async updateProduct(id, patch) {
    const db = await getDb();
    const existing = (await db.get(PRODUCTS_STORE, id)) as Product | undefined;
    if (!existing) throw new Error('المنتج غير موجود.');
    const updated: Product = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    await db.put(PRODUCTS_STORE, updated);
    return updated;
  },

  async deleteProduct(id) {
    const db = await getDb();
    await db.delete(PRODUCTS_STORE, id);
  },

  async deleteDemoProducts() {
    const db = await getDb();
    const all = (await db.getAll(PRODUCTS_STORE)) as Product[];
    const demos = all.filter((p) => p.isDemo);
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    await Promise.all(demos.map((p) => tx.store.delete(p.id)));
    await tx.done;
    return demos.length;
  },

  /** في الوضع المحلي نحفظ الصورة كـ data URL داخل سجل المنتج نفسه */
  async uploadImage(blob) {
    return blobToDataUrl(blob);
  },

  async getSettings() {
    const db = await getDb();
    const stored = (await db.get(SETTINGS_STORE, SETTINGS_KEY)) as
      | Partial<SiteSettings>
      | undefined;
    return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
  },

  async updateSettings(patch) {
    const db = await getDb();
    const current = await this.getSettings();
    const next: SiteSettings = { ...current, ...patch };
    await db.put(SETTINGS_STORE, next, SETTINGS_KEY);
    return next;
  },

  /** يزرع المنتجات التجريبية مرة واحدة فقط عند أول تشغيل */
  async seedIfEmpty() {
    const db = await getDb();
    const count = await db.count(PRODUCTS_STORE);
    if (count > 0) return;
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    await Promise.all(buildSeedProducts().map((p) => tx.store.put(p)));
    await tx.done;
  },
};

/** لأغراض الاختبار: إعادة تهيئة الاتصال بقاعدة البيانات */
export function resetLocalAdapterForTests(): void {
  dbPromise = null;
}
