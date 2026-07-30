'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { Logo } from '@/components/layout/Logo';
import { useAuth } from '@/lib/auth/AuthProvider';

export function LoginForm() {
  const { signIn, isSecureMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تسجيل الدخول.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo variant="light" />
        </div>

        <div className="rounded-2xl bg-cream p-6 shadow-card-hover sm:p-8">
          <h1 className="text-lg font-extrabold text-navy">لوحة تحكم المدير</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-navy-300">
            {isSecureMode
              ? 'سجّل الدخول ببريد المدير وكلمة المرور المسجّلة في Supabase.'
              : 'الوضع التجريبي: أدخل أي اسم وكلمة المرور التجريبية للدخول.'}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Field label={isSecureMode ? 'البريد الإلكتروني' : 'الاسم'} required={isSecureMode}>
              {(id) => (
                <Input
                  id={id}
                  type={isSecureMode ? 'email' : 'text'}
                  required={isSecureMode}
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isSecureMode ? 'admin@example.com' : 'مدير المعرض'}
                />
              )}
            </Field>

            <Field label="كلمة المرور" required>
              {(id) => (
                <Input
                  id={id}
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              )}
            </Field>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" loading={busy}>
              تسجيل الدخول
            </Button>
          </form>

          {!isSecureMode && (
            <div className="mt-5 rounded-lg border border-gold/50 bg-gold/10 p-3 text-[11px] leading-relaxed text-navy-400">
              <p className="font-bold text-navy">تنبيه أمني</p>
              <p className="mt-1">
                هذا وضع تجريبي بدون قاعدة بيانات: كلمة المرور مخزّنة في كود الواجهة والبيانات محفوظة
                في هذا المتصفح فقط. قبل نشر الموقع للعامة فعّل Supabase حسب دليل{' '}
                <code className="ltr-nums rounded bg-white px-1">docs/SETUP-AR.md</code>.
              </p>
            </div>
          )}

          <Link
            href="/"
            className="mt-5 block text-center text-xs font-semibold text-navy-300 hover:text-gold"
          >
            ← العودة إلى الموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
