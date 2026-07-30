import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { ContactForm } from './ContactForm';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { profile } from '@/lib/data';

const channels = [
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'واتساب',
    value: profile.phone,
    href: profile.whatsapp,
    external: true,
    hint: 'الأسرع للردّ',
  },
  {
    id: 'email',
    icon: Mail,
    label: 'البريد الإلكتروني',
    value: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    hint: 'للمراسلات الرسمية',
  },
  {
    id: 'phone',
    icon: Phone,
    label: 'الهاتف',
    value: profile.phone,
    href: profile.phoneHref,
    external: false,
    hint: 'خلال ساعات العمل',
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-accent/5 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-page">
        <SectionHeading
          eyebrow="تواصل معي"
          title="لديك نظام تريد بناءه أو عملية تريد أتمتتها؟"
          description="اكتب لي التفاصيل وسأعود إليك برأي صريح في الجدوى والوقت والتقنية المناسبة — حتى لو كان الجواب أنك لا تحتاج نظامًا جديدًا."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {/* النموذج */}
          <Reveal>
            <GlassCard className="h-full p-7 sm:p-9">
              <h3 className="text-xl font-bold text-ink">أرسل رسالة</h3>
              <p className="mb-6 mt-2 text-sm leading-7 text-muted">
                جميع الحقول مطلوبة. لن يُستخدم بريدك إلا للردّ عليك.
              </p>
              <ContactForm />
            </GlassCard>
          </Reveal>

          {/* قنوات مباشرة */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.id}
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="glass group flex items-center gap-4 rounded-3xl p-5 shadow-soft transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl grad-cta text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">
                        {channel.label}
                      </p>
                      <p
                        className="truncate text-sm text-muted transition-colors group-hover:text-accent"
                        dir="ltr"
                      >
                        {channel.value}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-faint">
                      {channel.hint}
                    </span>
                  </a>
                );
              })}

              {/* الموقع — بلا flex-1 كي لا تتمدّد البطاقة وتترك فراغًا ميتًا */}
              <GlassCard className="flex flex-col gap-4 p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">الموقع</p>
                    <p className="mt-1 text-sm leading-7 text-muted">
                      {profile.locationFull}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse-ring" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    متاح حاليًا لمشاريع واستشارات جديدة
                  </p>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
