'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox, Field, Input } from '@/components/ui/Field';
import { PageLoader } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { useSettings } from '@/lib/settings/SettingsProvider';
import { formatPhoneForDisplay, isValidWhatsAppNumber, normalizePhone } from '@/lib/whatsapp';
import type { SiteSettings } from '@/lib/data/types';

export default function AdminSettingsPage() {
  const { settings, loading, save } = useSettings();
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidWhatsAppNumber(form.whatsappNumber)) {
      toast('رقم واتساب الطلبات غير صالح. اكتبه بصيغة +249xxxxxxxxx أو 09xxxxxxxx.', 'error');
      return;
    }
    if (form.whatsappNumberAlt.trim() && !isValidWhatsAppNumber(form.whatsappNumberAlt)) {
      toast('رقم واتساب الاحتياطي غير صالح.', 'error');
      return;
    }

    setBusy(true);
    try {
      await save(form);
      toast('تم حفظ الإعدادات. أزرار الطلب تستخدم الرقم الجديد فوراً.');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'تعذّر حفظ الإعدادات.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="heading-underline text-xl font-extrabold text-navy">الإعدادات</h1>
        <p className="mt-2 text-sm text-navy-300">
          تُطبَّق هذه القيم على الموقع فوراً بعد الحفظ، دون الحاجة لتعديل أي كود.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* أرقام الطلبات */}
        <section className="rounded-2xl border border-softgray bg-white p-5">
          <h2 className="mb-1 text-base font-bold text-navy">أرقام استقبال الطلبات</h2>
          <p className="mb-4 text-xs leading-relaxed text-navy-300">
            الرقم الأساسي هو الذي تصل إليه كل طلبات الواتساب من أزرار المنتجات.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="رقم واتساب الطلبات (أساسي)"
              required
              hint={
                isValidWhatsAppNumber(form.whatsappNumber)
                  ? `سيُرسل إلى: ${formatPhoneForDisplay(form.whatsappNumber)} (wa.me/${normalizePhone(form.whatsappNumber)})`
                  : 'اكتب الرقم بصيغة +249xxxxxxxxx أو 09xxxxxxxx'
              }
            >
              {(id) => (
                <Input
                  id={id}
                  value={form.whatsappNumber}
                  onChange={(e) => set('whatsappNumber', e.target.value)}
                  placeholder="+249912345678"
                  className="ltr-nums"
                  dir="ltr"
                />
              )}
            </Field>

            <Field label="رقم واتساب إضافي (اختياري)">
              {(id) => (
                <Input
                  id={id}
                  value={form.whatsappNumberAlt}
                  onChange={(e) => set('whatsappNumberAlt', e.target.value)}
                  placeholder="+249987654321"
                  className="ltr-nums"
                  dir="ltr"
                />
              )}
            </Field>
          </div>
        </section>

        {/* بيانات المعرض */}
        <section className="rounded-2xl border border-softgray bg-white p-5">
          <h2 className="mb-4 text-base font-bold text-navy">بيانات المعرض</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="هاتف المعرض">
              {(id) => (
                <Input
                  id={id}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="ltr-nums"
                  dir="ltr"
                />
              )}
            </Field>

            <Field label="البريد الإلكتروني">
              {(id) => (
                <Input
                  id={id}
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="ltr-nums"
                  dir="ltr"
                />
              )}
            </Field>

            <Field label="العنوان" className="sm:col-span-2">
              {(id) => (
                <Input
                  id={id}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="الخرطوم — شارع..."
                />
              )}
            </Field>

            <Field label="أوقات العمل">
              {(id) => (
                <Input
                  id={id}
                  value={form.workingHours}
                  onChange={(e) => set('workingHours', e.target.value)}
                />
              )}
            </Field>

            <Field label="رمز العملة" hint="يظهر بجانب الأسعار عند تفعيل إظهارها">
              {(id) => (
                <Input
                  id={id}
                  value={form.currency}
                  onChange={(e) => set('currency', e.target.value)}
                  placeholder="ج.س"
                  disabled={!form.showPrices}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <Checkbox
                label="إظهار الأسعار للعملاء"
                checked={form.showPrices}
                onChange={(e) => set('showPrices', e.target.checked)}
              />
              <p className="mt-1.5 text-xs leading-relaxed text-navy-300">
                عند إيقافه تختفي الأسعار من كل الموقع ويظهر بدلاً منها «السعر عند الطلب»، ولا
                يُرسل السعر في رسالة الواتساب بل يطلبه العميل منك.
              </p>
            </div>

            <Field
              label="شريط الإعلانات العلوي"
              className="sm:col-span-2"
              hint="اتركه فارغاً لإخفاء الشريط"
            >
              {(id) => (
                <Input
                  id={id}
                  value={form.announcement}
                  onChange={(e) => set('announcement', e.target.value)}
                />
              )}
            </Field>

            <Field
              label="رابط تضمين الخريطة (اختياري)"
              className="sm:col-span-2"
              hint="من خرائط جوجل: مشاركة ← تضمين خريطة ← انسخ رابط src"
            >
              {(id) => (
                <Input
                  id={id}
                  value={form.mapUrl}
                  onChange={(e) => set('mapUrl', e.target.value)}
                  className="ltr-nums"
                  dir="ltr"
                />
              )}
            </Field>
          </div>
        </section>

        {/* شبكات التواصل */}
        <section className="rounded-2xl border border-softgray bg-white p-5">
          <h2 className="mb-1 text-base font-bold text-navy">روابط شبكات التواصل</h2>
          <p className="mb-4 text-xs text-navy-300">
            اترك الحقل فارغاً لإخفاء أيقونته من ذيل الموقع.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ['facebook', 'فيسبوك'],
                ['instagram', 'إنستقرام'],
                ['tiktok', 'تيك توك'],
                ['twitter', 'إكس (تويتر)'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                {(id) => (
                  <Input
                    id={id}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={`https://${key}.com/...`}
                    className="ltr-nums"
                    dir="ltr"
                  />
                )}
              </Field>
            ))}
          </div>
        </section>

        <Button type="submit" size="lg" loading={busy} className="sm:w-64">
          حفظ الإعدادات
        </Button>
      </form>
    </div>
  );
}
