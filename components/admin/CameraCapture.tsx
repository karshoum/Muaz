'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

type Facing = 'environment' | 'user';

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

/** رسالة عربية واضحة لكل سبب فشل محتمل للكاميرا */
function describeCameraError(error: unknown): string {
  const name = error instanceof Error ? error.name : '';
  switch (name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'تم رفض إذن الكاميرا. اسمح بالوصول إلى الكاميرا من إعدادات المتصفح ثم أعد المحاولة.';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'لم يُعثر على كاميرا في هذا الجهاز.';
    case 'NotReadableError':
      return 'الكاميرا مستخدمة من تطبيق آخر. أغلق التطبيقات الأخرى ثم أعد المحاولة.';
    case 'OverconstrainedError':
      return 'الكاميرا المطلوبة غير متاحة. جرّب التبديل إلى الكاميرا الأخرى.';
    default:
      return error instanceof Error ? error.message : 'تعذّر تشغيل الكاميرا.';
  }
}

export function CameraCapture({ open, onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<Facing>('environment');
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      return;
    }

    let cancelled = false;

    const start = async () => {
      setError(null);
      setStarting(true);

      // الكاميرا لا تعمل إلا في سياق آمن (HTTPS أو localhost) — قيد من المتصفح
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setError(
          'الكاميرا تحتاج اتصالاً آمناً (HTTPS) أو التشغيل على localhost. يمكنك رفع الصورة من معرض الجهاز بدلاً من ذلك.',
        );
        setStarting(false);
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setError('هذا المتصفح لا يدعم فتح الكاميرا. استخدم رفع الصور من المعرض.');
        setStarting(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch (err) {
        if (!cancelled) setError(describeCameraError(err));
      } finally {
        if (!cancelled) setStarting(false);
      }
    };

    void start();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [open, facing, stopStream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onCapture(blob);
        stopStream();
        onClose();
      },
      'image/jpeg',
      0.92,
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="التقاط صورة بالكاميرا" size="lg">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium leading-relaxed text-red-800">{error}</p>
          <Button variant="outline" className="mt-3" onClick={() => setFacing((f) => f)}>
            إعادة المحاولة
          </Button>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-xl bg-navy">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              data-testid="camera-preview"
              className="aspect-video w-full object-cover"
            />
            {starting && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/70">
                <Spinner className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleCapture} disabled={starting} fullWidth size="lg">
              📸 التقاط الصورة
            </Button>
            <Button
              variant="outline"
              onClick={() => setFacing((f) => (f === 'environment' ? 'user' : 'environment'))}
              disabled={starting}
            >
              🔄 تبديل الكاميرا
            </Button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-navy-300">
            نصيحة: صوّر القطعة أمام خلفية بسيطة وبإضاءة جيدة — هذا يحسّن نتيجة تفريغ الخلفية كثيراً.
          </p>
        </>
      )}
    </Modal>
  );
}
