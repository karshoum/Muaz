'use client';

import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

import { fadeUp, VIEWPORT } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: ElementType;
  id?: string;
}

/**
 * غلاف الحركة الوحيد في الموقع: يظهر العنصر عند دخوله الشاشة مرة واحدة.
 * الحركات كلها transform/opacity، ويُبطلها prefers-reduced-motion من globals.css.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  id,
}: RevealProps) {
  const MotionTag = motion(as as ElementType);

  return (
    <MotionTag
      id={id}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}

/** حاوية تُتابع ظهور أبنائها بتتابع لطيف. الأبناء يستخدمون <RevealItem>. */
export function Stagger({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.09,
}: StaggerProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        show: { transition: { delayChildren, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
