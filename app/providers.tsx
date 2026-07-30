'use client';

import { AuthProvider } from '@/lib/auth/AuthProvider';
import { SettingsProvider } from '@/lib/settings/SettingsProvider';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
