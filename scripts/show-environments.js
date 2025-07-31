console.log('🌍 Mevcut Test Ortamları:');
console.log('========================');

const environments = [
  {
    name: 'prod',
    url: 'https://admin.hipporello.com/',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'Production Environment'
  },
  {
    name: 'staging',
    url: 'https://admin.hipporellostaging.com/tickets',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'Staging Environment'
  },
  {
    name: 'qa',
    url: 'https://qaadmin.hipporello.io/',
    workspace: 'TESTMANDESKASANAPR12a',
    description: 'QA Environment'
  }
];

environments.forEach((env, index) => {
  console.log(`${index + 1}. ${env.name.toUpperCase()}`);
  console.log(`   📍 URL: ${env.url}`);
  console.log(`   🏢 Workspace: ${env.workspace}`);
  console.log(`   📝 Açıklama: ${env.description}`);
  console.log('');
});

console.log('🚀 Kullanım:');
console.log('npm run test:prod     - Production ortamında test');
console.log('npm run test:staging  - Staging ortamında test');
console.log('npm run test:qa       - QA ortamında test');
console.log('npm run test:all-env  - Tüm ortamlarda test');
console.log('');
console.log('💡 Environment Variable ile:');
console.log('TEST_ENV=prod npm run test:multi');
console.log('TEST_ENV=staging npm run test:multi');
console.log('TEST_ENV=qa npm run test:multi'); 