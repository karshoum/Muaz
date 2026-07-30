import { expect, test, type Page } from '@playwright/test';

const DEMO_PASSWORD = 'admin1234';

/** صورة PNG صغيرة صالحة يستطيع المتصفح فك ترميزها فعلياً */
const PNG_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

async function login(page: Page) {
  await page.goto('/admin');
  await page.getByLabel('كلمة المرور').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  await expect(page.getByRole('heading', { name: 'لوحة القيادة' })).toBeVisible();
}

test.describe('لوحة تحكم المدير', () => {
  test('لوحة التحكم محمية بشاشة دخول', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'لوحة تحكم المدير' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'لوحة القيادة' })).toBeHidden();
  });

  test('كلمة مرور خاطئة تُرفض برسالة عربية', async ({ page }) => {
    await page.goto('/admin');
    await page.getByLabel('كلمة المرور').fill('كلمة-خاطئة');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
    // نتجاهل معلن المسارات الخفي في Next الذي يحمل role="alert" أيضاً
    await expect(page.locator('p[role="alert"]')).toContainText('كلمة المرور غير صحيحة');
  });

  test('تسجيل الدخول يفتح لوحة القيادة', async ({ page }) => {
    await login(page);
  });

  test('إضافة قطعة بصورة من الملفات وحفظها بدون تفريغ خلفية', async ({ page }) => {
    await login(page);
    await page.goto('/admin/products/new');

    await page.getByLabel('اسم القطعة').fill('قطعة اختبار آلي');
    await page.getByLabel('السعر (بالجنيه السوداني)').fill('123456');

    // رفع صورة من "معرض الجهاز"
    await page.getByTestId('image-file-input').setInputFiles({
      name: 'sofa.png',
      mimeType: 'image/png',
      buffer: PNG_PIXEL,
    });
    await expect(page.getByTestId('image-list')).toBeVisible({ timeout: 15_000 });

    // مؤشر أن وحدة تفريغ الخلفية لم تُحمّل إطلاقاً في هذا المسار
    const removalRequests: string[] = [];
    page.on('request', (request) => {
      if (/background-removal|onnxruntime|\.onnx/i.test(request.url())) {
        removalRequests.push(request.url());
      }
    });

    await page.getByRole('button', { name: 'إضافة القطعة' }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
    // القائمة تُعرض كجدول على سطح المكتب وكبطاقات على الجوال — نأخذ الظاهر منهما
    await expect(
      page.getByText('قطعة اختبار آلي').filter({ visible: true }).first(),
    ).toBeVisible();

    expect(removalRequests, 'الحفظ بدون تفريغ يجب ألا ينزّل نموذج الذكاء الاصطناعي').toHaveLength(0);
  });

  test('القطعة المضافة تظهر للعملاء في المعرض', async ({ page }) => {
    await login(page);
    await page.goto('/admin/products/new');
    await page.getByLabel('اسم القطعة').fill('كرسي يظهر للعملاء');
    await page.getByLabel('السعر (بالجنيه السوداني)').fill('99000');
    await page.getByRole('button', { name: 'إضافة القطعة' }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);

    await page.goto('/products?q=كرسي يظهر للعملاء');
    await expect(page.getByText('كرسي يظهر للعملاء').first()).toBeVisible();
  });

  test('تعديل رقم واتساب من الإعدادات ينعكس على أزرار الطلب', async ({ page }) => {
    await login(page);
    await page.goto('/admin/settings');

    await page.getByLabel('رقم واتساب الطلبات (أساسي)').fill('0999111222');
    await page.getByRole('button', { name: 'حفظ الإعدادات' }).click();
    await expect(page.getByTestId('toast').first()).toBeVisible();

    await page.goto('/products');
    await page.waitForSelector('[data-testid="product-card"]');
    await page.evaluate(() => {
      (window as unknown as { __openedUrl?: string }).__openedUrl = undefined;
      window.open = (url?: string | URL) => {
        (window as unknown as { __openedUrl?: string }).__openedUrl = String(url);
        return null;
      };
    });

    await page.getByTestId('product-card').first().getByTestId('whatsapp-order-button').click();
    const opened = await page.waitForFunction(
      () => (window as unknown as { __openedUrl?: string }).__openedUrl,
    );
    expect(String(await opened.jsonValue())).toContain('wa.me/249999111222');
  });

  test('يمكن حذف البيانات التجريبية دفعة واحدة', async ({ page }) => {
    await login(page);
    await page.goto('/admin/products');

    const cleanupButton = page.getByRole('button', { name: /مسح البيانات التجريبية/ });
    await expect(cleanupButton).toBeVisible();
    await cleanupButton.click();
    await page.getByRole('button', { name: 'نعم، امسحها' }).click();

    await expect(cleanupButton).toBeHidden({ timeout: 15_000 });
  });
});
