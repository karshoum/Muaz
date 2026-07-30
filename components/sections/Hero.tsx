import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';

import { Counter } from '@/components/ui/Counter';
import { Reveal, RevealItem, Stagger } from '@/components/ui/Reveal';
import { TypingRoles } from '@/components/ui/TypingRoles';
import { profile, stats } from '@/lib/data';
import { icons } from '@/lib/icons';
import { fadeUp, scaleIn } from '@/lib/motion';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32"
    >
      {/* ————— الخلفية: شبكة خافتة + كرتان ضوئيتان ————— */}
      <div
        className="hero-bg-fade pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute -top-24 start-[-10%] h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-[120px] animate-blob-a" />
        <div className="absolute -bottom-32 end-[-12%] h-[30rem] w-[30rem] rounded-full bg-accent2/20 blur-[120px] animate-blob-b" />
      </div>

      <div className="container-page">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal variants={scaleIn}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent sm:text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              متاح للتعاون والاستشارات التقنية
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.25] text-ink sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-4 text-lg font-semibold text-muted sm:text-2xl">
              <TypingRoles roles={profile.roles} />
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-muted sm:text-lg sm:leading-9">
              {profile.subtitle}
            </p>
          </Reveal>

          {/* ————— أزرار الإجراء ————— */}
          <Reveal delay={0.32} className="mt-9 w-full">
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href="#projects"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl grad-cta px-7 text-base font-semibold text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5"
              >
                استكشف أعمالي
                <ArrowLeft
                  className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#contact"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-line bg-surface/60 px-7 text-base font-semibold text-ink backdrop-blur transition-colors duration-200 hover:border-accent/50 hover:text-accent"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                تواصل معي
              </a>
            </div>
          </Reveal>
        </div>

        {/* ————— الإحصاءات ————— */}
        <Stagger
          className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          delayChildren={0.4}
        >
          {stats.map((stat) => {
            const Icon = icons[stat.icon];
            return (
              <RevealItem key={stat.id} variants={fadeUp}>
                <div className="glass flex h-full flex-col items-center gap-1.5 rounded-2xl px-4 py-5 text-center shadow-soft">
                  <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                  <p className="text-2xl font-bold text-ink sm:text-3xl">
                    {stat.prefix ? <span>{stat.prefix}</span> : null}
                    <Counter value={stat.value} />
                  </p>
                  <p className="text-xs text-muted sm:text-sm">{stat.label}</p>
                </div>
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
