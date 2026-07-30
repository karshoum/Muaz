'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { HERO_SLIDES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const INTERVAL = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="container-page pt-4 sm:pt-6"
      aria-roledescription="carousel"
      aria-label="عروض المعرض"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-navy shadow-card"
        data-testid="hero-slider"
      >
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            className={cn(
              'transition-opacity duration-700',
              i === index ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0',
            )}
            aria-hidden={i !== index}
          >
            <div className="relative h-[260px] w-full sm:h-[360px] lg:h-[440px]">
              <img
                src={slide.image}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/45 to-navy/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5 text-center">
                <h1 className="max-w-2xl text-2xl font-extrabold leading-snug text-cream drop-shadow-sm sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="max-w-xl text-sm text-cream/85 sm:text-base">{slide.subtitle}</p>
                <Link
                  href={slide.href}
                  className="mt-1 rounded-lg bg-gold px-7 py-3 text-sm font-bold text-navy transition-colors hover:bg-gold-400 sm:text-base"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* أزرار التنقل */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="الشريحة السابقة"
          className="absolute end-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-navy transition-colors hover:bg-gold sm:flex"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="الشريحة التالية"
          className="absolute start-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-navy transition-colors hover:bg-gold sm:flex"
        >
          ‹
        </button>

        {/* المؤشرات */}
        <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => go(i)}
              aria-label={`الانتقال إلى الشريحة ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'h-2.5 rounded-full transition-all',
                i === index ? 'w-7 bg-gold' : 'w-2.5 bg-cream/60 hover:bg-cream',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
