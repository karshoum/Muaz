'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';

import { cn } from '@/lib/utils';

/**
 * لا حالة React للثيم: مصدر الحقيقة هو الصنف `dark` على <html>،
 * والسكربت المضمّن في <head> يضبطه قبل الطلاء. الأيقونتان تتبادلان
 * بـ CSS فقط، فلا يوجد اختلاف ترطيب ولا ومضة عند إعادة التحميل.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = useCallback(() => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    root.style.colorScheme = isDark ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* التخزين المحلي قد يكون معطّلًا — التبديل يظل يعمل للجلسة الحالية */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="تبديل بين الوضع الفاتح والوضع الداكن"
      title="تبديل الوضع الفاتح/الداكن"
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface/70 text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent',
        className,
      )}
    >
      <Sun className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
    </button>
  );
}
