'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  buildCopyText,
  buildOrderMessage,
  buildWhatsAppUrl,
  copyToClipboard,
  isValidWhatsAppNumber,
} from '@/lib/whatsapp';
import { absoluteUrl } from '@/lib/utils';
import type { Product, SiteSettings } from '@/lib/data/types';

interface WhatsAppOrderButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  product: Product;
  settings: Pick<SiteSettings, 'whatsappNumber' | 'currency'> & { showPrices?: boolean };
  label?: string;
}

/**
 * زر الطلب المباشر عبر واتساب.
 *
 * عند الضغط:
 *   1. يُنسخ اسم القطعة والكود والسعر إلى حافظة العميل.
 *   2. يُفتح واتساب برسالة منسّقة تلقائياً تحوي بيانات القطعة.
 *
 * فشل النسخ لا يمنع فتح واتساب إطلاقاً.
 */
export function WhatsAppOrderButton({
  product,
  settings,
  label = 'اطلب عبر واتساب',
  ...buttonProps
}: WhatsAppOrderButtonProps) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const numberValid = isValidWhatsAppNumber(settings.whatsappNumber);

  const handleOrder = async () => {
    if (!numberValid) {
      toast('لم يُضبط رقم واتساب للطلبات بعد. أضِفه من لوحة التحكم.', 'error');
      return;
    }

    setBusy(true);
    try {
      const productUrl = absoluteUrl(`/products/${product.id}`);
      const copied = await copyToClipboard(
        buildCopyText(product, settings.currency, settings.showPrices),
      );
      const message = buildOrderMessage(product, {
        productUrl,
        currency: settings.currency,
        showPrices: settings.showPrices,
      });
      const url = buildWhatsAppUrl(settings.whatsappNumber, message);

      toast(
        copied
          ? 'تم نسخ بيانات القطعة، وجاري فتح واتساب...'
          : 'جاري فتح واتساب برسالة الطلب...',
      );

      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="whatsapp"
      onClick={handleOrder}
      loading={busy}
      data-testid="whatsapp-order-button"
      aria-label={`${label}: ${product.name}`}
      {...buttonProps}
    >
      {!busy && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm4.52 12.15c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.47-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.21.88 2.39 1.01 2.55.12.17 1.73 2.64 4.2 3.7.59.26 1.04.41 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
        </svg>
      )}
      {label}
    </Button>
  );
}
