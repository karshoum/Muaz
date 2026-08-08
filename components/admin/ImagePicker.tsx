'use client';

import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { CameraCapture } from '@/components/admin/CameraCapture';
import { BackgroundRemover } from '@/components/admin/BackgroundRemover';
import { uploadImage } from '@/lib/data';
import { compressImage, hasTransparency, humanFileSize, isImageFile } from '@/lib/image';
import { MAX_UPLOAD_BYTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/lib/data/types';

interface ImagePickerProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  max?: number;
}

function newImageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * اختيار صور المنتج من مصدرين متكافئين:
 *   1. معرض الجهاز / الملفات (مع السحب والإفلات ورفع عدة صور دفعة واحدة)
 *   2. الكاميرا مباشرة
 *
 * تفريغ الخلفية اختياري تماماً لكل صورة على حدة، ويمكن التراجع عنه
 * لأن الصورة الأصلية تُحفظ دائماً.
 */
export function ImagePicker({ value, onChange, max = 6 }: ImagePickerProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [removerTarget, setRemoverTarget] = useState<ProductImage | null>(null);

  const addBlob = useCallback(
    async (blob: Blob, fileName: string) => {
      if (value.length >= max) {
        toast(`الحد الأقصى ${max} صور لكل منتج.`, 'error');
        return;
      }
      setUploading(true);
      try {
        // نحترم الشفافية إن كانت الصورة مفرّغة الخلفية مسبقاً
        const transparent = await hasTransparency(blob);
        const compressed = await compressImage(blob, { preserveTransparency: transparent });
        const url = await uploadImage(compressed, fileName);
        onChange([
          ...value,
          { id: newImageId(), url, backgroundRemoved: transparent },
        ]);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'تعذّر رفع الصورة.', 'error');
      } finally {
        setUploading(false);
      }
    },
    [value, max, onChange, toast],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      const room = max - value.length;
      if (room <= 0) {
        toast(`الحد الأقصى ${max} صور لكل منتج.`, 'error');
        return;
      }

      setUploading(true);
      const added: ProductImage[] = [];

      try {
        for (const file of list.slice(0, room)) {
          if (!isImageFile(file)) {
            toast(`الملف "${file.name}" ليس صورة وتم تجاهله.`, 'error');
            continue;
          }
          if (file.size > MAX_UPLOAD_BYTES) {
            toast(
              `حجم "${file.name}" (${humanFileSize(file.size)}) أكبر من الحد المسموح.`,
              'error',
            );
            continue;
          }
          // الصور المفرّغة مسبقاً (PNG شفاف) تُحفظ بشفافيتها بدل تحويلها JPEG أبيض
          const transparent = await hasTransparency(file);
          const compressed = await compressImage(file, { preserveTransparency: transparent });
          const url = await uploadImage(compressed, file.name.replace(/\.[^.]+$/, ''));
          added.push({ id: newImageId(), url, backgroundRemoved: transparent });
        }

        if (added.length > 0) {
          onChange([...value, ...added]);
          const transparentCount = added.filter((image) => image.backgroundRemoved).length;
          toast(
            transparentCount === added.length
              ? `تمت إضافة ${added.length} صورة مفرّغة الخلفية.`
              : `تمت إضافة ${added.length} صورة. التفريغ اختياري من زر كل صورة.`,
          );
        }
        if (list.length > room) {
          toast(`تم تجاهل ${list.length - room} صورة لتجاوز الحد الأقصى.`, 'error');
        }
      } catch (err) {
        toast(err instanceof Error ? err.message : 'تعذّر رفع الصور.', 'error');
      } finally {
        setUploading(false);
      }
    },
    [value, max, onChange, toast],
  );

  /** استبدال صورة بنسخة مفرّغة الخلفية مع الاحتفاظ بالأصل للتراجع */
  const applyRemoval = useCallback(
    async (target: ProductImage, blob: Blob) => {
      setUploading(true);
      try {
        const url = await uploadImage(blob, 'no-bg');
        onChange(
          value.map((image) =>
            image.id === target.id
              ? {
                  ...image,
                  url,
                  originalUrl: image.originalUrl ?? image.url,
                  backgroundRemoved: true,
                }
              : image,
          ),
        );
        toast('تم تفريغ خلفية الصورة بنجاح.');
      } catch (err) {
        toast(err instanceof Error ? err.message : 'تعذّر حفظ الصورة المفرّغة.', 'error');
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, toast],
  );

  const revert = (target: ProductImage) => {
    if (!target.originalUrl) return;
    onChange(
      value.map((image) =>
        image.id === target.id
          ? { ...image, url: target.originalUrl as string, backgroundRemoved: false }
          : image,
      ),
    );
    toast('تمت العودة إلى الصورة الأصلية.');
  };

  const removeImage = (id: string) => {
    onChange(value.filter((image) => image.id !== id));
  };

  const makePrimary = (id: string) => {
    const target = value.find((image) => image.id === id);
    if (!target) return;
    onChange([target, ...value.filter((image) => image.id !== id)]);
    toast('تم تعيينها كصورة رئيسية.');
  };

  return (
    <div className="space-y-4">
      {/* منطقة الإضافة */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'rounded-2xl border-2 border-dashed p-5 text-center transition-colors',
          dragOver ? 'border-gold bg-gold/10' : 'border-softgray bg-white',
        )}
      >
        <p className="text-sm font-bold text-navy">أضف صور القطعة</p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-navy-300">
          اختر من معرض جهازك أو صوّر القطعة مباشرة بالكاميرا. تفريغ الخلفية اختياري تماماً — يمكنك
          حفظ الصورة كما هي.
        </p>

        <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
          <Button
            type="button"
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || value.length >= max}
          >
            🖼️ من معرض الجهاز
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCameraOpen(true)}
            disabled={uploading || value.length >= max}
          >
            📷 التقاط بالكاميرا
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          data-testid="image-file-input"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void handleFiles(e.target.files);
            e.target.value = '';
          }}
        />

        <p className="mt-3 text-[11px] text-navy-200">
          {value.length} من {max} صور • يمكنك أيضاً سحب الصور وإفلاتها هنا
        </p>

        {uploading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-navy-400">
            <Spinner className="h-4 w-4" />
            جاري معالجة الصور...
          </div>
        )}
      </div>

      {/* الصور المضافة */}
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="image-list">
          {value.map((image, index) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-xl border border-softgray bg-white"
            >
              <div className={cn('relative', image.backgroundRemoved && 'checkerboard')}>
                <img
                  src={image.url}
                  alt={`صورة ${index + 1}`}
                  className="aspect-square w-full object-contain"
                />
                {index === 0 && (
                  <span className="absolute end-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-navy">
                    رئيسية
                  </span>
                )}
                {image.backgroundRemoved && (
                  <span className="absolute start-1.5 top-1.5 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-cream">
                    مفرّغة
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 p-2">
                {image.backgroundRemoved ? (
                  <button
                    type="button"
                    onClick={() => revert(image)}
                    className="flex-1 rounded-md bg-softgray px-2 py-1.5 text-[11px] font-bold text-navy transition-colors hover:bg-gold/30"
                  >
                    ↩ الأصلية
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRemoverTarget(image)}
                    className="flex-1 rounded-md bg-gold/20 px-2 py-1.5 text-[11px] font-bold text-gold-700 transition-colors hover:bg-gold/40"
                  >
                    ✨ تفريغ الخلفية
                  </button>
                )}
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(image.id)}
                    className="rounded-md bg-softgray px-2 py-1.5 text-[11px] font-bold text-navy transition-colors hover:bg-gold/30"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  aria-label="حذف الصورة"
                  className="rounded-md bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-700 transition-colors hover:bg-red-100"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(blob) => void addBlob(blob, 'camera')}
      />

      <BackgroundRemover
        open={Boolean(removerTarget)}
        source={removerTarget?.url ?? null}
        onClose={() => setRemoverTarget(null)}
        onApply={(blob) => {
          if (removerTarget) void applyRemoval(removerTarget, blob);
          setRemoverTarget(null);
        }}
      />
    </div>
  );
}
