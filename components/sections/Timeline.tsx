import { Briefcase, GraduationCap } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { timeline } from '@/lib/data';
import { fadeStart } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Timeline() {
  return (
    <section id="experience" className="scroll-mt-24 py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="المسار المهني"
          title="الخبرات والتعليم"
          description="من قاعات الجامعة إلى الأمانة العامة لمجلس الولايات، مسار يجمع بين التدريس وبناء الأنظمة وأتمتة العمليات."
        />

        <div className="relative mx-auto mt-14 max-w-3xl">
          {/* الخط الرأسي — على جهة البداية (اليمين في العربية) */}
          <span
            className="absolute bottom-4 top-4 start-[15px] w-px bg-gradient-to-b from-accent via-accent2 to-transparent"
            aria-hidden="true"
          />

          <ol className="space-y-6">
            {timeline.map((entry, index) => {
              const isEducation = entry.kind === 'education';
              const Icon = isEducation ? GraduationCap : Briefcase;

              return (
                <li key={entry.id}>
                  <Reveal variants={fadeStart} delay={index * 0.06}>
                    <div className="relative ps-12 sm:ps-14">
                      {/* النقطة */}
                      <span
                        className={cn(
                          'absolute start-0 top-3 grid h-8 w-8 place-items-center rounded-full border-2 text-white shadow-soft',
                          isEducation
                            ? 'border-amber-400/40 bg-gradient-to-bl from-amber-400 to-orange-500'
                            : 'border-accent/30 grad-cta',
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                        {entry.current ? (
                          <span className="absolute inset-0 rounded-full bg-accent/40 animate-pulse-ring" />
                        ) : null}
                      </span>

                      <GlassCard interactive className="p-6 sm:p-7">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              'rounded-lg px-2.5 py-1 text-xs font-semibold',
                              isEducation
                                ? 'bg-amber-500/10 text-amber-700'
                                : 'bg-accent/10 text-accent',
                            )}
                          >
                            {entry.period}
                          </span>
                          {entry.current ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              الوظيفة الحالية
                            </span>
                          ) : null}
                        </div>

                        <h3 className="mt-3 text-base font-bold leading-7 text-ink sm:text-lg">
                          {entry.role}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-accent">
                          {entry.org}
                        </p>

                        <ul className="mt-4 space-y-2">
                          {entry.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="flex items-start gap-2.5 text-sm leading-7 text-muted"
                            >
                              <span
                                className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-faint"
                                aria-hidden="true"
                              />
                              <span className="text-pretty">{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {entry.tags?.length ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>
                        ) : null}
                      </GlassCard>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
