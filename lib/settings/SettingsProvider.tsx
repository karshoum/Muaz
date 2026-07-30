'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ensureSeeded, getSettings, updateSettings } from '@/lib/data';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import type { SiteSettings } from '@/lib/data/types';

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
  save: (patch: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getSettings();
      setSettings(next);
    } catch {
      // نُبقي القيم المبدئية إن تعذّر الوصول للتخزين
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await ensureSeeded();
      if (active) await refresh();
    })();
    return () => {
      active = false;
    };
  }, [refresh]);

  const save = useCallback(async (patch: Partial<SiteSettings>) => {
    const next = await updateSettings(patch);
    setSettings(next);
  }, []);

  const value = useMemo(
    () => ({ settings, loading, refresh, save }),
    [settings, loading, refresh, save],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsState {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings يجب أن يُستخدم داخل SettingsProvider');
  return ctx;
}
