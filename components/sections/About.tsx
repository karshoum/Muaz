import { Quote } from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal, RevealItem, Stagger } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { principles, profile, quickFacts } from '@/lib/data';
import { icons } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="عنّي"
          title="بين المحاضرة والمحرِّر النصّي"
          description="خلفية أكاديمية راسخة وخبرة ميدانية في بناء الأنظمة، تلتقيان في هدف واحد: أن تعمل التقنية لصالح من يستخدمها."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* النبذة والفلسفة */}
          <Reveal className="lg:col-span-2">
            <GlassCard className="h-full p-7 sm:p-9">
              <h3 className="text-xl font-bold text-ink">الملخّص المهني</h3>
              <p className="mt-4 text-pretty text-base leading-9 text-muted">
                {profile.summary}
              </p>

              <div className="mt-8 rounded-2xl border-s-2 border-accent bg-accent/5 p-5">
                <Quote
                  className="mb-2 h-5 w-5 text-accent"
                  aria-hidden="true"
                />
                <p className="text-pretty text-sm leading-8 text-muted sm:text-base">
                  {profile.philosophy}
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* لمحة سريعة */}
          <Reveal delay={0.1}>
            <GlassCard className="h-full p-7">
              <h3 className="text-xl font-bold text-ink">لمحة سريعة</h3>
              <dl className="mt-5 space-y-5">
                {quickFacts.map((fact) => {
                  const Icon = icons[fact.icon];
                  return (
                    <div key={fact.id} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-xs text-faint">{fact.label}</dt>
                        <dd className="text-sm font-medium leading-6 text-ink">
                          {fact.value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </GlassCard>
          </Reveal>
        </div>

        {/* المبادئ */}
        <Stagger className="mt-5 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = icons[principle.icon];
            return (
              <RevealItem key={principle.id} variants={fadeUp}>
                <GlassCard interactive className="h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl grad-cta text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-7 text-muted">
                    {principle.body}
                  </p>
                </GlassCard>
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
