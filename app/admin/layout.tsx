'use client';

import { AdminNav } from '@/components/admin/AdminNav';
import { LoginForm } from '@/components/admin/LoginForm';
import { PageLoader } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isCloudMode } from '@/lib/data';

/**
 * حارس لوحة التحكم: يعرض شاشة الدخول لغير المصادَقين.
 *
 * هذا الحارس واجهي فقط. الحماية الحقيقية للبيانات تأتي من قواعد RLS
 * في Supabase (راجع supabase/schema.sql) التي تمنع أي كتابة بدون جلسة مدير.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <PageLoader label="جاري التحقق من الجلسة..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminNav />
      {!isCloudMode() && (
        <div className="border-b border-gold/40 bg-gold/15">
          <p className="container-page py-2 text-center text-xs font-semibold leading-relaxed text-navy-500">
            ⚠️ وضع التخزين المحلي: البيانات محفوظة في هذا المتصفح فقط ولا يراها العملاء على أجهزة
            أخرى. فعّل Supabase من دليل docs/SETUP-AR.md لنشر منتجاتك للجميع.
          </p>
        </div>
      )}
      <main className="container-page py-6">{children}</main>
    </div>
  );
}
