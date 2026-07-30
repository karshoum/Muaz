import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * أرقام عربية-هندية (١٢٣) للإحصاءات والعدّادات.
 * التواريخ التقنية والروابط والهاتف تبقى بالأرقام اللاتينية عمدًا.
 */
export function toArabicDigits(value: number): string {
  return value.toLocaleString('ar-EG', { useGrouping: true });
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** يحوّل لونًا سداسيًا إلى `r, g, b` لاستخدامه داخل rgb(... / alpha) */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}
