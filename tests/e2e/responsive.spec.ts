import { expect, test } from '@playwright/test';

const PAGES = ['/', '/products', '/about', '/services', '/contact'];

/** لا يجوز أن تتمدد أي صفحة أفقياً خارج عرض الشاشة على أي مقاس */
async function expectNoHorizontalScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  // نسمح بفارق بكسل واحد لتقريبات المتصفح
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe('تجاوب الواجهات مع مقاسات الشاشات', () => {
  for (const path of PAGES) {
    test(`لا يوجد تمرير أفقي في ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expectNoHorizontalScroll(page);
    });
  }

  test('الصفحة عربية وباتجاه من اليمين لليسار', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
  });

  test('البانر الرئيسي وشبكة الأقسام يظهران على كل المقاسات', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero-slider')).toBeVisible();
    await expect(page.getByTestId('category-grid')).toBeVisible();
  });

  test('زر واتساب العائم متاح للعميل', async ({ page }) => {
    await page.goto('/');
    const floating = page.getByTestId('floating-whatsapp');
    await expect(floating).toBeVisible();
    await expect(floating).toHaveAttribute('href', /wa\.me\/\d+/);
  });

  test('أهداف اللمس في القائمة كبيرة بما يكفي للجوال', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'الجوال', 'خاص بالجوال');
    await page.goto('/');
    const menuButton = page.getByRole('button', { name: 'القائمة' });
    const box = await menuButton.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });

  test('قائمة الجوال تُفتح وتعرض الأقسام', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'سطح المكتب', 'القائمة المنسدلة للجوال واللوحي فقط');
    await page.goto('/');
    await page.getByRole('button', { name: 'القائمة' }).click();
    await expect(page.getByTestId('mobile-menu')).toBeVisible();
    await expect(page.getByTestId('mobile-menu').getByText('غرف نوم')).toBeVisible();
  });
});
