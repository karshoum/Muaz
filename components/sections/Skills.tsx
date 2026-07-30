import { GlassCard } from '@/components/ui/GlassCard';
import { RevealItem, Stagger } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { skillGroups } from '@/lib/data';
import { icons } from '@/lib/icons';
import { fadeUp } from '@/lib/motion';
import { hexToRgbChannels } from '@/lib/utils';

export function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 bg-accent2/5 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-page">
        <SectionHeading
          eyebrow="المهارات"
          title="الأدوات التي أعمل بها وأُعلّمها"
          description="أربعة محاور تتقاطع في كل مشروع: لغة تكتب المنطق، قاعدة بيانات تحفظه، أتمتة تختصره، وطريقة تدريس تنقله للآخرين."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group) => {
            const Icon = icons[group.icon];
            const from = hexToRgbChannels(group.gradient.from);
            const to = hexToRgbChannels(group.gradient.to);

            return (
              <RevealItem key={group.id} variants={fadeUp}>
                <GlassCard interactive className="group h-full p-7">
                  {/* متغيّرات لون الفئة تُمرَّر مرة واحدة وتُستهلك في الأيقونة */}
                  <div
                    className="flex items-center gap-3"
                    style={
                      {
                        '--g-from': from,
                        '--g-to': to,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-soft"
                      style={{
                        background:
                          'linear-gradient(135deg, rgb(var(--g-from)), rgb(var(--g-to)))',
                      }}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold text-ink">{group.title}</h3>
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <span
                          className="inline-flex items-center rounded-xl border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-soft"
                          dir="auto"
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
