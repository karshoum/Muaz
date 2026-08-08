import { IMAGE_MAX_DIMENSION } from '@/lib/constants';

export interface CompressOptions {
  maxDimension?: number;
  /** أبقِ الشفافية (PNG) — ضروري للصور المفرّغة الخلفية */
  preserveTransparency?: boolean;
  quality?: number;
}

/** تحميل ملف/Blob إلى عنصر صورة جاهز للرسم على canvas */
export function loadImageElement(source: Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const isBlob = typeof source !== 'string';
    const url = isBlob ? URL.createObjectURL(source) : source;

    img.onload = () => {
      if (isBlob) URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      if (isBlob) URL.revokeObjectURL(url);
      reject(new Error('تعذّر قراءة الصورة. تأكد أن الملف صورة صالحة.'));
    };
    img.src = url;
  });
}

/**
 * تصغير الصورة وضغطها قبل الحفظ.
 * الصور المفرّغة الخلفية تُحفظ PNG للحفاظ على الشفافية، وغيرها JPEG أخف حجماً.
 */
export async function compressImage(
  source: Blob,
  options: CompressOptions = {},
): Promise<Blob> {
  const {
    maxDimension = IMAGE_MAX_DIMENSION,
    preserveTransparency = false,
    quality = 0.85,
  } = options;

  const img = await loadImageElement(source);
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return source;

  if (!preserveTransparency) {
    // خلفية بيضاء بدل الشفافية عند الحفظ بصيغة JPEG
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  const type = preserveTransparency ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, quality),
  );

  return blob ?? source;
}

/**
 * هل تحتوي الصورة على مناطق شفافة فعلاً؟
 *
 * يُستخدم عند رفع صورة من معرض الجهاز: إن كانت مفرّغة الخلفية مسبقاً
 * (PNG شفاف) نحفظها PNG بدل تحويلها JPEG بخلفية بيضاء فنفقد الشفافية.
 * نفحص نسخة مصغّرة لأن الفحص بالحجم الكامل بطيء بلا فائدة.
 */
export async function hasTransparency(source: Blob): Promise<boolean> {
  // JPEG لا يدعم الشفافية أصلاً — نوفّر الفحص
  if (source.type === 'image/jpeg' || source.type === 'image/jpg') return false;

  try {
    const img = await loadImageElement(source);
    const scale = Math.min(1, 320 / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0, width, height);
    const { data } = ctx.getImageData(0, 0, width, height);

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 250) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('تعذّر تحويل الصورة.'));
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/** اسم ملف فريد وآمن للتخزين */
export function buildImageFileName(prefix: string, mimeType: string): string {
  const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const safePrefix = prefix.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20) || 'img';
  return `${safePrefix}-${stamp}-${rand}.${ext}`;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} كيلوبايت`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
}
