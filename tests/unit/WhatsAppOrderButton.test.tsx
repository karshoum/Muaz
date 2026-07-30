import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WhatsAppOrderButton } from '@/components/product/WhatsAppOrderButton';
import type { Product } from '@/lib/data/types';

const product: Product = {
  id: 'p-1',
  code: 'ALR-DN-5044',
  name: 'طاولة طعام رخامية',
  description: 'طاولة فاخرة',
  price: 960000,
  oldPrice: null,
  category: 'dining',
  images: [],
  rating: 5,
  featured: false,
  published: true,
  inStock: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const settings = { whatsappNumber: '0912345678', currency: 'ج.س' };

let writeText: ReturnType<typeof vi.fn>;
let openSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  openSpy = vi.fn();
  vi.stubGlobal('open', openSpy);
});

describe('WhatsAppOrderButton', () => {
  it('يعرض نص الزر واسم القطعة في وصف الوصول', () => {
    render(<WhatsAppOrderButton product={product} settings={settings} />);
    const button = screen.getByTestId('whatsapp-order-button');
    expect(button).toHaveAccessibleName(expect.stringContaining('طاولة طعام رخامية'));
  });

  it('ينسخ بيانات القطعة (الاسم والكود والسعر) عند الضغط', async () => {
    render(<WhatsAppOrderButton product={product} settings={settings} />);
    await userEvent.click(screen.getByTestId('whatsapp-order-button'));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = writeText.mock.calls[0][0] as string;
    expect(copied).toContain('طاولة طعام رخامية');
    expect(copied).toContain('ALR-DN-5044');
    expect(copied).toContain('960,000 ج.س');
  });

  it('يفتح رابط واتساب برسالة تحتوي بيانات القطعة', async () => {
    render(<WhatsAppOrderButton product={product} settings={settings} />);
    await userEvent.click(screen.getByTestId('whatsapp-order-button'));

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
    const url = new URL(openSpy.mock.calls[0][0] as string);
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe('/249912345678');

    const text = url.searchParams.get('text') ?? '';
    expect(text).toContain('طاولة طعام رخامية');
    expect(text).toContain('ALR-DN-5044');
    expect(text).toContain('960,000 ج.س');
  });

  it('يفتح واتساب في تبويب جديد بشكل آمن', async () => {
    render(<WhatsAppOrderButton product={product} settings={settings} />);
    await userEvent.click(screen.getByTestId('whatsapp-order-button'));

    await waitFor(() => expect(openSpy).toHaveBeenCalled());
    expect(openSpy.mock.calls[0][1]).toBe('_blank');
    expect(openSpy.mock.calls[0][2]).toContain('noopener');
  });

  it('يفتح واتساب حتى لو فشل نسخ البيانات', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    Object.assign(document, { execCommand: vi.fn().mockReturnValue(false) });

    render(<WhatsAppOrderButton product={product} settings={settings} />);
    await userEvent.click(screen.getByTestId('whatsapp-order-button'));

    await waitFor(() => expect(openSpy).toHaveBeenCalledTimes(1));
  });

  it('لا يفتح رابطاً معطوباً إذا لم يُضبط رقم واتساب', async () => {
    render(
      <WhatsAppOrderButton product={product} settings={{ whatsappNumber: '', currency: 'ج.س' }} />,
    );
    await userEvent.click(screen.getByTestId('whatsapp-order-button'));

    await waitFor(() => expect(openSpy).not.toHaveBeenCalled());
  });
});
