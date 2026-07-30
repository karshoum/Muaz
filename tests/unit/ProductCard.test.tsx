import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/lib/data/types';

const product: Product = {
  id: 'p-9',
  code: 'ALR-WD-3015',
  name: 'دولاب ملابس حديث سحّاب',
  description: 'دولاب بأربعة أبواب',
  price: 520000,
  oldPrice: 590000,
  category: 'wardrobes',
  images: [{ id: 'i-1', url: '/images/categories/wardrobes.svg', backgroundRemoved: false }],
  rating: 5,
  featured: true,
  published: true,
  inStock: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const settings = { whatsappNumber: '0912345678', currency: 'ج.س' };

describe('ProductCard', () => {
  it('يعرض اسم القطعة وكودها', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByText('دولاب ملابس حديث سحّاب')).toBeInTheDocument();
    expect(screen.getByText('ALR-WD-3015')).toBeInTheDocument();
  });

  it('يعرض السعر بالجنيه السوداني مع السعر قبل الخصم', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByTestId('price')).toHaveTextContent('520,000 ج.س');
    expect(screen.getByTestId('old-price')).toHaveTextContent('590,000 ج.س');
  });

  it('يعرض شارة الخصم عند وجود سعر قديم أعلى', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByText('خصم')).toBeInTheDocument();
  });

  it('يعرض التقييم بشكل يمكن الوصول إليه', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByLabelText('التقييم 5 من 5')).toBeInTheDocument();
  });

  it('يعرض اسم القسم بالعربية', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByText('دواليب')).toBeInTheDocument();
  });

  it('يربط بصفحة تفاصيل القطعة', () => {
    render(<ProductCard product={product} settings={settings} />);
    const links = screen.getAllByRole('link');
    expect(links.some((link) => link.getAttribute('href') === '/products/p-9')).toBe(true);
  });

  it('يعرض زر الطلب عبر واتساب', () => {
    render(<ProductCard product={product} settings={settings} />);
    expect(screen.getByTestId('whatsapp-order-button')).toBeInTheDocument();
  });

  it('يعرض شارة "غير متوفر" للقطع الناقصة من المخزن', () => {
    render(<ProductCard product={{ ...product, inStock: false }} settings={settings} />);
    expect(screen.getByText('غير متوفر')).toBeInTheDocument();
  });

  it('لا يعرض سعراً قديماً إذا لم يكن هناك خصم', () => {
    render(<ProductCard product={{ ...product, oldPrice: null }} settings={settings} />);
    expect(screen.queryByTestId('old-price')).not.toBeInTheDocument();
  });
});
