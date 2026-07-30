'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpLeft, Check, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { BrowserMockup } from '@/components/ui/BrowserMockup';
import { projectCategories, projects } from '@/lib/data';
import type { ProjectCategoryId } from '@/lib/types';
import { EASE } from '@/lib/motion';
import { cn, hexToRgbChannels } from '@/lib/utils';

type Filter = ProjectCategoryId | 'all';

export function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () =>
      filter === 'all'
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <>
      {/* ————— أزرار التصفية ————— */}
      <div
        className="mt-10 flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label="تصفية المشاريع حسب النوع"
      >
        {projectCategories.map((category) => {
          const isActive = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id as Filter)}
              aria-pressed={isActive}
              className={cn(
                'relative min-h-[44px] rounded-xl px-4 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'text-white'
                  : 'border border-line bg-surface/60 text-muted hover:border-accent/40 hover:text-accent',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-xl grad-cta"
                  transition={{ duration: 0.35, ease: EASE }}
                />
              ) : null}
              {category.label}
            </button>
          );
        })}
      </div>

      {/* ————— شبكة البطاقات ————— */}
      <motion.div layout className="mt-10 grid gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => {
            const from = hexToRgbChannels(project.accent.from);
            const to = hexToRgbChannels(project.accent.to);

            return (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease: EASE }}
                className="group relative flex flex-col overflow-hidden rounded-3xl"
                style={
                  {
                    '--p-from': from,
                    '--p-to': to,
                  } as React.CSSProperties
                }
              >
                {/* حدّ متدرّج يضيء عند المرور */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    padding: '1px',
                    background:
                      'linear-gradient(135deg, rgb(var(--p-from)), rgb(var(--p-to)))',
                    WebkitMask:
                      'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <div className="glass flex h-full flex-col rounded-3xl p-5 shadow-soft transition-transform duration-300 group-hover:-translate-y-1 sm:p-6">
                  {/* المعاينة */}
                  <div
                    className="rounded-2xl p-3"
                    style={{
                      background:
                        'linear-gradient(135deg, rgb(var(--p-from) / 0.14), rgb(var(--p-to) / 0.14))',
                    }}
                  >
                    <BrowserMockup
                      kind={project.preview}
                      url={project.url?.replace(/^https?:\/\//, '')}
                    />
                  </div>

                  {/* المحتوى */}
                  <div className="mt-5 flex flex-1 flex-col">
                    <p className="project-accent text-xs font-semibold">
                      {project.tagline}
                    </p>

                    <h3 className="mt-1.5 text-lg font-bold leading-8 text-ink sm:text-xl">
                      {project.title}
                    </h3>

                    <p className="mt-3 text-pretty text-sm leading-7 text-muted">
                      {project.description}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check
                            className="mt-1 h-4 w-4 shrink-0 text-accent"
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-7 text-muted">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>

                    {/*
                      الزر يستخدم تدرّج الموقع لا تدرّج المشروع: ذهبي برادايس
                      مع نص أبيض يعطي ٢٫١:١ فقط. هوية المشروع محفوظة في
                      المعاينة والعنوان الفرعي وحدّ البطاقة.
                    */}
                    <div className="mt-6 pt-1">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl grad-cta px-5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          عرض مباشر
                          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">
                            (يفتح في تبويب جديد)
                          </span>
                        </a>
                      ) : (
                        <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-line bg-surface/50 px-5 text-sm font-medium text-muted">
                          <Lock className="h-4 w-4" aria-hidden="true" />
                          {project.statusLabel ?? 'غير متاح للعرض العام'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
