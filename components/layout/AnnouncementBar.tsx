'use client';

import { useSettings } from '@/lib/settings/SettingsProvider';

export function AnnouncementBar() {
  const { settings } = useSettings();
  const text = settings.announcement?.trim();
  if (!text) return null;

  return (
    <div className="bg-gold text-navy" data-testid="announcement-bar">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-center text-[13px] font-semibold sm:text-sm">
        <span aria-hidden>✦</span>
        <p className="line-clamp-1">{text}</p>
        <span aria-hidden>✦</span>
      </div>
    </div>
  );
}
