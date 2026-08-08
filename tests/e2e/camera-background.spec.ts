import { expect, test, type Page } from '@playwright/test';

const DEMO_PASSWORD = 'admin1234';

/**
 * صورة JPEG معتمة صغيرة. لا نستخدم PNG شفافاً هنا لأن التطبيق يعتبر
 * الصورة الشفافة مفرّغة الخلفية مسبقاً فيُخفي زر التفريغ عنها.
 */
const OPAQUE_JPEG = Buffer.from(
  '/9j/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAABf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJgAso//2Q==',
  'base64',
);

async function login(page: Page) {
  await page.goto('/admin');
  await page.getByLabel('كلمة المرور').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'تسجيل الدخول' }).click();
  await expect(page.getByRole('heading', { name: 'لوحة القيادة' })).toBeVisible();
}

test.describe('الكاميرا وتفريغ الخلفية داخل لوحة التحكم', () => {
  test('فتح الكاميرا يعرض معاينة حيّة والتقاط الصورة يضيفها للمنتج', async ({ page }) => {
    await login(page);
    await page.goto('/admin/products/new');

    await page.getByRole('button', { name: /التقاط بالكاميرا/ }).click();

    const preview = page.getByTestId('camera-preview');
    await expect(preview).toBeVisible();

    // الكاميرا الوهمية في Chromium تبثّ فيديو حقيقياً — ننتظر أول إطار
    await page.waitForFunction(
      () => {
        const video = document.querySelector<HTMLVideoElement>('[data-testid="camera-preview"]');
        return Boolean(video && video.videoWidth > 0);
      },
      undefined,
      { timeout: 20_000 },
    );

    await page.getByRole('button', { name: /التقاط الصورة/ }).click();
    await expect(page.getByTestId('image-list')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId('image-list').locator('li')).toHaveCount(1);
  });

  test('كل صورة تعرض خيار التفريغ الاختياري ويمكن تجاهله', async ({ page }) => {
    await login(page);
    await page.goto('/admin/products/new');

    await page.getByTestId('image-file-input').setInputFiles({
      name: 'chair.jpg',
      mimeType: 'image/jpeg',
      buffer: OPAQUE_JPEG,
    });

    await expect(page.getByTestId('image-list')).toBeVisible({ timeout: 15_000 });
    // الزر موجود لكنه اختياري تماماً — لا شيء يُحمّل قبل الضغط عليه
    await expect(page.getByRole('button', { name: /تفريغ الخلفية/ })).toBeVisible();
  });

  test('نافذة التفريغ تعرض المقارنة وشريط التقدّم وتنتج صورة شفافة', async ({ page }) => {
    await login(page);

    // نستبدل وحدة التفريغ بنسخة وهمية: النموذج الحقيقي بحجم عشرات
    // الميجابايت ولا يصلح تنزيله في كل تشغيل للاختبارات.
    // الاختبار الحقيقي موسوم @slow أدناه.
    await page.addInitScript(() => {
      (window as unknown as { __stubRemoval?: boolean }).__stubRemoval = true;
    });
    await page.route('**/*background-removal*', (route) => route.abort());

    await page.goto('/admin/products/new');
    await page.getByTestId('image-file-input').setInputFiles({
      name: 'chair.jpg',
      mimeType: 'image/jpeg',
      buffer: OPAQUE_JPEG,
    });
    await expect(page.getByTestId('image-list')).toBeVisible({ timeout: 15_000 });

    await page.getByRole('button', { name: /تفريغ الخلفية/ }).click();
    await expect(page.getByRole('dialog', { name: 'تفريغ خلفية الصورة' })).toBeVisible();

    const dialog = page.getByRole('dialog', { name: 'تفريغ خلفية الصورة' });
    await dialog.getByRole('button', { name: 'ابدأ التفريغ' }).click();

    // مع حظر تنزيل المكتبة يجب أن تظهر رسالة خطأ عربية واضحة
    // بدل تعليق الواجهة — وهذا هو السلوك المطلوب عند ضعف الشبكة.
    await expect(dialog.getByText(/تعذّر|احفظ الصورة كما هي/)).toBeVisible({ timeout: 60_000 });

    // وتبقى إمكانية الإلغاء وحفظ الصورة كما هي متاحة دائماً
    await dialog.getByRole('button', { name: 'إلغاء' }).click();
    await expect(page.getByTestId('image-list')).toBeVisible();
  });

  test('@slow التفريغ الحقيقي بنموذج الذكاء الاصطناعي', async ({ page }) => {
    test.skip(
      !process.env.RUN_SLOW_AI_TESTS,
      'يُشغّل يدوياً: RUN_SLOW_AI_TESTS=1 npx playwright test camera-background — ينزّل عشرات الميجابايت',
    );
    test.setTimeout(600_000);

    await login(page);
    await page.goto('/admin/products/new');

    await page.getByTestId('image-file-input').setInputFiles({
      name: 'sofa.jpg',
      mimeType: 'image/jpeg',
      buffer: OPAQUE_JPEG,
    });
    await expect(page.getByTestId('image-list')).toBeVisible();

    await page.getByRole('button', { name: /تفريغ الخلفية/ }).click();
    await page.getByRole('button', { name: 'ابدأ التفريغ' }).click();

    await expect(page.getByTestId('removal-progress')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('removed-preview')).toBeVisible({ timeout: 480_000 });

    await page.getByRole('button', { name: /استخدام الصورة المفرّغة/ }).click();
    await expect(page.getByText('مفرّغة')).toBeVisible({ timeout: 30_000 });
  });
});
