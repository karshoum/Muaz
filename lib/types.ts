export type IconName =
  | 'code'
  | 'brain'
  | 'graduation'
  | 'database'
  | 'server'
  | 'sparkles'
  | 'users'
  | 'briefcase'
  | 'mail'
  | 'phone'
  | 'map'
  | 'layers'
  | 'terminal'
  | 'shield'
  | 'clock'
  | 'globe'
  | 'book';

export type ProjectCategoryId =
  | 'education'
  | 'web'
  | 'content'
  | 'ai';

export interface ProjectCategory {
  id: ProjectCategoryId | 'all';
  label: string;
}

export type PreviewKind = 'abozer' | 'paradise' | 'musayria' | 'notebook';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategoryId;
  features: string[];
  stack: string[];
  /** ألوان الهوية الحقيقية للمشروع، تُستخدم في المعاينة وحدّ البطاقة */
  accent: { from: string; to: string };
  preview: PreviewKind;
  url?: string;
  /** يُعرض بدل زر «عرض مباشر» عندما لا يوجد رابط عام */
  statusLabel?: string;
}

export interface TimelineEntry {
  id: string;
  kind: 'work' | 'education';
  role: string;
  org: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tags?: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: IconName;
  /** درجات tailwind خام للتدرّج اللوني للبطاقة */
  gradient: { from: string; to: string };
  items: string[];
}

export interface Stat {
  id: string;
  value: number;
  prefix?: string;
  label: string;
  icon: IconName;
}

export interface Principle {
  id: string;
  title: string;
  body: string;
  icon: IconName;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface QuickFact {
  id: string;
  label: string;
  value: string;
  icon: IconName;
}
