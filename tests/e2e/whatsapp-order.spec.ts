import { expect, test } from '@playwright/test';

test.describe('الطلب المباشر عبر واتساب', () => {
  test('زر الطلب في بطاقة المنتج يبني رابط واتساب صحيحاً ببيانات القطعة', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');

    // نلتقط الرابط بدل فتح واتساب فعلياً
    await page.evaluate(() => {
      (window as unknown as { __openedUrl?: string }).__openedUrl = undefined;
      window.open = (url?: string | URL) => {
        (window as unknown as { __openedUrl?: string }).__openedUrl = String(url);
        return null;
      };
    });

    const card = page.getByTestId('product-card').first();
    const productName = (await card.locator('h3').innerText()).trim();
    const code = (await card.locator('span.ltr-nums').first().innerText()).trim();

    await card.getByTestId('whatsapp-order-button').click();

    const openedUrl = await page.waitForFunction(
      () => (window as unknown as { __openedUrl?: string }).__openedUrl,
      undefined,
      { timeout: 10_000 },
    );
    const url = new URL(String(await openedUrl.jsonValue()));

    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toMatch(/^\/\d{10,15}$/);

    const message = url.searchParams.get('text') ?? '';
    expect(message).toContain(productName);
    expect(message).toContain(code);
    expect(message).toContain('السعر');
  });

  test('يظهر إشعار بنسخ بيانات القطعة عند الطلب', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.evaluate(() => {
      window.open = () => null;
    });

    await page.getByTestId('product-card').first().getByTestId('whatsapp-order-button').click();
    await expect(page.getByTestId('toast').first()).toBeVisible();
  });

  test('صفحة تفاصيل القطعة تعرض الكود والسعر وزر الطلب', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.getByTestId('product-card').first().locator('a').first().click();

    // نقصر التحقق على تفاصيل القطعة نفسها دون بطاقات "قطع مشابهة"
    await expect(page.getByText(/كود القطعة:/)).toBeVisible();
    await expect(page.getByTestId('price').first()).toBeVisible();
    await expect(page.getByTestId('whatsapp-order-button').first()).toBeVisible();
  });

  test('البحث والتصفية بالقسم يعملان', async ({ page }) => {
    await page.goto('/products?category=bedrooms');
    await page.waitForSelector('[data-testid="product-card"]');

    const cards = page.getByTestId('product-card');
    await expect(cards.first()).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card.getByText('غرف نوم')).toBeVisible();
    }
  });
});
