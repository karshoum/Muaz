import type { Variants } from 'framer-motion';

/** منحنى تسارع واحد لكل الموقع — الاتساق أهم من التنويع. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT = { once: true, margin: '-80px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** الدخول من جهة البداية (اليمين في RTL) */
export const fadeStart: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

export function stagger(delayChildren = 0.05, staggerChildren = 0.09): Variants {
  return {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  };
}
