'use client';

import { useState } from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { useSettings } from '@/lib/settings/SettingsProvider';
import {
  buildGeneralWhatsAppUrl,
  buildWhatsAppUrl,
  formatPhoneForDisplay,
  isValidWhatsAppNumber,
} from '@/lib/whatsapp';
import { SITE_FULL_NAME } from '@/lib/constants';

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const numberValid = isValidWhatsAppNumber(settings.whatsappNumber);

  const sendViaWhatsApp = () => {
    const text = [
      'السلام عليكم ورحمة الله 👋',
      name.trim() ? `الاسم: ${name.trim()}` : '',
      '',
      message.trim() || `أرغب في الاستفسار عن منتجات ${SITE_FULL_NAME}.`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = buildWhatsAppUrl(settings.whatsappNumber, text);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="container-page py-10">
        <h1 className="heading-underline text-2xl font-extrabold text-navy sm:text-3xl">
          تواصل معنا
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* بيانات التواصل */}
          <div className="space-y-3">
            {settings.address && (
              <div className="flex items-start gap-3 rounded-xl border border-softgray bg-white p-4">
                <span className="text-xl" aria-hidden>
                  📍
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy">العنوان</h2>
                  <p className="mt-1 text-sm text-navy-400">{settings.address}</p>
                </div>
              </div>
            )}

            {numberValid && (
              <div className="flex items-start gap-3 rounded-xl border border-softgray bg-white p-4">
                <span className="text-xl" aria-hidden>
                  💬
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy">واتساب الطلبات</h2>
                  <a
                    href={buildGeneralWhatsAppUrl(settings.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ltr-nums mt-1 block text-sm font-semibold text-gold-600 hover:underline"
                  >
                    {formatPhoneForDisplay(settings.whatsappNumber)}
                  </a>
                  {isValidWhatsAppNumber(settings.whatsappNumberAlt) && (
                    <a
                      href={buildGeneralWhatsAppUrl(settings.whatsappNumberAlt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ltr-nums mt-1 block text-sm font-semibold text-gold-600 hover:underline"
                    >
                      {formatPhoneForDisplay(settings.whatsappNumberAlt)}
                    </a>
                  )}
                </div>
              </div>
            )}

            {settings.phone && (
              <div className="flex items-start gap-3 rounded-xl border border-softgray bg-white p-4">
                <span className="text-xl" aria-hidden>
                  📞
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy">الهاتف</h2>
                  <a
                    href={`tel:${settings.phone}`}
                    className="ltr-nums mt-1 block text-sm text-navy-400"
                  >
                    {formatPhoneForDisplay(settings.phone)}
                  </a>
                </div>
              </div>
            )}

            {settings.email && (
              <div className="flex items-start gap-3 rounded-xl border border-softgray bg-white p-4">
                <span className="text-xl" aria-hidden>
                  ✉️
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy">البريد الإلكتروني</h2>
                  <a
                    href={`mailto:${settings.email}`}
                    className="ltr-nums mt-1 block text-sm text-navy-400"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            )}

            {settings.workingHours && (
              <div className="flex items-start gap-3 rounded-xl border border-softgray bg-white p-4">
                <span className="text-xl" aria-hidden>
                  🕒
                </span>
                <div>
                  <h2 className="text-sm font-bold text-navy">أوقات العمل</h2>
                  <p className="mt-1 text-sm text-navy-400">{settings.workingHours}</p>
                </div>
              </div>
            )}
          </div>

          {/* نموذج المراسلة عبر واتساب */}
          <div className="rounded-2xl border border-softgray bg-white p-5 shadow-card">
            <h2 className="text-base font-bold text-navy">أرسل رسالتك مباشرة</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-navy-300">
              اكتب رسالتك وسنفتح لك واتساب بها جاهزة للإرسال.
            </p>

            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                sendViaWhatsApp();
              }}
            >
              <Field label="الاسم">
                {(id) => (
                  <Input
                    id={id}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكريم"
                  />
                )}
              </Field>

              <Field label="رسالتك" required>
                {(id) => (
                  <Textarea
                    id={id}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب استفسارك أو القطعة التي تبحث عنها..."
                  />
                )}
              </Field>

              <Button type="submit" variant="whatsapp" fullWidth disabled={!numberValid}>
                إرسال عبر واتساب
              </Button>

              {!numberValid && (
                <p className="text-xs font-medium text-red-600">
                  لم يُضبط رقم واتساب بعد. أضِفه من لوحة تحكم المدير ← الإعدادات.
                </p>
              )}
            </form>
          </div>
        </div>

        {settings.mapUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-softgray">
            <iframe
              src={settings.mapUrl}
              title="موقع المعرض على الخريطة"
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
