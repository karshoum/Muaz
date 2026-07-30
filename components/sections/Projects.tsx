import { ProjectsGrid } from './ProjectsGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Projects() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-96 bg-accent/5 blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-page">
        <SectionHeading
          eyebrow="المشاريع"
          title="أنظمة تعمل فعلًا، لا نماذج أوّلية"
          description="منصات إدارية وتجارية وتاريخية بُنيت لتخدم مستخدمين حقيقيين يوميًا. كل معاينة أدناه أُعيد بناؤها بألوان المنتج الأصلي وتفاصيل واجهته."
        />

        <ProjectsGrid />
      </div>
    </section>
  );
}
