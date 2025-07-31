import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // Server ortamında daha fazla retry
  workers: process.env.CI ? 2 : undefined, // Server ortamında daha az worker
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list'] // Console'da detaylı rapor
  ],
  use: {
    baseURL: 'https://admin.hipporello.com/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000, // Server ortamında daha uzun timeout
    navigationTimeout: 20000, // Server ortamında daha uzun timeout
    // Server ortamı için ek ayarlar
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    // Headless mod (server ortamı için)
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Server ortamı için ek ayarlar
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
    },
    // Server ortamında sadece chromium kullan (performans için)
    // Diğer browser'lar kaldırıldı - sadece desktop testleri
  ],
  outputDir: 'test-results/',
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
  // Server ortamı için ek ayarlar
  timeout: 60000, // Test timeout'u 60 saniye
  expect: {
    timeout: 10000, // Expect timeout'u 10 saniye
  },
  // Test grupları için tag'ler
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : undefined,
}); 