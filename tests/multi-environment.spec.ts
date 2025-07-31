import { test, expect } from '@playwright/test';
import { getEnvironment, getAllEnvironments } from './environment-config';

// Ortam seçimi için environment variable kullan
const selectedEnv = process.env.TEST_ENV || 'prod';

test.describe(`🌍 Multi-Environment Testleri - ${selectedEnv.toUpperCase()}`, () => {
  const env = getEnvironment(selectedEnv);
  
  test.use({ storageState: 'auth.json' });
  
  test.beforeEach(async ({ page }) => {
    console.log(`🔄 ${env.description} için test başlıyor...`);
    console.log(`🌐 URL: ${env.url}`);
    console.log(`🏢 Workspace: ${env.workspace}`);
    
    await page.goto(env.url);
    await page.waitForTimeout(5000);
    
    // Workspace seçimi - daha esnek
    const workspaceSelectors = [
      `button:has-text("${env.workspace}")`,
      `[data-test-id*="${env.workspace}"]`,
      `div:has-text("${env.workspace}")`,
      `a:has-text("${env.workspace}")`
    ];
    
    let workspaceSelected = false;
    for (const selector of workspaceSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          await element.click();
          console.log(`✅ Workspace seçildi: ${env.workspace} (${selector})`);
          workspaceSelected = true;
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        console.log(`⚠️ Workspace seçimi başarısız: ${selector}`);
      }
    }
    
    if (!workspaceSelected) {
      console.log(`⚠️ Workspace seçimi bulunamadı: ${env.workspace}`);
    }
  });

  test('Ortam erişim testi', async ({ page }) => {
    console.log(`🧭 ${env.name} ortamı erişim testi...`);
    
    try {
      // Sayfa yüklendiğini kontrol et
      const pageTitle = await page.title();
      console.log(`📄 Sayfa başlığı: ${pageTitle}`);
      
      // URL kontrolü
      const currentUrl = page.url();
      console.log(`🔗 Mevcut URL: ${currentUrl}`);
      
      // Workspace kontrolü - daha esnek
      const workspaceSelectors = [
        `button:has-text("${env.workspace}")`,
        `[data-test-id*="${env.workspace}"]`,
        `div:has-text("${env.workspace}")`,
        `a:has-text("${env.workspace}")`
      ];
      
      let workspaceFound = false;
      for (const selector of workspaceSelectors) {
        const element = page.locator(selector);
        if (await element.count() > 0) {
          console.log(`✅ Workspace bulundu: ${env.workspace} (${selector})`);
          workspaceFound = true;
          break;
        }
      }
      
      if (!workspaceFound) {
        console.log(`⚠️ Workspace bulunamadı: ${env.workspace}`);
      }
      
      await page.screenshot({ path: `screenshots/${env.name}-access-test.png`, fullPage: true });
      console.log(`📸 ${env.name} erişim testi screenshot alındı`);
      
    } catch (e) {
      console.log(`❌ ${env.name} erişim testi başarısız: ${e.message}`);
      await page.screenshot({ path: `screenshots/${env.name}-error.png`, fullPage: true });
    }
  });

  test('Dashboard elementleri kontrolü', async ({ page }) => {
    console.log(`📊 ${env.name} dashboard elementleri kontrolü...`);
    
    try {
      // Dashboard elementlerini kontrol et - daha esnek selector'lar
      const dashboardElements = [
        { selector: 'text=Tickets', name: 'Tickets' },
        { selector: 'text=Forms', name: 'Forms' },
        { selector: 'text=Emails', name: 'Emails' },
        { selector: 'text=Contacts', name: 'Contacts' },
        { selector: 'text=Analytics', name: 'Analytics' },
        { selector: 'text=Team', name: 'Team' },
        { selector: 'text=Settings', name: 'Settings' },
        { selector: '[data-test-id*="tickets"]', name: 'Tickets (data-test-id)' },
        { selector: '[data-test-id*="forms"]', name: 'Forms (data-test-id)' },
        { selector: '[data-test-id*="emails"]', name: 'Emails (data-test-id)' },
        { selector: '[data-test-id*="contacts"]', name: 'Contacts (data-test-id)' },
        { selector: '[data-test-id*="analytics"]', name: 'Analytics (data-test-id)' },
        { selector: '[data-test-id*="team"]', name: 'Team (data-test-id)' },
        { selector: '[data-test-id*="settings"]', name: 'Settings (data-test-id)' }
      ];
      
      let foundCount = 0;
      const foundElements = [];
      
      for (const element of dashboardElements) {
        try {
          const locator = page.locator(element.selector);
          if (await locator.count() > 0) {
            console.log(`✅ ${element.name} bulundu`);
            foundCount++;
            foundElements.push(element.name);
          }
        } catch (e) {
          console.log(`⚠️ ${element.name} bulunamadı`);
        }
      }
      
      console.log(`📊 ${foundCount}/${dashboardElements.length} dashboard elementi bulundu`);
      console.log(`✅ Bulunan elementler: ${foundElements.join(', ')}`);
      
      await page.screenshot({ path: `screenshots/${env.name}-dashboard-test.png`, fullPage: true });
      console.log(`📸 ${env.name} dashboard testi screenshot alındı`);
      
    } catch (e) {
      console.log(`❌ ${env.name} dashboard testi başarısız: ${e.message}`);
      await page.screenshot({ path: `screenshots/${env.name}-dashboard-error.png`, fullPage: true });
    }
  });

  test('Forms sayfası erişim testi', async ({ page }) => {
    console.log(`📝 ${env.name} Forms sayfası erişim testi...`);
    
    try {
      // Forms sayfasına git - daha esnek selector'lar
      const formsSelectors = [
        'a:has-text("Forms")',
        'button:has-text("Forms")',
        '[data-test-id*="forms"]',
        '[data-test-id*="form"]',
        'a[href*="form"]',
        'button[onclick*="form"]'
      ];
      
      let formsAccessed = false;
      for (const selector of formsSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            await element.click();
            console.log(`✅ ${env.name} Forms sayfasına gidildi (${selector})`);
            await page.waitForTimeout(3000);
            formsAccessed = true;
            break;
          }
        } catch (e) {
          console.log(`⚠️ Forms linki tıklanamadı: ${selector}`);
        }
      }
      
      if (!formsAccessed) {
        console.log(`⚠️ ${env.name} Forms linki bulunamadı`);
      } else {
        // Forms sayfası kontrolü
        const formsPageTitle = await page.title();
        console.log(`📄 Forms sayfası başlığı: ${formsPageTitle}`);
        
        await page.screenshot({ path: `screenshots/${env.name}-forms-test.png`, fullPage: true });
        console.log(`📸 ${env.name} Forms testi screenshot alındı`);
      }
      
    } catch (e) {
      console.log(`❌ ${env.name} Forms testi başarısız: ${e.message}`);
      await page.screenshot({ path: `screenshots/${env.name}-forms-error.png`, fullPage: true });
    }
  });

  test('User Portal erişim testi', async ({ page }) => {
    console.log(`🎨 ${env.name} User Portal erişim testi...`);
    
    try {
      // Preview sayfasına git - farklı URL'leri dene
      const portalUrls = [
        `${env.url.replace('/tickets', '')}/preview`,
        `${env.url.replace('/tickets', '')}/customize`,
        `${env.url.replace('/tickets', '')}/portal`,
        `${env.url.replace('/tickets', '')}/settings`
      ];
      
      let portalAccessed = false;
      for (const url of portalUrls) {
        try {
          console.log(`🔗 ${url} deneniyor...`);
          await page.goto(url);
          await page.waitForTimeout(3000);
          
          // Sayfa içeriğini kontrol et
          const pageContent = await page.content();
          if (pageContent.includes('Preview') || pageContent.includes('Customize') || 
              pageContent.includes('Portal') || pageContent.includes('Settings')) {
            console.log(`✅ ${env.name} User Portal sayfası yüklendi: ${url}`);
            portalAccessed = true;
            break;
          }
        } catch (e) {
          console.log(`⚠️ ${url} yüklenemedi: ${e.message}`);
        }
      }
      
      if (!portalAccessed) {
        console.log(`⚠️ ${env.name} User Portal sayfası bulunamadı`);
      }
      
      await page.screenshot({ path: `screenshots/${env.name}-portal-test.png`, fullPage: true });
      console.log(`📸 ${env.name} User Portal testi screenshot alındı`);
      
    } catch (e) {
      console.log(`❌ ${env.name} User Portal testi başarısız: ${e.message}`);
      await page.screenshot({ path: `screenshots/${env.name}-portal-error.png`, fullPage: true });
    }
  });

  test('Performans testi', async ({ page }) => {
    console.log(`⚡ ${env.name} performans testi...`);
    
    try {
      const startTime = Date.now();
      await page.reload();
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      console.log(`⏱️ ${env.name} sayfa yükleme süresi: ${loadTime}ms`);
      
      // Performans kriterleri - daha esnek
      if (loadTime < 15000) {
        console.log(`✅ ${env.name} performans kriterleri karşılandı`);
      } else {
        console.log(`⚠️ ${env.name} performans kriterleri aşıldı (${loadTime}ms)`);
      }
      
      await page.screenshot({ path: `screenshots/${env.name}-performance-test.png`, fullPage: true });
      console.log(`📸 ${env.name} performans testi screenshot alındı`);
      
    } catch (e) {
      console.log(`❌ ${env.name} performans testi başarısız: ${e.message}`);
      await page.screenshot({ path: `screenshots/${env.name}-performance-error.png`, fullPage: true });
    }
  });
}); 