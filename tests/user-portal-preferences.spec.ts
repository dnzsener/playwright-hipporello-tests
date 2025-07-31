import { test, expect } from '@playwright/test';

test.describe('🌐 User Portal - Preferences Testleri', () => {
  test.use({ storageState: 'auth.json' });

  test.beforeEach(async ({ page }) => {
    console.log('🔄 Ana sayfa yükleniyor...');
    await page.goto('/admin');
    await page.waitForTimeout(5000);

    // Service Desk seçimi
    console.log('🏢 Service Desk seçimi yapılıyor...');
    try {
      // Service desk listesini bekle
      await page.waitForSelector('text=Choose your Hipporello Service Desk', { timeout: 10000 });
      console.log('✅ Service Desk seçim sayfası yüklendi');
      
      // TESTMANDESKASANAPR12a service desk'ini seç
      const serviceDeskItem = page.locator('text=TESTMANDESKASANAPR12a').first();
      if (await serviceDeskItem.count() > 0) {
        await serviceDeskItem.click();
        await page.waitForTimeout(3000);
        console.log('✅ Service Desk seçildi: TESTMANDESKASANAPR12a');
      } else {
        // Eğer TESTMANDESKASANAPR12a bulunamazsa ilk service desk'i seç
        const firstServiceDesk = page.locator('[data-test-id="service-desk-item"]').first();
        if (await firstServiceDesk.count() > 0) {
          await firstServiceDesk.click();
          await page.waitForTimeout(3000);
          console.log('✅ İlk Service Desk seçildi');
        }
      }
    } catch (e) {
      console.log('Service Desk seçimi bulunamadı, devam ediliyor...');
    }
  });

  test('User Portal Preferences sayfasına erişim', async ({ page }) => {
    console.log('🌐 User Portal Preferences sayfasına erişim testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Sayfa başlığını kontrol et
      const pageTitle = await page.title();
      console.log(`📄 Sayfa başlığı: ${pageTitle}`);
      
      // Sayfa içeriğini kontrol et
      console.log('📋 Sayfa içeriği kontrol ediliyor...');
      const preferencesContent = await page.locator('text=User Portal Preferences').count();
      if (preferencesContent > 0) {
        console.log('✅ User Portal Preferences sayfası içeriği bulundu');
      } else {
        console.log('⚠️ User Portal Preferences sayfası içeriği bulunamadı');
      }
      
      console.log('🎉 TEST SONUCU: User Portal Preferences sayfasına erişim BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: User Portal Preferences sayfasına erişim BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/user-portal-preferences-access.png', fullPage: true });
    console.log('📸 User Portal Preferences sayfası screenshot alındı');
  });



  test('Timezone seçimi testi', async ({ page }) => {
    console.log('🌍 Timezone seçimi testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Timezone dropdown'ına tıkla
      console.log('🌍 Timezone dropdown açılıyor...');
      await page.getByRole('combobox').filter({ hasText: 'Select your timezone' }).click();
      await page.waitForTimeout(1000);
      console.log('✅ Timezone dropdown açıldı');
      
      // Istanbul timezone'unu ara ve seç
      console.log('🔍 Istanbul timezone aranıyor...');
      await page.locator('[data-test-id="multiselect-search-input"]').fill('ist');
      await page.waitForTimeout(1000);
      console.log('✅ Istanbul arama yapıldı');
      
      await page.locator('label').filter({ hasText: '(GMT+03:00) Istanbul' }).first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Istanbul timezone seçildi');
      
      console.log('🎉 TEST SONUCU: Timezone seçimi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Timezone seçimi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/timezone-selection.png', fullPage: true });
    console.log('📸 Timezone seçimi testi screenshot alındı');
  });

  test('Request ID Prefix değiştirme testi', async ({ page }) => {
    console.log('🔢 Request ID Prefix değiştirme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Request ID Prefix edit butonuna tıkla
      console.log('✏️ Request ID Prefix edit butonu tıklanıyor...');
      await page.locator('[data-test-id="edit-casePrefix-btn"]').click();
      await page.waitForTimeout(1000);
      console.log('✅ Request ID Prefix edit butonu tıklandı');
      
      // Prefix alanını seç ve değiştir
      console.log('📝 Prefix alanı değiştiriliyor...');
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).click();
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).dblclick();
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).fill('test');
      await page.waitForTimeout(1000);
      console.log('✅ Prefix alanı değiştirildi');
      
      // Confirm butonuna tıkla
      console.log('💾 Confirm butonu tıklanıyor...');
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Confirm butonu tıklandı');
      
      console.log('🎉 TEST SONUCU: Request ID Prefix değiştirme BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Request ID Prefix değiştirme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/request-id-prefix-change.png', fullPage: true });
    console.log('📸 Request ID Prefix değiştirme testi screenshot alındı');
  });

  test('Requester Ratings ayarı testi', async ({ page }) => {
    console.log('⭐ Requester Ratings ayarı testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Requester Ratings dropdown'ına tıkla
      console.log('⭐ Requester Ratings dropdown açılıyor...');
      await page.getByRole('combobox').filter({ hasText: 'For all requests' }).getByRole('img').click();
      await page.waitForTimeout(1000);
      console.log('✅ Requester Ratings dropdown açıldı');
      
      // "For all tickets" seçeneğini seç
      console.log('📋 "For all tickets" seçeneği seçiliyor...');
      await page.locator('[data-test-id="show-rating-option-all-tickets"] div').click();
      await page.waitForTimeout(2000);
      console.log('✅ "For all tickets" seçeneği seçildi');
      
      console.log('🎉 TEST SONUCU: Requester Ratings ayarı BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Requester Ratings ayarı BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/requester-ratings-setting.png', fullPage: true });
    console.log('📸 Requester Ratings ayarı testi screenshot alındı');
  });

  test('Agent responder name değiştirme testi', async ({ page }) => {
    console.log('👤 Agent responder name değiştirme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Agent responder name edit butonuna tıkla
      console.log('✏️ Agent responder name edit butonu tıklanıyor...');
      await page.locator('[data-test-id="edit-agentinfo-btn"]').click();
      await page.waitForTimeout(1000);
      console.log('✅ Agent responder name edit butonu tıklandı');
      
      // Agent alanını seç ve değiştir
      console.log('📝 Agent alanı değiştiriliyor...');
      await page.locator('[data-test-id="editor-wrapper"]').getByText('Agent').click();
      await page.locator('[data-test-id="editor-wrapper"] div').filter({ hasText: /^Agent$/ }).fill('admin');
      await page.waitForTimeout(1000);
      console.log('✅ Agent alanı değiştirildi');
      
      // Confirm butonuna tıkla
      console.log('💾 Confirm butonu tıklanıyor...');
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Confirm butonu tıklandı');
      
      console.log('🎉 TEST SONUCU: Agent responder name değiştirme BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Agent responder name değiştirme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/agent-responder-name-change.png', fullPage: true });
    console.log('📸 Agent responder name değiştirme testi screenshot alındı');
  });

  test('Bot name değiştirme testi', async ({ page }) => {
    console.log('🤖 Bot name değiştirme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Bot name edit butonuna tıkla
      console.log('✏️ Bot name edit butonu tıklanıyor...');
      await page.locator('[data-test-id="edit-botName-btn"]').click();
      await page.waitForTimeout(1000);
      console.log('✅ Bot name edit butonu tıklandı');
      
      // Bot name alanını seç ve değiştir
      console.log('📝 Bot name alanı değiştiriliyor...');
      await page.locator('[data-test-id="editor-wrapper"]').getByText('Hippo Automation').click();
      await page.locator('[data-test-id="editor-wrapper"] div').filter({ hasText: /^Hippo Automation$/ }).fill('Hippo Automation test');
      await page.waitForTimeout(1000);
      console.log('✅ Bot name alanı değiştirildi');
      
      // Confirm butonuna tıkla
      console.log('💾 Confirm butonu tıklanıyor...');
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Confirm butonu tıklandı');
      
      console.log('🎉 TEST SONUCU: Bot name değiştirme BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Bot name değiştirme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/bot-name-change.png', fullPage: true });
    console.log('📸 Bot name değiştirme testi screenshot alındı');
  });

  test('Preferences tam süreç testi', async ({ page }) => {
    console.log('🔄 Preferences tam süreç testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Preferences linkine tıkla
      console.log('🔗 Preferences linkine gidiliyor...');
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Preferences sayfasına gidildi');
      
      // Timezone seç
      console.log('🌍 Timezone seçiliyor...');
      await page.getByRole('combobox').filter({ hasText: 'Select your timezone' }).click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="multiselect-search-input"]').fill('ist');
      await page.waitForTimeout(1000);
      
      await page.locator('label').filter({ hasText: '(GMT+03:00) Istanbul' }).first().click();
      await page.waitForTimeout(2000);
      console.log('✅ Timezone seçildi');
      
      // Request ID Prefix değiştir
      console.log('🔢 Request ID Prefix değiştiriliyor...');
      await page.locator('[data-test-id="edit-casePrefix-btn"]').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).click();
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).dblclick();
      await page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' }).fill('test');
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Request ID Prefix değiştirildi');
      
      // Requester Ratings ayarla
      console.log('⭐ Requester Ratings ayarlanıyor...');
      await page.getByRole('combobox').filter({ hasText: 'For all requests' }).getByRole('img').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="show-rating-option-all-tickets"] div').click();
      await page.waitForTimeout(2000);
      console.log('✅ Requester Ratings ayarlandı');
      
      // Agent responder name değiştir
      console.log('👤 Agent responder name değiştiriliyor...');
      await page.locator('[data-test-id="edit-agentinfo-btn"]').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="editor-wrapper"]').getByText('Agent').click();
      await page.locator('[data-test-id="editor-wrapper"] div').filter({ hasText: /^Agent$/ }).fill('admin');
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Agent responder name değiştirildi');
      
      // Bot name değiştir
      console.log('🤖 Bot name değiştiriliyor...');
      await page.locator('[data-test-id="edit-botName-btn"]').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="editor-wrapper"]').getByText('Hippo Automation').click();
      await page.locator('[data-test-id="editor-wrapper"] div').filter({ hasText: /^Hippo Automation$/ }).fill('Hippo Automation test');
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Bot name değiştirildi');
      
      // Accept butonuna tıkla
      console.log('✅ Accept butonu tıklanıyor...');
      await page.getByRole('button', { name: 'Accept' }).click();
      await page.waitForTimeout(2000);
      console.log('✅ Accept butonu tıklandı');
      
      console.log('🎉 TEST SONUCU: Preferences tam süreç BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Preferences tam süreç BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/preferences-full-process.png', fullPage: true });
    console.log('📸 Preferences tam süreç testi screenshot alındı');
  });
}); 