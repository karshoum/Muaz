/**
 * تفريغ خلفية الصور داخل المتصفح.
 *
 * المكتبة (@imgly/background-removal) ثقيلة جداً — تُنزّل نموذج ذكاء اصطناعي
 * بحجم عشرات الميجابايت عند أول استخدام. لذلك تُستورد ديناميكياً هنا فقط،
 * ولا تدخل حزمة أي صفحة إطلاقاً ما لم يضغط المدير على زر التفريغ صراحةً.
 *
 * العميل العادي لا يُحمّل منها بايتاً واحداً.
 */

export interface RemovalProgress {
  /** نسبة من 0 إلى 100 */
  percent: number;
  /** وصف عربي للمرحلة الحالية */
  label: string;
}

export type ProgressHandler = (progress: RemovalProgress) => void;

function describeStage(key: string): string {
  if (key.includes('fetch')) return 'جاري تنزيل نموذج الذكاء الاصطناعي (مرة واحدة فقط)...';
  if (key.includes('compute')) return 'جاري تفريغ الخلفية...';
  return 'جاري المعالجة...';
}

/**
 * يُرجع صورة PNG بخلفية شفافة.
 * قد يستغرق أول استدعاء وقتاً طويلاً بسبب تنزيل النموذج.
 */
export async function removeImageBackground(
  source: Blob | string,
  onProgress?: ProgressHandler,
): Promise<Blob> {
  onProgress?.({ percent: 1, label: 'جاري تحضير أداة التفريغ...' });

  const { removeBackground } = await import('@imgly/background-removal');

  const result = await removeBackground(source, {
    model: 'isnet_fp16',
    output: { format: 'image/png' },
    progress: (key: string, current: number, total: number) => {
      const percent = total > 0 ? Math.min(99, Math.round((current / total) * 100)) : 0;
      onProgress?.({ percent, label: describeStage(key) });
    },
  });

  onProgress?.({ percent: 100, label: 'تم التفريغ بنجاح' });
  return result;
}

/** رسالة خطأ عربية مفهومة عند فشل التفريغ */
export function describeRemovalError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/fetch|network|load/i.test(message)) {
    return 'تعذّر تنزيل نموذج تفريغ الخلفية. تحقق من اتصال الإنترنت، أو احفظ الصورة كما هي.';
  }
  if (/memory|allocation/i.test(message)) {
    return 'ذاكرة الجهاز لا تكفي لتفريغ الخلفية. جرّب صورة أصغر، أو احفظ الصورة كما هي.';
  }
  return `تعذّر تفريغ الخلفية: ${message}`;
}
