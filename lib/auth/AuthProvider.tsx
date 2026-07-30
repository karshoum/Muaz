'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * كلمة مرور الوضع التجريبي (بدون Supabase).
 * تُستخدم فقط حين لا تُضبط مفاتيح Supabase، وهي غير آمنة للنشر العام —
 * لذلك تظهر لافتة تحذير داخل لوحة التحكم في هذا الوضع.
 */
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DEMO_PASSWORD || 'admin1234';
const DEMO_SESSION_KEY = 'alraqi-demo-admin';

interface AuthState {
  /** جاري التحقق من الجلسة عند أول تحميل */
  loading: boolean;
  isAuthenticated: boolean;
  email: string | null;
  /** هل نستخدم مصادقة Supabase الحقيقية؟ */
  isSecureMode: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const secure = isSupabaseConfigured();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!secure) {
      const stored =
        typeof window !== 'undefined' ? window.sessionStorage.getItem(DEMO_SESSION_KEY) : null;
      if (active) {
        setEmail(stored);
        setLoading(false);
      }
      return () => {
        active = false;
      };
    }

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [secure]);

  const signIn = useCallback(
    async (userEmail: string, password: string) => {
      if (!secure) {
        if (password !== DEMO_PASSWORD) {
          throw new Error('كلمة المرور غير صحيحة.');
        }
        const label = userEmail.trim() || 'مدير المعرض';
        window.sessionStorage.setItem(DEMO_SESSION_KEY, label);
        setEmail(label);
        return;
      }

      const supabase = getSupabase();
      if (!supabase) throw new Error('تعذّر الاتصال بـ Supabase.');

      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail.trim(),
        password,
      });
      if (error) {
        if (/invalid login credentials/i.test(error.message)) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
        if (/email not confirmed/i.test(error.message)) {
          throw new Error(
            'لم يتم تأكيد البريد الإلكتروني بعد. راجع بريدك أو أكّده من لوحة Supabase.',
          );
        }
        throw new Error(error.message);
      }
    },
    [secure],
  );

  const signOut = useCallback(async () => {
    if (!secure) {
      window.sessionStorage.removeItem(DEMO_SESSION_KEY);
      setEmail(null);
      return;
    }
    await getSupabase()?.auth.signOut();
    setEmail(null);
  }, [secure]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      isAuthenticated: Boolean(email),
      email,
      isSecureMode: secure,
      signIn,
      signOut,
    }),
    [loading, email, secure, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth يجب أن يُستخدم داخل AuthProvider');
  return ctx;
}
