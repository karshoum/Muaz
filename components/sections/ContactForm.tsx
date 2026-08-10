'use client';

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { profile } from '@/lib/data';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'mailto' | 'error';

interface Fields {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};

  if (fields.name.trim().length < 2) {
    errors.name = 'الرجاء كتابة الاسم (حرفان على الأقل).';
  }
  if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = 'الرجاء كتابة بريد إلكتروني صحيح.';
  }
  if (fields.message.trim().length < 10) {
    errors.message = 'الرسالة قصيرة جدًا (١٠ أحرف على الأقل).';
  }

  return errors;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>(
    {},
  );
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');

  const update = (key: keyof Fields, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    if (touched[key]) setErrors(validate(next));
  };

  const blur = (key: keyof Fields) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(fields));
  };

  /** يفتح تطبيق البريد لدى المستخدم برسالة مُهيّأة مسبقًا. */
  const openMailClient = () => {
    const subject = encodeURIComponent(
      `رسالة من الموقع الشخصي — ${fields.name.trim()}`,
    );
    const body = encodeURIComponent(
      `الاسم: ${fields.name.trim()}\nالبريد: ${fields.email.trim()}\n\n${fields.message.trim()}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(fields);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    setServerError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        setStatus('success');
        setFields({ name: '', email: '', message: '' });
        setTouched({});
        return;
      }

      // 501 = خدمة الإرسال غير مُفعَّلة → نفتح تطبيق البريد بدل ادّعاء النجاح
      if (response.status === 501) {
        openMailClient();
        setStatus('mailto');
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setServerError(data?.error ?? 'تعذّر إرسال الرسالة.');
      setStatus('error');
    } catch {
      // انقطاع الشبكة — نمنح المستخدم مخرجًا فوريًا بدل رسالة فشل جافّة
      openMailClient();
      setStatus('mailto');
    }
  };

  const inputClass = (key: keyof Fields) =>
    cn(
      'w-full rounded-xl border bg-surface/60 px-4 py-3 text-sm text-ink placeholder:text-faint transition-colors duration-200',
      errors[key] && touched[key]
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-line focus:border-accent',
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* الاسم */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          الاسم
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="اسمك الكريم"
          value={fields.name}
          onChange={(event) => update('name', event.target.value)}
          onBlur={() => blur('name')}
          aria-invalid={Boolean(errors.name && touched.name)}
          aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          className={inputClass('name')}
        />
        {errors.name && touched.name ? (
          <p id="name-error" className="mt-1.5 text-xs text-red-500">
            {errors.name}
          </p>
        ) : null}
      </div>

      {/* البريد */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={(event) => update('email', event.target.value)}
          onBlur={() => blur('email')}
          aria-invalid={Boolean(errors.email && touched.email)}
          aria-describedby={
            errors.email && touched.email ? 'email-error' : undefined
          }
          className={cn(inputClass('email'), 'text-start')}
        />
        {errors.email && touched.email ? (
          <p id="email-error" className="mt-1.5 text-xs text-red-500">
            {errors.email}
          </p>
        ) : null}
      </div>

      {/* الرسالة */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-ink"
        >
          الرسالة
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="اكتب تفاصيل مشروعك أو استفسارك…"
          value={fields.message}
          onChange={(event) => update('message', event.target.value)}
          onBlur={() => blur('message')}
          aria-invalid={Boolean(errors.message && touched.message)}
          aria-describedby={
            errors.message && touched.message ? 'message-error' : undefined
          }
          className={cn(inputClass('message'), 'resize-y leading-7')}
        />
        {errors.message && touched.message ? (
          <p id="message-error" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl grad-cta px-6 text-base font-semibold text-white shadow-soft transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            جارٍ الإرسال…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden="true" />
            إرسال الرسالة
          </>
        )}
      </button>

      {/* حالات الاستجابة — تُعلَن لقارئات الشاشة */}
      <div aria-live="polite" role="status">
        {status === 'success' ? (
          <p className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            وصلت رسالتك. سأردّ عليك على البريد الذي كتبته بإذن الله.
          </p>
        ) : null}

        {status === 'mailto' ? (
          <p className="flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            فُتح تطبيق البريد لديك برسالة جاهزة — اضغط «إرسال» فيه لإتمام
            الإرسال. إن لم يُفتح، راسلني مباشرة على {profile.email}.
          </p>
        ) : null}

        {status === 'error' ? (
          <p className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {serverError} يمكنك مراسلتي مباشرة على {profile.email}.
          </p>
        ) : null}
      </div>
    </form>
  );
}
