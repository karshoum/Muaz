'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { describeRemovalError, removeImageBackground } from '@/lib/background-removal';
import { compressImage } from '@/lib/image';

interface BackgroundRemoverProps {
  open: boolean;
  /** رابط الصورة الأصلية المراد تفريغ خلفيتها */
  source: string | null;
  onClose: () => void;
  /** تُستدعى بالصورة المفرّغة (PNG شفاف) عند قبول النتيجة */
  onApply: (blob: Blob) => void;
}

export function BackgroundRemover({ open, source, onClose, onApply }: BackgroundRemoverProps) {
  const [busy, setBusy] = useState(false);
  const [percent, setPercent] = useState(0);
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);

  const reset = () => {
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
    setPercent(0);
    setLabel('');
    setBusy(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const run = async () => {
    if (!source) return;
    setBusy(true);
    setError(null);
    setPercent(1);
    setLabel('جاري تحضير أداة التفريغ...');

    try {
      const blob = await removeImageBackground(source, (progress) => {
        setPercent(progress.percent);
        setLabel(progress.label);
      });
      // ضغط النتيجة مع الحفاظ على الشفافية
      const compressed = await compressImage(blob, { preserveTransparency: true });
      setResult({ blob: compressed, url: URL.createObjectURL(compressed) });
    } catch (err) {
      setError(describeRemovalError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="تفريغ خلفية الصورة" size="lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <figure>
          <figcaption className="mb-2 text-xs font-bold text-navy-300">الصورة الأصلية</figcaption>
          <div className="overflow-hidden rounded-xl border border-softgray bg-white">
            {source && <img src={source} alt="الصورة الأصلية" className="aspect-square w-full object-contain" />}
          </div>
        </figure>

        <figure>
          <figcaption className="mb-2 text-xs font-bold text-navy-300">بعد التفريغ</figcaption>
          <div className="checkerboard overflow-hidden rounded-xl border border-softgray">
            {result ? (
              <img
                src={result.url}
                alt="الصورة بعد تفريغ الخلفية"
                data-testid="removed-preview"
                className="aspect-square w-full object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-white/70 px-4 text-center text-xs text-navy-300">
                {busy ? label : 'اضغط "ابدأ التفريغ" لعرض النتيجة'}
              </div>
            )}
          </div>
        </figure>
      </div>

      {busy && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-softgray">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${percent}%` }}
              data-testid="removal-progress"
            />
          </div>
          <p className="mt-2 text-xs text-navy-300">
            {label} <span className="ltr-nums font-bold">{percent}%</span>
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium leading-relaxed text-red-800">
          {error}
        </p>
      )}

      {!busy && !result && (
        <p className="mt-4 rounded-lg border border-gold/40 bg-gold/10 p-3 text-xs leading-relaxed text-navy-400">
          ملاحظة: أول استخدام ينزّل نموذج ذكاء اصطناعي بحجم كبير (عشرات الميجابايت) ويحتاج اتصالاً
          جيداً. بعدها يصبح التفريغ سريعاً. يمكنك دائماً إغلاق هذه النافذة وحفظ الصورة كما هي.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {result ? (
          <>
            <Button
              fullWidth
              size="lg"
              onClick={() => {
                onApply(result.blob);
                close();
              }}
            >
              ✓ استخدام الصورة المفرّغة
            </Button>
            <Button variant="outline" onClick={reset}>
              إعادة المحاولة
            </Button>
          </>
        ) : (
          <Button fullWidth size="lg" onClick={run} loading={busy} disabled={!source}>
            ابدأ التفريغ
          </Button>
        )}
        <Button variant="ghost" onClick={close} disabled={busy}>
          إلغاء
        </Button>
      </div>
    </Modal>
  );
}
