import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * مسار متصفح جاهز على الجهاز، لتفادي تنزيل متصفح جديد.
 * اتركه فارغاً ليستخدم Playwright متصفحه الافتراضي (npx playwright install).
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : [['list']],
  timeout: 60_000,

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'ar-SD',
    // كاميرا وهمية حتى تعمل اختبارات التصوير بلا جهاز حقيقي
    launchOptions: {
      executablePath,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--autoplay-policy=no-user-gesture-required',
      ],
    },
    permissions: ['camera'],
  },

  projects: [
    {
      name: 'الجوال',
      use: { ...devices['Pixel 5'] },
    },
    {
      // مقاس لوحي على Chromium (iPad Mini في Playwright يعمل بمحرك WebKit،
      // ونكتفي بمحرك واحد حتى تعمل الاختبارات بلا تنزيل متصفحات إضافية)
      name: 'اللوحي',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        isMobile: false,
        hasTouch: true,
      },
    },
    {
      name: 'سطح المكتب',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
