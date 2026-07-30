import { Mail, MapPin, MessageCircle } from 'lucide-react';

import { navLinks, profile } from '@/lib/data';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* الهوية */}
          <div>
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl grad-cta text-sm font-bold text-white"
                aria-hidden="true"
              >
                {profile.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{profile.name}</p>
                <p className="text-xs text-faint">{profile.headline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              {profile.subtitle}
            </p>
          </div>

          {/* روابط سريعة */}
          <nav aria-label="روابط سريعة">
            <h2 className="mb-4 text-sm font-bold text-ink">روابط سريعة</h2>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* تواصل */}
          <div>
            <h2 className="mb-4 text-sm font-bold text-ink">للتواصل</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">{profile.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">{profile.phone}</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                {profile.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-center text-xs text-faint sm:flex-row sm:text-start">
          <p>
            © {year} {profile.name}. جميع الحقوق محفوظة.
          </p>
          <p>صُمِّم وبُرمِج بـ Next.js و Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
