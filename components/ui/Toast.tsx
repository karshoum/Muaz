'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastApi {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const ICONS: Record<ToastKind, string> = {
  success: '✓',
  error: '!',
  info: 'i',
};

const STYLES: Record<ToastKind, string> = {
  success: 'bg-navy text-cream border-gold',
  error: 'bg-red-700 text-white border-red-900',
  info: 'bg-gold text-navy border-gold-700',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-testid="toast"
            className={cn(
              'pointer-events-auto flex animate-toastIn items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium shadow-card-hover',
              STYLES[item.kind],
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {ICONS[item.kind]}
            </span>
            <span className="flex-1">{item.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  // fallback صامت حتى لا ينكسر أي مكوّن يُستخدم خارج المزوّد (في الاختبارات مثلاً)
  return ctx ?? { toast: () => {} };
}
