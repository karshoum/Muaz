'use client';

import { useEffect, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/lib/hooks';
import { prefersReducedMotion } from '@/lib/utils';

const TYPE_MS = 85;
const DELETE_MS = 40;
const HOLD_MS = 1700;

/**
 * تأثير كتابة يتنقّل بين المسمّيات المهنية.
 * يُصيَّر على الخادم بالمسمّى الأول كاملًا (فلا فراغ ولا اختلاف ترطيب)،
 * ومع تفضيل تقليل الحركة يبقى ثابتًا بلا أي كتابة.
 */
export function TypingRoles({ roles }: { roles: readonly string[] }) {
  const [text, setText] = useState(roles[0] ?? '');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setText('');
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const current = roles[index % roles.length];

    if (!deleting && text === current) {
      const timer = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timer = setTimeout(
      () => {
        setText((prev) =>
          deleting
            ? current.slice(0, prev.length - 1)
            : current.slice(0, prev.length + 1),
        );
      },
      deleting ? DELETE_MS : TYPE_MS,
    );

    return () => clearTimeout(timer);
  }, [text, deleting, index, roles, enabled]);

  return (
    // يحجز أعرض مسمّى مسبقًا فلا يقفز التخطيط أثناء الكتابة،
    // والمؤشّر داخل الطبقة المطلقة ليلاصق آخر حرف مكتوب لا نهاية المساحة المحجوزة.
    <span className="relative inline-block align-bottom">
      <span className="invisible whitespace-nowrap" aria-hidden="true">
        {roles.reduce((a, b) => (a.length >= b.length ? a : b), '')}
      </span>
      <span className="absolute inset-0 whitespace-nowrap" aria-live="off">
        <span className="text-gradient">{text}</span>
        <span
          className="ms-1 inline-block h-[0.9em] w-[3px] rounded-full bg-accent align-middle animate-caret"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
