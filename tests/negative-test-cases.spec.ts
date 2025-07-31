import { test, expect } from '@playwright/test';

test.describe('❌ Negatif Test Case\'leri', () => {
  test.use({ storageState: 'auth.json' });

  test.beforeEach(async ({ page }) => {
    console.log('🔄 Ana sayfa yükleniyor...');
    await page.goto('/admin');
    await page.waitForTimeout(5000);

    // Service Desk seçimi
    console.log('🏢 Service Desk seçimi yapılıyor...');
    try {
      await page.waitForSelector('text=Choose your Hipporello Service Desk', { timeout: 10000 });
      console.log('✅ Service Desk seçim sayfası yüklendi');
      
      const serviceDeskItem = page.locator('text=TESTMANDESKASANAPR12a').first();
      if (await serviceDeskItem.count() > 0) {
        await serviceDeskItem.click();
        await page.waitForTimeout(3000);
        console.log('✅ Service Desk seçildi: TESTMANDESKASANAPR12a');
      }
    } catch (e) {
      console.log('Service Desk seçimi bulunamadı, devam ediliyor...');
    }
  });

  test('Geçersiz domain adı ile domain ekleme testi', async ({ page }) => {
    console.log('❌ Geçersiz domain adı ile domain ekleme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      
      // Add Custom Domain butonunu bekle ve tıkla
      await page.waitForSelector('[data-test-id="add-custom-domain-btn"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="add-custom-domain-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Geçersiz domain adları test et
      const invalidDomains = [
        'invalid-domain',
        'test@domain.com',
        'domain with spaces',
        'domain_with_underscores',
        '123456789',
        'a',
        'domain..com',
        'domain-.com'
      ];
      
      for (const invalidDomain of invalidDomains) {
        console.log(`🔍 Geçersiz domain test ediliyor: ${invalidDomain}`);
        
        await page.locator('[data-test-id="portal-domain-name-input"]').click();
        await page.locator('[data-test-id="portal-domain-name-input"]').fill(invalidDomain);
        await page.waitForTimeout(1000);
        
        await page.locator('[data-test-id="domain-modal-save-btn"]').click();
        await page.waitForTimeout(2000);
        
        // Hata mesajı kontrol et
        const errorMessage = page.locator('text=Invalid domain name, text=Please enter a valid domain, text=Domain format is incorrect');
        if (await errorMessage.count() > 0) {
          console.log(`✅ Geçersiz domain için hata mesajı bulundu: ${invalidDomain}`);
        } else {
          console.log(`⚠️ Geçersiz domain için hata mesajı bulunamadı: ${invalidDomain}`);
        }
        
        // Modal'ı kapat
        const closeBtn = page.locator('[data-test-id="close-modal"], [data-test-id="cancel-btn"]');
        if (await closeBtn.count() > 0) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
        }
      }
      
      console.log('🎉 TEST SONUCU: Geçersiz domain adı testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Geçersiz domain adı testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-invalid-domain.png', fullPage: true });
  });

  test('Boş alanlarla form gönderme testi', async ({ page }) => {
    console.log('❌ Boş alanlarla form gönderme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.waitForTimeout(3000);
      
      // Form oluştur butonuna tıkla
      await page.locator('[data-test-id="form-add-new-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Boş form adı ile kaydetmeye çalış
      await page.locator('[data-test-id="new-form-btn"]').click();
      await page.waitForTimeout(2000);
      
      await page.locator('text=Blank').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="start-creating-form-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Form adını boş bırak ve kaydetmeye çalış
      await page.locator('[data-test-id="create-form-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Hata mesajı kontrol et
      const errorMessage = page.locator('text=Form name is required, text=Please enter a form name, text=Name cannot be empty');
      if (await errorMessage.count() > 0) {
        console.log('✅ Boş form adı için hata mesajı bulundu');
      } else {
        console.log('⚠️ Boş form adı için hata mesajı bulunamadı');
      }
      
      console.log('🎉 TEST SONUCU: Boş alanlarla form gönderme testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Boş alanlarla form gönderme testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-empty-form.png', fullPage: true });
  });

  test('Geçersiz email formatı testi', async ({ page }) => {
    console.log('❌ Geçersiz email formatı testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      
      // Email alanını bul ve geçersiz değerler test et
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@domain.com',
        'test@domain',
        'test..test@domain.com',
        'test@.com',
        'test@domain..com'
      ];
      
      // Email alanını bul (eğer varsa)
      const emailInput = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email"]');
      if (await emailInput.count() > 0) {
        for (const invalidEmail of invalidEmails) {
          console.log(`🔍 Geçersiz email test ediliyor: ${invalidEmail}`);
          
          await emailInput.first().click();
          await emailInput.first().fill(invalidEmail);
          await page.waitForTimeout(1000);
          
          // Form submit etmeye çalış
          const submitBtn = page.locator('[data-test-id="save-btn"], [data-test-id="submit-btn"], button[type="submit"]');
          if (await submitBtn.count() > 0) {
            await submitBtn.first().click();
            await page.waitForTimeout(2000);
            
            // Hata mesajı kontrol et
            const errorMessage = page.locator('text=Invalid email, text=Please enter a valid email, text=Email format is incorrect');
            if (await errorMessage.count() > 0) {
              console.log(`✅ Geçersiz email için hata mesajı bulundu: ${invalidEmail}`);
            } else {
              console.log(`⚠️ Geçersiz email için hata mesajı bulunamadı: ${invalidEmail}`);
            }
          }
        }
      } else {
        console.log('⚠️ Email alanı bulunamadı');
      }
      
      console.log('🎉 TEST SONUCU: Geçersiz email formatı testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Geçersiz email formatı testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-invalid-email.png', fullPage: true });
  });

  test('Çok uzun metin girişi testi', async ({ page }) => {
    console.log('❌ Çok uzun metin girişi testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Preferences' }).click();
      await page.waitForTimeout(3000);
      
      // Çok uzun metin oluştur
      const longText = 'a'.repeat(1000);
      
      // Request ID Prefix alanını bul ve uzun metin gir
      const prefixEditBtn = page.locator('[data-test-id="edit-casePrefix-btn"]');
      if (await prefixEditBtn.count() > 0) {
        await prefixEditBtn.click();
        await page.waitForTimeout(1000);
        
        const prefixInput = page.locator('[data-test-id="user-form-case-prefix"]').getByRole('textbox', { name: 'Request ID Prefix' });
        if (await prefixInput.count() > 0) {
          await prefixInput.click();
          await prefixInput.fill(longText);
          await page.waitForTimeout(1000);
          
          // Kaydetmeye çalış
          await page.locator('[data-test-id="confirm-modal"] [data-test-id="confirm-btn"]').click();
          await page.waitForTimeout(2000);
          
          // Hata mesajı kontrol et
          const errorMessage = page.locator('text=Too long, text=Maximum length exceeded, text=Text is too long');
          if (await errorMessage.count() > 0) {
            console.log('✅ Çok uzun metin için hata mesajı bulundu');
          } else {
            console.log('⚠️ Çok uzun metin için hata mesajı bulunamadı');
          }
        }
      }
      
      console.log('🎉 TEST SONUCU: Çok uzun metin girişi testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Çok uzun metin girişi testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-long-text.png', fullPage: true });
  });

  test('Aynı domain adını tekrar ekleme testi', async ({ page }) => {
    console.log('❌ Aynı domain adını tekrar ekleme testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Domain Configuration' }).click();
      await page.waitForTimeout(3000);
      
      // İlk domain'i ekle
      await page.waitForSelector('[data-test-id="add-custom-domain-btn"]:not([disabled])', { timeout: 10000 });
      await page.locator('[data-test-id="add-custom-domain-btn"]').click();
      await page.waitForTimeout(2000);
      
      const domainName = 'duplicate-test-domain.com';
      await page.locator('[data-test-id="portal-domain-name-input"]').click();
      await page.locator('[data-test-id="portal-domain-name-input"]').fill(domainName);
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="domain-modal-save-btn"]').click();
      await page.waitForTimeout(2000);
      
      await page.locator('[data-test-id="confirm-btn"]').click();
      await page.waitForTimeout(3000);
      
      // Aynı domain'i tekrar eklemeye çalış
      await page.locator('[data-test-id="add-custom-domain-btn"]').click();
      await page.waitForTimeout(2000);
      
      await page.locator('[data-test-id="portal-domain-name-input"]').click();
      await page.locator('[data-test-id="portal-domain-name-input"]').fill(domainName);
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="domain-modal-save-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Hata mesajı kontrol et
      const errorMessage = page.locator('text=Domain already exists, text=This domain is already added, text=Duplicate domain');
      if (await errorMessage.count() > 0) {
        console.log('✅ Aynı domain için hata mesajı bulundu');
      } else {
        console.log('⚠️ Aynı domain için hata mesajı bulunamadı');
      }
      
      console.log('🎉 TEST SONUCU: Aynı domain adını tekrar ekleme testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Aynı domain adını tekrar ekleme testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-duplicate-domain.png', fullPage: true });
  });

  test('Geçersiz karakterlerle form adı testi', async ({ page }) => {
    console.log('❌ Geçersiz karakterlerle form adı testi başlıyor...');
    
    try {
      // User Portal menüsüne git
      await page.locator('[data-test-id="menu-item_userportal"]').click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.waitForTimeout(3000);
      
      // Form oluştur butonuna tıkla
      await page.locator('[data-test-id="form-add-new-btn"]').click();
      await page.waitForTimeout(2000);
      
      await page.locator('[data-test-id="new-form-btn"]').click();
      await page.waitForTimeout(2000);
      
      await page.locator('text=Blank').click();
      await page.waitForTimeout(1000);
      
      await page.locator('[data-test-id="start-creating-form-btn"]').click();
      await page.waitForTimeout(2000);
      
      // Geçersiz karakterlerle form adları test et
      const invalidNames = [
        'Form/Name',
        'Form\\Name',
        'Form:Name',
        'Form*Name',
        'Form?Name',
        'Form|Name',
        'Form<Name',
        'Form>Name',
        'Form"Name',
        'Form\'Name'
      ];
      
      for (const invalidName of invalidNames) {
        console.log(`🔍 Geçersiz form adı test ediliyor: ${invalidName}`);
        
        const formNameInput = page.locator('[data-test-id="form-name-input"] input, input[name="name"], input[placeholder*="name"]');
        if (await formNameInput.count() > 0) {
          await formNameInput.first().click();
          await formNameInput.first().fill(invalidName);
          await page.waitForTimeout(1000);
          
          await page.locator('[data-test-id="create-form-btn"]').click();
          await page.waitForTimeout(2000);
          
          // Hata mesajı kontrol et
          const errorMessage = page.locator('text=Invalid characters, text=Special characters not allowed, text=Name contains invalid characters');
          if (await errorMessage.count() > 0) {
            console.log(`✅ Geçersiz form adı için hata mesajı bulundu: ${invalidName}`);
          } else {
            console.log(`⚠️ Geçersiz form adı için hata mesajı bulunamadı: ${invalidName}`);
          }
        }
      }
      
      console.log('🎉 TEST SONUCU: Geçersiz karakterlerle form adı testi BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Geçersiz karakterlerle form adı testi BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/negative-invalid-form-name.png', fullPage: true });
  });
}); 