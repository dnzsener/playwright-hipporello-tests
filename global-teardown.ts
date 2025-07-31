import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Test sonrası temizlik işlemleri
  console.log('Global teardown tamamlandı');
  
  // Test raporlarını oluştur
  console.log('Test raporları hazırlanıyor...');
  
  // Screenshot'ları temizle (opsiyonel)
  // await fs.rm('./screenshots', { recursive: true, force: true });
}

export default globalTeardown; 