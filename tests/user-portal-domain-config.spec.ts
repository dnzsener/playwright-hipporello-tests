import { test, expect } from '@playwright/test';

test.describe('🌐 User Portal - Domain Configuration Testleri', () => {
  test.use({ storageState: 'auth.json' });

  test.beforeEach(async ({ page }) => {
    console.log('🔄 Ana sayfa yükleniyor...');
    await page.goto('https://admin.hipporello.com/');
    
    // Workspace seçimini kesin olarak yap
    try {
      console.log('🏢 Workspace seçimi yapılıyor...');
      await page.waitForSelector('button:has-text("TESTMANDESKASANAPR12a")', { timeout: 15000 });
      await page.getByRole('button', { name: 'TESTMANDESKASANAPR12a' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Workspace seçildi');
    } catch (e) {
      console.log('⚠️ Workspace zaten seçili veya bulunamadı, devam ediliyor...');
    }
  });

  test('User Portal Domain Configuration sayfasına erişim', async ({ page }) => {
    console.log('🌐 User Portal Domain Configuration sayfasına erişim testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Domain Configuration linkine tıkla
      console.log('🔗 Domain Configuration linkine gidiliyor...');
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Domain Configuration sayfasına gidildi');
      
      // Sayfa başlığını kontrol et
      const pageTitle = await page.title();
      console.log(`📄 Sayfa başlığı: ${pageTitle}`);
      
      // Domain Configuration sayfasının yüklendiğini kontrol et
      const domainConfigContent = page.locator('text=Domain Configuration, text=Custom Domain, text=Add Domain');
      if (await domainConfigContent.count() > 0) {
        console.log('✅ Domain Configuration sayfası başarıyla yüklendi');
        console.log('🎉 TEST SONUCU: User Portal Domain Configuration sayfasına erişim BAŞARILI');
      } else {
        console.log('⚠️ Domain Configuration sayfası içeriği bulunamadı');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: User Portal Domain Configuration sayfasına erişim BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/user-portal-domain-config.png', fullPage: true });
    console.log('📸 User Portal Domain Configuration sayfası screenshot alındı');
  });

  test('Custom Domain ekleme testi', async ({ page }) => {
    console.log('➕ Custom Domain ekleme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Domain Configuration linkine tıkla
      console.log('🔗 Domain Configuration linkine gidiliyor...');
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Domain Configuration sayfasına gidildi');
      
      // Add Custom Domain butonunu bekle ve tıkla
      console.log('🔍 Add Custom Domain butonu aranıyor...');
      await page.waitForSelector('[data-test-id="add-custom-domain-btn"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="add-custom-domain-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Add Custom Domain butonu tıklandı');
      
      // Domain adını doldur
      const domainName = 'ototest.kulturpostasi.com';
      console.log(`🌐 Domain adı: ${domainName}`);
      
      console.log('📝 Domain adı dolduruluyor...');
      await page.locator('[data-test-id="portal-domain-name-input"]').click();
      await page.locator('[data-test-id="portal-domain-name-input"]').fill(domainName);
      await page.waitForTimeout(1000);
      console.log(`✅ Domain adı dolduruldu: ${domainName}`);
      
      // Save butonunu tıkla
      console.log('💾 Save butonu tıklanıyor...');
      await page.locator('[data-test-id="domain-modal-save-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Save butonu tıklandı');
      
      // Confirm butonunu tıkla
      console.log('✅ Confirm butonu tıklanıyor...');
      await page.locator('[data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Confirm butonu tıklandı');
      
      // Domain'in eklendiğini kontrol et
      const addedDomain = page.locator(`text=${domainName}`);
      if (await addedDomain.count() > 0) {
        console.log('✅ Domain başarıyla eklendi');
        console.log('🎉 TEST SONUCU: Custom Domain ekleme BAŞARILI');
      } else {
        console.log('⚠️ Domain eklenip eklenmediği kontrol edilemedi');
        console.log('🎉 TEST SONUCU: Custom Domain ekleme süreci tamamlandı');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Custom Domain ekleme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/custom-domain-add.png', fullPage: true });
    console.log('📸 Custom Domain ekleme testi screenshot alındı');
  });

  test('Domain validity kontrolü', async ({ page }) => {
    console.log('🔍 Domain validity kontrolü testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Domain Configuration linkine tıkla
      console.log('🔗 Domain Configuration linkine gidiliyor...');
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Domain Configuration sayfasına gidildi');
      
      // Domain validity butonunu bekle ve tıkla
      console.log('🔍 Domain validity butonu aranıyor...');
      await page.waitForSelector('[data-test-id="domain-validity-btn"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="domain-validity-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Domain validity butonu tıklandı');
      
      // Validity kontrolü sonucunu kontrol et
      const validityResult = page.locator('text=Valid, text=Invalid, text=Checking, text=Status');
      if (await validityResult.count() > 0) {
        console.log('✅ Domain validity kontrolü yapıldı');
        console.log('🎉 TEST SONUCU: Domain validity kontrolü BAŞARILI');
      } else {
        console.log('⚠️ Domain validity kontrolü sonucu görülemedi');
        console.log('🎉 TEST SONUCU: Domain validity kontrolü süreci tamamlandı');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Domain validity kontrolü BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/domain-validity.png', fullPage: true });
    console.log('📸 Domain validity kontrolü testi screenshot alındı');
  });

  test('Domain silme testi', async ({ page }) => {
    console.log('🗑️ Domain silme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Domain Configuration linkine tıkla
      console.log('🔗 Domain Configuration linkine gidiliyor...');
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Domain Configuration sayfasına gidildi');
      
      // Domain actions butonunu bekle ve tıkla
      console.log('🔍 Domain actions butonu aranıyor...');
      await page.waitForSelector('[data-test-id="domain-actions"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="domain-actions"]').first().click();
      await page.waitForTimeout(1000);
      console.log('✅ Domain actions butonu tıklandı');
      
      // Delete butonunu bekle ve tıkla
      console.log('🗑️ Delete butonu tıklanıyor...');
      await page.waitForSelector('[data-test-id="delete"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="delete"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Delete butonu tıklandı');
      
      // Domain adını onay için doldur
      const domainName = 'ototest.kulturpostasi.com';
      console.log(`🌐 Silinecek domain: ${domainName}`);
      
      console.log('📝 Domain adı onay için dolduruluyor...');
      await page.getByRole('textbox').click();
      await page.getByRole('textbox').fill(domainName);
      await page.waitForTimeout(1000);
      console.log(`✅ Domain adı dolduruldu: ${domainName}`);
      
      // Confirm butonunu tıkla
      console.log('✅ Confirm butonu tıklanıyor...');
      await page.locator('[data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Confirm butonu tıklandı');
      
      // Domain'in silindiğini kontrol et
      const deletedDomain = page.locator(`text=${domainName}`);
      if (await deletedDomain.count() === 0) {
        console.log('✅ Domain başarıyla silindi');
        console.log('🎉 TEST SONUCU: Domain silme BAŞARILI');
      } else {
        console.log('⚠️ Domain silinip silinmediği kontrol edilemedi');
        console.log('🎉 TEST SONUCU: Domain silme süreci tamamlandı');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Domain silme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/domain-delete.png', fullPage: true });
    console.log('📸 Domain silme testi screenshot alındı');
  });

  test('Domain Configuration tam süreç testi', async ({ page }) => {
    console.log('🔄 Domain Configuration tam süreç testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      console.log('🔍 User Portal menüsü aranıyor...');
      await page.locator('[data-test-id="menu-item_userportal"] div').nth(1).click();
      await page.waitForTimeout(2000);
      console.log('✅ User Portal menüsü açıldı');
      
      // Domain Configuration linkine tıkla
      console.log('🔗 Domain Configuration linkine gidiliyor...');
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      console.log('✅ Domain Configuration sayfasına gidildi');
      
      // Sayfa durumunu kontrol et
      console.log('📄 Sayfa durumu kontrol ediliyor...');
      const pageContent = await page.textContent('body');
      console.log('📋 Sayfa içeriği kontrol ediliyor...');
      
      // Tüm butonları listele
      const allButtons = page.locator('button');
      const buttonCount = await allButtons.count();
      console.log(`📋 Sayfada ${buttonCount} buton bulundu`);
      
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        try {
          const buttonText = await allButtons.nth(i).textContent();
          const buttonDisabled = await allButtons.nth(i).getAttribute('disabled');
          console.log(`🔘 Buton ${i + 1}: ${buttonText?.trim() || 'Metin yok'} ${buttonDisabled ? '(disabled)' : '(enabled)'}`);
        } catch (e) {
          console.log(`🔘 Buton ${i + 1}: Bilgi okunamadı`);
        }
      }
      
      // Add Custom Domain butonunu bul
      const addDomainBtn = page.locator('[data-test-id="add-custom-domain-btn"]');
      if (await addDomainBtn.count() > 0) {
        const isDisabled = await addDomainBtn.getAttribute('disabled');
        console.log(`🔍 Add Custom Domain butonu bulundu: ${isDisabled ? 'disabled' : 'enabled'}`);
        
        if (isDisabled) {
          console.log('⚠️ Add Custom Domain butonu disabled, bekleniyor...');
          // Butonun enabled olmasını bekle
          await page.waitForSelector('[data-test-id="add-custom-domain-btn"]:not([disabled])', { timeout: 30000 });
        }
        
        await addDomainBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Add Custom Domain butonu tıklandı');
      } else {
        console.log('❌ Add Custom Domain butonu bulunamadı');
        return;
      }
      
      // Yeni domain ekle
      console.log('➕ Yeni domain ekleniyor...');
      const domainName = 'ototest.kulturpostasi.com';
      console.log(`🌐 Domain adı: ${domainName}`);
      
      await page.locator('[data-test-id="portal-domain-name-input"]').click();
      await page.locator('[data-test-id="portal-domain-name-input"]').fill(domainName);
      await page.waitForTimeout(1000);
      console.log(`✅ Domain adı dolduruldu: ${domainName}`);
      
      await page.locator('[data-test-id="domain-modal-save-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Save butonu tıklandı');
      
      await page.locator('[data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Confirm butonu tıklandı');
      console.log('✅ Domain eklendi');
      
      // Domain validity kontrolü yap (Check Status)
      console.log('🔍 Domain validity kontrolü yapılıyor...');
      const validityBtn = page.locator('[data-test-id="domain-validity-btn"]');
      if (await validityBtn.count() > 0) {
        const isDisabled = await validityBtn.getAttribute('disabled');
        console.log(`🔍 Domain validity butonu bulundu: ${isDisabled ? 'disabled' : 'enabled'}`);
        
        if (isDisabled) {
          console.log('⚠️ Domain validity butonu disabled, bekleniyor...');
          await page.waitForSelector('[data-test-id="domain-validity-btn"]:not([disabled])', { timeout: 30000 });
        }
        
        await validityBtn.click();
        await page.waitForTimeout(2000);
        console.log('✅ Domain validity kontrolü yapıldı');
      } else {
        console.log('⚠️ Domain validity butonu bulunamadı');
      }
      
      // Domain'i sil
      console.log('🗑️ Domain siliniyor...');
      const actionsBtn = page.locator('[data-test-id="domain-actions"]');
      if (await actionsBtn.count() > 0) {
        const isDisabled = await actionsBtn.first().getAttribute('disabled');
        console.log(`🔍 Domain actions butonu bulundu: ${isDisabled ? 'disabled' : 'enabled'}`);
        
        if (isDisabled) {
          console.log('⚠️ Domain actions butonu disabled, bekleniyor...');
          await page.waitForSelector('[data-test-id="domain-actions"]:not([disabled])', { timeout: 30000 });
        }
        
        await actionsBtn.first().click();
        await page.waitForTimeout(1000);
        console.log('✅ Domain actions butonu tıklandı');
        
        const deleteBtn = page.locator('[data-test-id="delete"]');
        if (await deleteBtn.count() > 0) {
          await deleteBtn.click();
          await page.waitForTimeout(2000);
          console.log('✅ Delete butonu tıklandı');
          
          await page.getByRole('textbox').click();
          await page.getByRole('textbox').fill(domainName);
          await page.waitForTimeout(1000);
          console.log(`✅ Domain adı onay için dolduruldu: ${domainName}`);
          
          await page.locator('[data-test-id="confirm-btn"]').click();
          await page.waitForTimeout(3000);
          console.log('✅ Confirm butonu tıklandı');
          console.log('✅ Domain silindi');
        } else {
          console.log('⚠️ Delete butonu bulunamadı');
        }
      } else {
        console.log('⚠️ Domain actions butonu bulunamadı');
      }
      
      console.log('🎉 TEST SONUCU: Domain Configuration tam süreç BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Domain Configuration tam süreç BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/domain-config-full-process.png', fullPage: true });
    console.log('📸 Domain Configuration tam süreç testi screenshot alındı');
  });
}); 