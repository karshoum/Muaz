'use client';

import Link from 'next/link';
import { PriceTag } from '@/components/product/PriceTag';
import { ProductImage } from '@/components/product/ProductImage';
import { RatingStars } from '@/components/product/RatingStars';
import { WhatsAppOrderButton } from '@/components/product/WhatsAppOrderButton';
import { categoryLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product, SiteSettings } from '@/lib/data/types';

interface ProductCardProps {
  product: Product;
  settings: Pick<SiteSettings, 'whatsappNumber' | 'currency'> & { showPrices?: boolean };
  className?: string;
}

export function ProductCard({ product, settings, className }: ProductCardProps) {
  const showPrices = settings.showPrices ?? false;
  const hasDiscount =
    showPrices && typeof product.oldPrice === 'number' && product.oldPrice > product.price;

  return (
    <article
      data-testid="product-card"
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-softgray bg-white shadow-card transition-shadow hover:shadow-card-hover',
        className,
      )}
    >
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage
          image={product.images[0]}
          alt={product.name}
          className="h-full w-full"
          imgClassName="group-hover:scale-105"
        />
        <div className="absolute end-2 top-2 flex flex-col items-end gap-1.5">
          {hasDiscount && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
              خصم
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold text-cream">
              غير متوفر
            </span>
          )}
        </div>
        <span className="absolute bottom-2 start-2 rounded-full bg-navy/80 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur">
          {categoryLabel(product.category)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <Link href={`/products/${product.id}`} className="min-h-[2.6rem]">
          <h3 className="line-clamp-2-rtl text-sm font-bold leading-relaxed text-navy transition-colors group-hover:text-gold-600 sm:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2">
          <RatingStars value={product.rating} />
          <span className="ltr-nums rounded-md bg-softgray/70 px-2 py-0.5 text-[11px] font-semibold text-navy-300">
            {product.code}
          </span>
        </div>

        {showPrices ? (
          <PriceTag
            price={product.price}
            oldPrice={product.oldPrice}
            currency={settings.currency}
            className="mt-auto pt-1"
          />
        ) : (
          <p className="mt-auto pt-1 text-sm font-bold text-gold-600">السعر عند الطلب</p>
        )}

        <WhatsAppOrderButton
          product={product}
          settings={settings}
          fullWidth
          size="sm"
          className="mt-1.5"
          label="اطلب عبر واتساب"
        />
      </div>
    </article>
  );
}
