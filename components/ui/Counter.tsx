'use client';

import { useEffect, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/lib/hooks';
import { prefersReducedMotion, toArabicDigits } from '@/lib/utils';

interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * عدّاد يبدأ عند دخول العنصر الشاشة.
 * يُصيَّر على الخادم بالقيمة النهائية (مفيد للأرشفة وبلا JavaScript)،
 * ثم يُصفَّر قبل الطلاء الأول على المتصفح فلا وميض ولا اختلاف ترطيب.
 */
export function Counter({ value, duration = 1600, className }: CounterProps) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setDisplay(0);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutExpo — سريع في البداية ثم يستقرّ بهدوء
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setDisplay(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {toArabicDigits(display)}
    </span>
  );
}
