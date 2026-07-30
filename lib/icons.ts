import {
  BookOpen,
  Brain,
  Briefcase,
  Clock,
  Code2,
  Database,
  Globe2,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Phone,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type { IconName } from './types';

/** سجلّ الأيقونات — يبقي ملف البيانات نصًّا خالصًا بلا JSX. */
export const icons: Record<IconName, LucideIcon> = {
  code: Code2,
  brain: Brain,
  graduation: GraduationCap,
  database: Database,
  server: Server,
  sparkles: Sparkles,
  users: Users,
  briefcase: Briefcase,
  mail: Mail,
  phone: Phone,
  map: MapPin,
  layers: Layers,
  terminal: Terminal,
  shield: Shield,
  clock: Clock,
  globe: Globe2,
  book: BookOpen,
};
