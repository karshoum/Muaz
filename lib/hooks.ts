'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * منفصل عن lib/utils.ts عمدًا: ملف utils تستهلكه مكوّنات الخادم،
 * واستيراد خطّافات React داخله يكسر البناء.
 * يمنع أيضًا تحذير React عند التصيير على الخادم.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
