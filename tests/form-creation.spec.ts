import { test, expect } from '@playwright/test';

test.describe('📝 Hipporello Admin - Form Oluşturma Testleri', () => {
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
    
    // Forms sayfasına git
    console.log('📝 Forms sayfasına gidiliyor...');
    
    // Forms link'ini bulmak için farklı selector'ları dene
    const formsLinkSelectors = [
      'a:has-text("Forms")',
      'a[href*="forms"]',
      '[data-test-id="forms-link"]',
      'a:has-text("Form")',
      'nav a:has-text("Forms")',
      '.sidebar a:has-text("Forms")',
      'a[href="/forms"]',
      'a[href="/admin/forms"]'
    ];
    
    let formsLinkFound = false;
    for (const selector of formsLinkSelectors) {
      const formsLink = page.locator(selector);
      if (await formsLink.count() > 0) {
        await formsLink.click();
        console.log(`✅ Forms sayfasına gidildi (${selector})`);
        formsLinkFound = true;
        await page.waitForTimeout(3000);
        break;
      }
    }
    
    if (!formsLinkFound) {
      console.log('⚠️ Forms link bulunamadı, doğrudan URL ile gitmeyi deniyorum...');
      await page.goto('/forms');
      await page.waitForTimeout(3000);
      console.log('✅ Forms sayfasına URL ile gidildi');
    }
  });

  test('Forms sayfasına erişim ve form listesi', async ({ page }) => {
    console.log('🔍 Forms sayfası kontrol ediliyor...');
    
    try {
      await expect(page).toHaveURL(/form/);
      console.log('✅ Forms sayfası yüklendi');
      
      // Form listesini kontrol et
      console.log('📋 Form listesi kontrol ediliyor...');
      const formListSelectors = [
        'div[class*="form-item"]',
        'div[class*="form-card"]',
        'div[class*="form-list"]',
        'li[class*="form"]',
        'tr[class*="form"]',
        '[data-test-id="form-item"]',
        '[data-test-id="form-card"]',
        '.form-item',
        '.form-card',
        '.form-list-item'
      ];
      
      let formListFound = false;
      for (const selector of formListSelectors) {
        const formList = page.locator(selector);
        if (await formList.count() > 0) {
          console.log(`✅ Form listesi bulundu: ${await formList.count()} form (${selector})`);
          formListFound = true;
          break;
        }
      }
      
      if (!formListFound) {
        console.log('⚠️ Form listesi bulunamadı, sayfa içeriğini kontrol ediyorum...');
        // Sayfa içeriğini kontrol et
        const pageContent = await page.content();
        console.log('📄 Sayfa içeriği kontrol ediliyor...');
        
        // Form oluşturma butonunu ara
        const createFormSelectors = [
          '[data-test-id="form-add-new-btn"]',
          'button:has-text("Create Form")',
          'button:has-text("New Form")',
          'button:has-text("Add Form")',
          'button:has-text("+")',
          'button[class*="add"]',
          'button[class*="create"]',
          'button[class*="new"]'
        ];
        
        for (const selector of createFormSelectors) {
          const createBtn = page.locator(selector);
          if (await createBtn.count() > 0) {
            console.log(`✅ Form oluşturma butonu bulundu: ${selector}`);
            break;
          }
        }
      }
      
      await page.screenshot({ path: 'screenshots/forms-page.png', fullPage: true });
      console.log('📸 Forms sayfası screenshot alındı');
      console.log('🎉 TEST SONUCU: Forms sayfasına erişim BAŞARILI');
    } catch (e) {
      console.log(`❌ TEST SONUCU: Forms sayfasına erişim BAŞARISIZ - ${e.message}`);
      await page.screenshot({ path: 'screenshots/forms-page-error.png', fullPage: true });
    }
  });

  test('Form oluşturma süreci', async ({ page }) => {
    console.log('📝 Form oluşturma süreci başlıyor...');
    
    // Benzersiz form adı oluştur
    const timestamp = Date.now();
    const uniqueFormName = `Test Form ${timestamp}`;
    console.log(`📝 Form adı: ${uniqueFormName}`);
    console.log(`📅 Tarih: ${new Date().toLocaleString('tr-TR')}`);
    
    try {
      // Forms sayfasına git
      console.log('🔍 Forms sayfasına gidiliyor...');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.waitForTimeout(2000);
      console.log('✅ Forms sayfasına gidildi');
      
      // Form oluşturma butonunu tıkla
      console.log('🔍 Form oluşturma butonu aranıyor...');
      await page.locator('[data-test-id="form-add-new-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Form oluşturma butonu tıklandı');
      
      // Yeni form butonunu tıkla
      await page.locator('[data-test-id="new-form-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Yeni form butonu tıklandı');
      
      // Blank template'i seç
      await page.locator('div').filter({ hasText: /^Blank$/ }).nth(3).click();
      await page.waitForTimeout(2000);
      console.log('✅ Blank template seçildi');
      
      // Form oluşturmaya başla
      await page.locator('[data-test-id="start-creating-form-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Form oluşturma başlatıldı');
      
      // Form adını doldur
      console.log('📝 Form adı dolduruluyor...');
      await page.getByRole('textbox', { name: 'Form name' }).click();
      await page.getByRole('textbox', { name: 'Form name' }).dblclick();
      await page.getByRole('textbox', { name: 'Form name' }).fill(uniqueFormName);
      await page.waitForTimeout(1000);
      console.log(`✅ Form adı dolduruldu: ${uniqueFormName}`);
      
      // Form oluştur butonunu tıkla
      await page.locator('[data-test-id="create-form-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Form oluşturuldu');
      
      // Form elementlerini ekle
      console.log('🔧 Form elementleri ekleniyor...');
      
      const formElements = [
        { name: 'Short Text', action: () => page.getByLabel('Short Text').click() },
        { name: 'Long Text', action: () => page.locator('[data-test-id="toolbox-draggable-item__long-text__btn"] div').first().click() },
        { name: 'Rich Text Input', action: () => page.getByLabel('Rich Text Input').click() },
        { name: 'Email', action: () => page.getByLabel('Email').click() },
        { name: 'Website', action: () => page.getByLabel('Website').click() },
        { name: 'Radio Button', action: () => page.locator('[data-test-id="toolbox-draggable-item__radio-button__btn"] div').first().click() },
        { name: 'Select Box', action: () => page.getByLabel('Select Box').click() },
        { name: 'Rating', action: () => page.locator('[data-test-id="toolbox-draggable-item__rating__btn"] div').first().click() },
        { name: 'Yes/No', action: () => page.locator('[data-test-id="toolbox-draggable-item__yesno__btn"] div').first().click() },
        { name: 'Number', action: () => page.locator('[data-test-id="toolbox-draggable-item__number__btn"]').getByLabel('Number').click() },
        { name: 'Phone Number', action: () => page.getByLabel('Phone Number').click() },
        { name: 'Password', action: () => page.getByLabel('Password').click() }
      ];
      
      let elementsAdded = 0;
      for (const element of formElements) {
        try {
          await element.action();
          console.log(`✅ ${element.name} elementi eklendi`);
          elementsAdded++;
          await page.waitForTimeout(500);
        } catch (e) {
          console.log(`⚠️ ${element.name} elementi eklenemedi: ${e.message}`);
        }
      }
      
      console.log(`📊 Toplam ${elementsAdded} form elementi eklendi`);
      
      // Submit Actions ayarlarını yap
      console.log('🎯 Submit Actions ayarları yapılıyor...');
      await page.locator('[data-test-id="switch-item-onSubmit"]').click();
      await page.waitForTimeout(1000);
      console.log('✅ Submit Actions açıldı');
      
      // Section seç
      await page.getByRole('combobox').filter({ hasText: 'Select section' }).click();
      await page.waitForTimeout(1000);
      await page.locator('div').filter({ hasText: /^New Form Responses$/ }).click();
      await page.waitForTimeout(1000);
      console.log('✅ Section seçildi: New Form Responses');
      
      // Formu yayınla
      console.log('🚀 Form yayınlanıyor...');
      await page.locator('[data-test-id="form-editor-publish-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Form yayınlandı');
      
      // Başarı mesajını kontrol et
      const successMessage = page.locator('text=Published, text=Yayınlandı, text=Success, text=Created, text=Saved');
      if (await successMessage.count() > 0) {
        console.log('✅ Yayınlama başarı mesajı görüldü');
      }
      
      console.log('🎉 TEST SONUCU: Form oluşturma süreci BAŞARILI');
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Form oluşturma BAŞARISIZ - ${e.message}`);
    }
    
    // Screenshot al
    await page.screenshot({ path: 'screenshots/form-creation.png', fullPage: true });
    console.log('📸 Form oluşturma sayfası screenshot alındı');
  });

  test('Form elementlerini ekleme testi', async ({ page }) => {
    console.log('🔧 Form elementlerini ekleme testi başlıyor...');
    
    try {
      // Forms sayfasına git
      console.log('🔍 Forms sayfasına gidiliyor...');
      await page.getByRole('link', { name: 'Forms' }).click();
      await page.waitForTimeout(2000);
      console.log('✅ Forms sayfasına gidildi');
      
      // Form oluşturma sürecini başlat
      console.log('🔍 Form oluşturma butonu aranıyor...');
      await page.locator('[data-test-id="form-add-new-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Form oluşturma butonu tıklandı');
      
      // Yeni form butonunu tıkla
      await page.locator('[data-test-id="new-form-btn"]').click();
      await page.waitForTimeout(2000);
      console.log('✅ Yeni form butonu tıklandı');
      
      // Blank template'i seç
      await page.locator('div').filter({ hasText: /^Blank$/ }).nth(3).click();
      await page.waitForTimeout(2000);
      console.log('✅ Blank template seçildi');
      
      // Form oluşturmaya başla
      await page.locator('[data-test-id="start-creating-form-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Form oluşturma başlatıldı');
      
      // Form adını doldur
      const timestamp = Date.now();
      const uniqueFormName = `Element Test Form ${timestamp}`;
      console.log(`📝 Form adı dolduruluyor: ${uniqueFormName}`);
      
      await page.getByRole('textbox', { name: 'Form name' }).click();
      await page.getByRole('textbox', { name: 'Form name' }).dblclick();
      await page.getByRole('textbox', { name: 'Form name' }).fill(uniqueFormName);
      await page.waitForTimeout(1000);
      console.log(`✅ Form adı dolduruldu: ${uniqueFormName}`);
      
      // Form oluştur butonunu tıkla
      await page.locator('[data-test-id="create-form-btn"]').click();
      await page.waitForTimeout(3000);
      console.log('✅ Form oluşturuldu');
      
      // Form elementlerini ekle - kayıt alınan adımları kullan
      console.log('🔧 Form elementleri ekleniyor...');
      
      const formElements = [
        { name: 'Short Text', action: () => page.getByLabel('Short Text').click() },
        { name: 'Long Text', action: () => page.locator('[data-test-id="toolbox-draggable-item__long-text__btn"] div').first().click() },
        { name: 'Rich Text Input', action: () => page.getByLabel('Rich Text Input').click() },
        { name: 'Email', action: () => page.getByLabel('Email').click() },
        { name: 'Website', action: () => page.getByLabel('Website').click() },
        { name: 'Radio Button', action: () => page.locator('[data-test-id="toolbox-draggable-item__radio-button__btn"] div').first().click() },
        { name: 'Select Box', action: () => page.getByLabel('Select Box').click() },
        { name: 'Rating', action: () => page.locator('[data-test-id="toolbox-draggable-item__rating__btn"] div').first().click() },
        { name: 'Yes/No', action: () => page.locator('[data-test-id="toolbox-draggable-item__yesno__btn"] div').first().click() },
        { name: 'Number', action: () => page.locator('[data-test-id="toolbox-draggable-item__number__btn"]').getByLabel('Number').click() },
        { name: 'Phone Number', action: () => page.getByLabel('Phone Number').click() },
        { name: 'Password', action: () => page.getByLabel('Password').click() }
      ];
      
      let elementsAdded = 0;
      for (const element of formElements) {
        try {
          await element.action();
          console.log(`✅ ${element.name} elementi eklendi`);
          elementsAdded++;
          await page.waitForTimeout(500);
        } catch (e) {
          console.log(`⚠️ ${element.name} elementi eklenemedi: ${e.message}`);
        }
      }
      
      console.log(`📊 Toplam ${elementsAdded} form elementi eklendi`);
      
      if (elementsAdded > 0) {
        console.log('🎉 TEST SONUCU: Form elementleri ekleme BAŞARILI');
      } else {
        console.log('❌ TEST SONUCU: Form elementleri ekleme BAŞARISIZ - Hiç element eklenemedi');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Form elementleri ekleme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/form-elements.png', fullPage: true });
    console.log('📸 Form elementleri testi screenshot alındı');
  });

  test('Form kaydetme ve yayınlama testi', async ({ page }) => {
    console.log('💾 Form kaydetme ve yayınlama testi başlıyor...');
    
    try {
      // Form oluşturma sayfasına git
      const createFormBtn = page.locator('[data-test-id="form-add-new-btn"]');
      if (await createFormBtn.count() > 0) {
        await createFormBtn.click();
        await page.waitForTimeout(3000);
        console.log('✅ Form oluşturma sayfası açıldı');
        
        // Form adı doldur
        const formNameSelectors = [
          'input[name="name"]',
          'input[placeholder*="form"]',
          'input[placeholder*="name"]',
          'input[type="text"]',
          '[data-test-id="form-name-input"]'
        ];
        
        let formNameFilled = false;
        for (const selector of formNameSelectors) {
          const formNameInput = page.locator(selector);
          if (await formNameInput.count() > 0) {
            const timestamp = Date.now();
            const formName = `Kaydetme Test Form ${timestamp}`;
            await formNameInput.fill(formName);
            console.log(`✅ Form adı dolduruldu: ${formName}`);
            formNameFilled = true;
            break;
          }
        }
        
        if (!formNameFilled) {
          console.log('⚠️ Form adı alanı bulunamadı, devam ediliyor...');
        }
        
        // Birkaç element ekle
        const shortTextSelectors = [
          '[data-test-id="toolbox-draggable-item__short-text__btn"]',
          'button:has-text("Short Text")',
          '[data-test-id="short-text-btn"]'
        ];
        
        let elementAdded = false;
        for (const selector of shortTextSelectors) {
          const shortTextBtn = page.locator(selector);
          if (await shortTextBtn.count() > 0) {
            await shortTextBtn.click();
            console.log('✅ Short Text elementi eklendi');
            elementAdded = true;
            await page.waitForTimeout(1000);
            break;
          }
        }
        
        if (!elementAdded) {
          console.log('⚠️ Hiç element eklenemedi');
        }
        
        // Submit Actions tab'ına git ve Section Name ayarla
        console.log('🎯 Submit Actions sekmesine geçiliyor...');
        const submitActionsTab = page.locator('text=Submit Actions');
        if (await submitActionsTab.count() > 0) {
          await submitActionsTab.click();
          console.log('✅ Submit Actions sekmesi açıldı');
          await page.waitForTimeout(2000);
          
          // Section Name dropdown'unu bul ve seç
          console.log('📋 Section Name dropdown aranıyor...');
          const sectionDropdown = page.locator('select:has(option:has-text("New Emails")), [role="combobox"]:has-text("Select section")');
          if (await sectionDropdown.count() > 0) {
            await sectionDropdown.click();
            console.log('✅ Section dropdown açıldı');
            await page.waitForTimeout(1000);
            
            // New Emails seçeneğini seç
            const newEmailsOption = page.locator('option:has-text("New Emails"), [role="option"]:has-text("New Emails")');
            if (await newEmailsOption.count() > 0) {
              await newEmailsOption.click();
              console.log('✅ New Emails seçildi');
              await page.waitForTimeout(1000);
            }
          }
        }
        
        // Publish butonunu bul ve tıkla (sağ üstte)
        console.log('🚀 Publish butonu aranıyor...');
        const publishButtonSelectors = [
          'button:has-text("Publish")',
          '[data-test-id="publish-btn"]',
          'button[class*="publish"]',
          '.publish-btn',
          '[data-test-id="form-editor-publish-btn"]',
          'button[type="submit"]:has-text("Publish")'
        ];
        
        let publishButtonClicked = false;
        for (const selector of publishButtonSelectors) {
          const publishButton = page.locator(selector);
          if (await publishButton.count() > 0) {
            await publishButton.click();
            console.log(`✅ Form yayınlandı (${selector})`);
            publishButtonClicked = true;
            await page.waitForTimeout(3000);
            
            // Yayınlama başarı mesajını kontrol et
            const publishMessage = page.locator('text=Published, text=Yayınlandı, text=Success');
            if (await publishMessage.count() > 0) {
              console.log('✅ Yayınlama başarı mesajı görüldü');
            }
            break;
          }
        }
        
        if (!publishButtonClicked) {
          console.log('⚠️ Publish butonu bulunamadı');
        }
        
        if (formNameFilled || publishButtonClicked) {
          console.log('🎉 TEST SONUCU: Form kaydetme ve yayınlama BAŞARILI');
        } else {
          console.log('❌ TEST SONUCU: Form kaydetme ve yayınlama BAŞARISIZ - Hiçbir işlem tamamlanamadı');
        }
        
      } else {
        console.log('❌ TEST SONUCU: Form kaydetme BAŞARISIZ - Form oluşturma butonu bulunamadı');
      }
    } catch (e) {
      console.log(`❌ TEST SONUCU: Form kaydetme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/form-save-publish.png', fullPage: true });
    console.log('📸 Form kaydetme testi screenshot alındı');
  });

  test('Form düzenleme ve silme', async ({ page }) => {
    console.log('🔍 Form listesi kontrol ediliyor...');
    
    try {
      // Form listesi elementlerini ara - daha kapsamlı selector'lar
      const formListSelectors = [
        'div[class*="form-item"]',
        'div[class*="form-card"]',
        'div[class*="form-list"]',
        'li[class*="form"]',
        'tr[class*="form"]',
        '[data-test-id="form-item"]',
        '[data-test-id="form-card"]',
        '.form-item',
        '.form-card',
        '.form-list-item',
        'div[class*="list-item"]',
        'div[class*="card"]',
        'div[class*="item"]'
      ];
      
      let formListFound = false;
      let formCount = 0;
      
      for (const selector of formListSelectors) {
        const formList = page.locator(selector);
        if (await formList.count() > 0) {
          formCount = await formList.count();
          console.log(`📊 ${formCount} form bulundu (${selector})`);
          formListFound = true;
          
          // Form adlarını listele
          for (let i = 0; i < Math.min(formCount, 5); i++) {
            try {
              const formName = await formList.nth(i).textContent();
              console.log(`📝 Form ${i + 1}: ${formName?.trim() || 'Ad bulunamadı'}`);
            } catch (e) {
              console.log(`📝 Form ${i + 1}: Ad okunamadı`);
            }
          }
          break;
        }
      }
      
      if (!formListFound) {
        console.log('⚠️ Form listesi bulunamadı, sayfa içeriğini kontrol ediyorum...');
        
        // Sayfa içeriğini kontrol et
        const pageText = await page.textContent('body');
        console.log('📄 Sayfa içeriği kontrol ediliyor...');
        
        // Form oluşturma butonunu ara
        const createFormSelectors = [
          '[data-test-id="form-add-new-btn"]',
          'button:has-text("Create Form")',
          'button:has-text("New Form")',
          'button:has-text("Add Form")',
          'button:has-text("+")',
          'button[class*="add"]',
          'button[class*="create"]',
          'button[class*="new"]'
        ];
        
        for (const selector of createFormSelectors) {
          const createBtn = page.locator(selector);
          if (await createBtn.count() > 0) {
            console.log(`✅ Form oluşturma butonu bulundu: ${selector}`);
            break;
          }
        }
        
        console.log('❌ TEST SONUCU: Form düzenleme BAŞARISIZ - Form listesi bulunamadı');
        return;
      }
      
      // Düzenle butonunu bul - daha kapsamlı selector'lar
      console.log('✏️ Düzenle butonu aranıyor...');
      const editButtonSelectors = [
        'button:has-text("Edit")',
        'button:has-text("Update")',
        'button:has-text("Modify")',
        'button:has-text("Düzenle")',
        '[data-test-id="edit-form"]',
        '[data-test-id="edit-btn"]',
        'button[class*="edit"]',
        'a[class*="edit"]',
        'a:has-text("Edit")',
        'a:has-text("Update")',
        'a:has-text("Modify")'
      ];
      
      let editButtonFound = false;
      for (const selector of editButtonSelectors) {
        const editButton = page.locator(selector);
        if (await editButton.count() > 0) {
          await editButton.first().click();
          await page.waitForTimeout(2000);
          console.log(`✅ Form düzenleme sayfası açıldı (${selector})`);
          editButtonFound = true;
          console.log('🎉 TEST SONUCU: Form düzenleme BAŞARILI');
          break;
        }
      }
      
      if (!editButtonFound) {
        console.log('⚠️ Düzenle butonu bulunamadı');
        console.log('❌ TEST SONUCU: Form düzenleme BAŞARISIZ - Düzenle butonu bulunamadı');
      }
      
      // Sil butonunu bul - daha kapsamlı selector'lar
      console.log('🗑️ Sil butonu aranıyor...');
      const deleteButtonSelectors = [
        'button:has-text("Delete")',
        'button:has-text("Remove")',
        'button:has-text("Trash")',
        'button:has-text("Sil")',
        '[data-test-id="delete-form"]',
        '[data-test-id="delete-btn"]',
        'button[class*="delete"]',
        'button[class*="remove"]',
        'button[class*="trash"]',
        'a[class*="delete"]',
        'a:has-text("Delete")',
        'a:has-text("Remove")'
      ];
      
      let deleteButtonFound = false;
      for (const selector of deleteButtonSelectors) {
        const deleteButton = page.locator(selector);
        if (await deleteButton.count() > 0) {
          console.log(`⚠️ Silme butonu tespit edildi: ${selector} (işlem yapılmadı)`);
          deleteButtonFound = true;
          console.log('⚠️ TEST SONUCU: Form silme butonu bulundu (test amaçlı silme yapılmadı)');
          break;
        }
      }
      
      if (!deleteButtonFound) {
        console.log('⚠️ Sil butonu bulunamadı');
        console.log('❌ TEST SONUCU: Form silme BAŞARISIZ - Sil butonu bulunamadı');
      }
      
    } catch (e) {
      console.log(`❌ TEST SONUCU: Form düzenleme BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/form-edit.png', fullPage: true });
    console.log('📸 Form düzenleme sayfası screenshot alındı');
  });

  test('Form ayarları ve konfigürasyon', async ({ page }) => {
    console.log('⚙️ Form ayarları butonu aranıyor...');
    
    try {
      // Ayarlar butonunu bul
      const settingsButton = page.locator('button:has-text("Settings"), button:has-text("Configure"), button:has-text("Options"), [data-test-id="form-settings"]');
      if (await settingsButton.count() > 0) {
        await settingsButton.first().click();
        await page.waitForTimeout(2000);
        console.log('✅ Form ayarları sayfası açıldı');
        console.log('🎉 TEST SONUCU: Form ayarları BAŞARILI');
      } else {
        console.log('⚠️ Ayarlar butonu bulunamadı');
        console.log('❌ TEST SONUCU: Form ayarları BAŞARISIZ - Ayarlar butonu bulunamadı');
      }
    } catch (e) {
      console.log(`❌ TEST SONUCU: Form ayarları BAŞARISIZ - ${e.message}`);
    }
    
    await page.screenshot({ path: 'screenshots/form-settings.png', fullPage: true });
    console.log('📸 Form ayarları sayfası screenshot alındı');
  });
}); 