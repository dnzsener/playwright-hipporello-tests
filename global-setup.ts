import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Asana ile giriş yap
  await page.goto(baseURL!);
  
  // Asana ile giriş butonuna tıkla
  const page1Promise = page.waitForEvent('popup');
  await page.locator('[data-test-id="login-with-Asana"]').click();
  const page1 = await page1Promise;
  
  // Popup sayfasının yüklendiğini bekle
  await page1.waitForLoadState();
  
  // Asana login sayfasında email gir
  await page1.getByRole('textbox', { name: 'Email address' }).click();
  await page1.getByRole('textbox', { name: 'Email address' }).fill('deniz.sener@hipporello.com');
  await page1.getByRole('button', { name: 'Continue', exact: true }).click();
  
  // Şifre alanının yüklenmesini bekle
  await page1.waitForSelector('input[name="password"], input[type="password"]', { timeout: 10000 });
  
  // Şifre gir
  await page1.getByRole('textbox', { name: 'Password' }).click();
  await page1.getByRole('textbox', { name: 'Password' }).fill('Senerler212.');
  await page1.getByRole('textbox', { name: 'Password' }).press('Enter');
  
  // Ana sayfaya dönüldüğünü bekle
  await page.waitForURL('https://admin.hipporello.com/**', { timeout: 30000 });
  
  // Workspace seçimi (eğer varsa)
  try {
    await page.waitForSelector('button:has-text("TESTMANDESKASANAPR12a")', { timeout: 5000 });
    await page.getByRole('button', { name: 'TESTMANDESKASANAPR12a' }).click();
  } catch (error) {
    console.log('Workspace seçimi bulunamadı, devam ediliyor...');
  }
  
  // Session'ı kaydet
  await page.context().storageState({ path: storageState as string });
  
  await browser.close();
}

export default globalSetup; 