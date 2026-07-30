'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProductImage as ProductImageType } from '@/lib/data/types';

const FALLBACK = '/images/placeholder.svg';

interface ProductImageProps {
  image?: ProductImageType | null;
  alt: string;
  className?: string;
  imgClassName?: string;
}

/**
 * صورة المنتج مع خلفية شبكية للصور المفرّغة (لإبراز الشفافية)
 * وصورة بديلة أنيقة عند الفشل أو غياب الصورة.
 */
export function ProductImage({ image, alt, className, imgClassName }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const src = !image || failed ? FALLBACK : image.url;
  const transparent = Boolean(image?.backgroundRemoved) && !failed;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-softgray/40',
        transparent && 'checkerboard',
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover transition-transform duration-500', imgClassName)}
      />
    </div>
  );
}
