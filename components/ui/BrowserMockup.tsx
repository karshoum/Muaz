import type { ReactElement, ReactNode } from 'react';

import type { PreviewKind } from '@/lib/types';

/* ————————————————————————————————————————————————————————————
   إطار متصفح + واجهات مصغّرة مرسومة بالكامل بـ CSS.
   لا صور خارجية ولا لقطات شاشة: كل معاينة أعيد بناؤها بألوان
   المشروع الحقيقية، فتبقى حادّة في أي دقة وبصفر طلبات شبكة.
   ———————————————————————————————————————————————————————————— */

function Frame({ url, children }: { url?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-soft">
      {/* شريط المتصفح */}
      <div className="flex items-center gap-2 border-b border-line/80 bg-bg/80 px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        </div>
        <div
          className="mx-auto max-w-[70%] truncate rounded-md bg-line/50 px-3 py-0.5 text-[10px] text-faint"
          dir="ltr"
        >
          {url ?? 'localhost'}
        </div>
      </div>
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ————————————————— ١. منصة د. أبوذر الكودة ————————————————— */

const abozerRoles = [
  { label: 'طالب', tint: '#E8EEFF' },
  { label: 'معلم', tint: '#EAF2FF' },
  { label: 'مشرف الفصل', tint: '#EDE9FE' },
  { label: 'منسق الجداول', tint: '#FEF3C7' },
  { label: 'مدير الفرع', tint: '#DCFCE7' },
  { label: 'وكيل', tint: '#FEE2E2' },
  { label: 'محاسب', tint: '#E0F2FE' },
  { label: 'المدير الإداري', tint: '#F1F5F9' },
];

function AbozerPreview() {
  return (
    <div className="absolute inset-0 bg-[#F4F7FC]">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="rounded border border-[#CBD5E1] px-1.5 py-0.5 text-[7px] font-semibold text-[#2B2E83]">
            EN
          </span>
          <span className="rounded border border-[#CBD5E1] px-1.5 py-0.5 text-[7px]">
            🌙
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-end">
            <p className="text-[8px] font-bold leading-tight text-[#1E293B]">
              مؤسسة د. أبوذر الكودة التعليمية
            </p>
            <p className="text-[6px] leading-tight text-[#2B2E83]">الوضع التجريبي</p>
          </div>
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2B2E83] text-[7px] text-white">
            ✦
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-2.5">
        {abozerRoles.map((role) => (
          <div
            key={role.label}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5"
          >
            <span
              className="h-4 w-4 shrink-0 rounded-md"
              style={{ backgroundColor: role.tint }}
            />
            <span className="truncate text-[7.5px] font-semibold text-[#334155]">
              {role.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ————————————————— ٢. وكالة برادايس ————————————————— */

function ParadisePreview() {
  return (
    <div className="absolute inset-0 bg-[#FAF7F0]">
      <div className="flex items-center justify-between bg-[#0F2A43] px-3 py-2">
        <span className="rounded bg-[#C9A227] px-1.5 py-0.5 text-[6.5px] font-semibold text-[#0F2A43]">
          لوحة التحكم
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-white">وكالة برادايس</span>
          <span className="grid h-4 w-4 place-items-center rounded bg-[#C9A227] text-[6px]">
            ✈
          </span>
        </div>
      </div>

      <div className="p-2.5">
        <p className="mb-1.5 text-end text-[9px] font-bold text-[#0F2A43]">
          ✈ تذاكر طيران
        </p>

        <div className="rounded-xl border border-[#EADFC8] bg-white p-2">
          <div className="mb-1.5 flex justify-end gap-1">
            <span className="rounded-full border border-[#0F2A43]/25 px-2 py-0.5 text-[6.5px] text-[#0F2A43]">
              ذهاب وعودة
            </span>
            <span className="rounded-full bg-[#0F2A43] px-2 py-0.5 text-[6.5px] text-white">
              ذهاب فقط
            </span>
          </div>

          {['مدينة الإقلاع', 'مدينة الوصول', 'تاريخ الذهاب'].map((label) => (
            <div key={label} className="mb-1">
              <p className="text-end text-[6px] text-[#64748B]">{label}</p>
              <div className="h-3 rounded-md border border-[#E7EBF0] bg-[#FBFCFE]" />
            </div>
          ))}

          <div className="mb-1 grid grid-cols-3 gap-1">
            {['بالغين', 'أطفال', 'رضّع'].map((label) => (
              <div key={label}>
                <p className="text-end text-[5.5px] text-[#64748B]">{label}</p>
                <div className="h-3 rounded-md border border-[#E7EBF0] bg-[#FBFCFE]" />
              </div>
            ))}
          </div>

          <div className="grid h-4 place-items-center rounded-md bg-[#8494A5] text-[6.5px] font-semibold text-white">
            ابحث الآن
          </div>
        </div>

        {/* شريط الخدمات الأخرى — يملأ الصفحة كما تبدو فعلًا */}
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {['حجوزات فنادق', 'تأشيرات', 'باقات سياحية'].map((service) => (
            <div
              key={service}
              className="grid h-5 place-items-center rounded-md border border-[#EADFC8] bg-white text-[6px] text-[#0F2A43]"
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ————————————————— ٣. اتحاد المسيرية الزرق ————————————————— */

function MusayriaPreview() {
  return (
    <div className="absolute inset-0 bg-[#FBFAF7]">
      <div className="flex items-center justify-between bg-[#13293D] px-3 py-2">
        <span className="text-[7px] text-white">☰ القائمة</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-bold text-white">
            اتحاد المسيرية الزرق
          </span>
          <span className="grid h-4 w-4 place-items-center rounded-full border border-[#B8873B] bg-white text-[6px] text-[#13293D]">
            ⚑
          </span>
        </div>
      </div>

      <div className="p-2.5">
        <div className="flex items-start justify-between">
          <span className="rounded-md bg-[#B8873B] px-2 py-0.5 text-[6.5px] font-semibold text-white">
            + منشور جديد
          </span>
          <div className="text-end">
            <p className="text-[10px] font-bold leading-tight text-[#13293D]">
              المنشورات
            </p>
            <p className="text-[6px] leading-tight text-[#7A8794]">
              قرارات الاتحاد ومنصة نقاش الأعضاء
            </p>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-[#EAE3D6] bg-white p-2">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[7.5px] font-bold text-[#13293D]">
              محمد كرشوم حسن
            </span>
            <span className="h-4 w-4 rounded-full bg-[#D8C7A8]" />
          </div>

          <div className="mt-1 flex justify-end gap-1">
            <span className="rounded-full bg-[#DCEBDC] px-1.5 py-0.5 text-[5.5px] text-[#3F6B45]">
              معتمد
            </span>
            <span className="rounded-full bg-[#F0E4CC] px-1.5 py-0.5 text-[5.5px] text-[#8A6A2F]">
              منشور عضو
            </span>
          </div>

          <p className="mt-1 text-end text-[7px] font-bold text-[#13293D]">
            نشأة وتطور الإدارة الأهلية لدى المسيرية الزرق
          </p>

          <div className="mt-1 space-y-[3px]">
            <div className="ms-auto h-[3px] w-full rounded bg-[#EEE9E0]" />
            <div className="ms-auto h-[3px] w-[92%] rounded bg-[#EEE9E0]" />
            <div className="ms-auto h-[3px] w-[78%] rounded bg-[#EEE9E0]" />
            <div className="ms-auto h-[3px] w-[86%] rounded bg-[#EEE9E0]" />
          </div>
        </div>

        {/* منشور ثانٍ مختصر — يملأ الصفحة كما تبدو فعلًا */}
        <div className="mt-1.5 rounded-xl border border-[#EAE3D6] bg-white p-2">
          <div className="flex items-center justify-end gap-1.5">
            <span className="text-[7px] font-bold text-[#13293D]">
              عمر سليمان آدم
            </span>
            <span className="h-3.5 w-3.5 rounded-full bg-[#C9D6DF]" />
          </div>
          <p className="mt-1 text-end text-[6.5px] font-semibold text-[#13293D]">
            تعقيب وتصحيحات تاريخية على المقال
          </p>
          <div className="mt-1 space-y-[3px]">
            <div className="ms-auto h-[3px] w-[95%] rounded bg-[#EEE9E0]" />
            <div className="ms-auto h-[3px] w-[70%] rounded bg-[#EEE9E0]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ————————————————— ٤. أدوات الأتمتة والذكاء الاصطناعي ————————————————— */

const bars = [38, 62, 45, 78, 55, 90, 68];

function NotebookPreview() {
  return (
    <div className="absolute inset-0 bg-[#0B1020]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="text-[6.5px] text-[#7C3AED]">Python 3 · Colab</span>
        <span className="font-mono text-[7px] text-[#94A3B8]" dir="ltr">
          research_automation.ipynb
        </span>
      </div>

      <div className="space-y-1.5 p-2.5">
        <div className="rounded-lg border border-white/10 bg-[#131A2E] p-2">
          <pre
            className="overflow-hidden font-mono text-[6.5px] leading-[1.7]"
            dir="ltr"
          >
            <code>
              <span className="text-[#C084FC]">import</span>{' '}
              <span className="text-[#7DD3FC]">pandas</span>{' '}
              <span className="text-[#C084FC]">as</span>{' '}
              <span className="text-[#7DD3FC]">pd</span>
              {'\n'}
              <span className="text-[#C084FC]">from</span>{' '}
              <span className="text-[#7DD3FC]">llm</span>{' '}
              <span className="text-[#C084FC]">import</span>{' '}
              <span className="text-[#FBBF24]">summarize_batch</span>
              {'\n\n'}
              <span className="text-[#64748B]"># تلخيص ٢٤٠٠ مرجعًا دفعة واحدة</span>
              {'\n'}
              <span className="text-[#E2E8F0]">df = pd.read_csv(</span>
              <span className="text-[#86EFAC]">&quot;refs.csv&quot;</span>
              <span className="text-[#E2E8F0]">)</span>
              {'\n'}
              <span className="text-[#E2E8F0]">out = </span>
              <span className="text-[#FBBF24]">summarize_batch</span>
              <span className="text-[#E2E8F0]">(df, lang=</span>
              <span className="text-[#86EFAC]">&quot;ar&quot;</span>
              <span className="text-[#E2E8F0]">)</span>
            </code>
          </pre>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#0F1526] p-2">
          <p className="mb-1 text-[6px] text-[#4ADE80]" dir="ltr">
            ✓ 2400 rows processed in 41s
          </p>
          <div className="flex h-8 items-end gap-1">
            {bars.map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-[2px]"
                style={{
                  height: `${height}%`,
                  background:
                    'linear-gradient(to top, #7C3AED, #06B6D4)',
                }}
              />
            ))}
          </div>
        </div>

        {/* خلية ثانية — تُظهر الدفتر ممتلئًا كما هو في الاستخدام الحقيقي */}
        <div className="rounded-lg border border-white/10 bg-[#131A2E] p-2">
          <pre className="font-mono text-[6.5px] leading-[1.7]" dir="ltr">
            <code>
              <span className="text-[#E2E8F0]">out.</span>
              <span className="text-[#FBBF24]">to_excel</span>
              <span className="text-[#E2E8F0]">(</span>
              <span className="text-[#86EFAC]">&quot;summary_ar.xlsx&quot;</span>
              <span className="text-[#E2E8F0]">)</span>
            </code>
          </pre>
          <p className="mt-1 text-[6px] text-[#94A3B8]" dir="ltr">
            saved · 2400 summaries · 1.8 MB
          </p>
        </div>
      </div>
    </div>
  );
}

/* ————————————————— المُوزِّع ————————————————— */

const previews: Record<PreviewKind, () => ReactElement> = {
  abozer: AbozerPreview,
  paradise: ParadisePreview,
  musayria: MusayriaPreview,
  notebook: NotebookPreview,
};

export function BrowserMockup({
  kind,
  url,
}: {
  kind: PreviewKind;
  url?: string;
}) {
  const Preview = previews[kind];

  return (
    <Frame url={url}>
      <Preview />
    </Frame>
  );
}
