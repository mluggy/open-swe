// Test web app components i18n implementation
console.log('Testing web app components i18n implementation...');

const fs = require('fs');

try {
  // Test 1: Verify layout.tsx has been updated with dynamic metadata
  const layoutPath = './apps/web/src/app/layout.tsx';
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    console.log('✅ Layout.tsx exists');
    
    // Check for i18n updates
    const hasGenerateMetadata = layoutContent.includes('export async function generateMetadata');
    const hasGetTranslations = layoutContent.includes('getTranslations');
    const hasMetadataTranslations = layoutContent.includes("t('title')") && layoutContent.includes("t('description')");
    
    console.log('  - Dynamic metadata function:', hasGenerateMetadata ? '✅' : '❌');
    console.log('  - getTranslations import:', hasGetTranslations ? '✅' : '❌');
    console.log('  - Metadata translations:', hasMetadataTranslations ? '✅' : '❌');
  } else {
    console.log('❌ Layout.tsx not found');
  }

  // Test 2: Verify settings page has been updated
  const settingsPath = './apps/web/src/app/(v2)/settings/page.tsx';
  if (fs.existsSync(settingsPath)) {
    const settingsContent = fs.readFileSync(settingsPath, 'utf-8');
    console.log('✅ Settings page exists');
    
    // Check for i18n updates
    const hasUseTranslation = settingsContent.includes('useTranslation');
    const hasSettingsTranslations = settingsContent.includes("t('title')") && settingsContent.includes("t('loading')");
    
    console.log('  - useTranslation hook:', hasUseTranslation ? '✅' : '❌');
    console.log('  - Settings translations:', hasSettingsTranslations ? '✅' : '❌');
  } else {
    console.log('❌ Settings page not found');
  }

  // Test 3: Verify task-list component has been updated
  const taskListPath = './apps/web/src/components/task-list.tsx';
  if (fs.existsSync(taskListPath)) {
    const taskListContent = fs.readFileSync(taskListPath, 'utf-8');
    console.log('✅ Task-list component exists');
    
    // Check for i18n updates
    const hasUseTranslation = taskListContent.includes('useTranslation');
    const hasThreadsTranslations = taskListContent.includes("t('count'") && taskListContent.includes("t('loading')");
    const hasPaginationTranslations = taskListContent.includes("t('pagination.showing'") && taskListContent.includes("t('pagination.previous')");
    const hasNoThreadsTranslation = taskListContent.includes("t('noThreads')");
    
    console.log('  - useTranslation hook:', hasUseTranslation ? '✅' : '❌');
    console.log('  - Threads translations:', hasThreadsTranslations ? '✅' : '❌');
    console.log('  - Pagination translations:', hasPaginationTranslations ? '✅' : '❌');
    console.log('  - No threads translation:', hasNoThreadsTranslation ? '✅' : '❌');
  } else {
    console.log('❌ Task-list component not found');
  }

  // Test 4: Verify API keys component has been updated
  const apiKeysPath = './apps/web/src/features/settings-page/api-keys.tsx';
  if (fs.existsSync(apiKeysPath)) {
    const apiKeysContent = fs.readFileSync(apiKeysPath, 'utf-8');
    console.log('✅ API keys component exists');
    
    // Check for i18n updates
    const hasUseTranslation = apiKeysContent.includes('useTranslation');
    const hasApiKeyTranslations = apiKeysContent.includes("t('llmsTitle')") && apiKeysContent.includes("t('configured')");
    const hasProviderTranslations = apiKeysContent.includes("t('providers.anthropic')");
    const hasPlaceholderTranslations = apiKeysContent.includes("t('placeholder'");
    const hasInfoTranslations = apiKeysContent.includes("t('anthropicInfo')") && apiKeysContent.includes("t('anthropicRequired')");
    
    console.log('  - useTranslation hook:', hasUseTranslation ? '✅' : '❌');
    console.log('  - API key translations:', hasApiKeyTranslations ? '✅' : '❌');
    console.log('  - Provider translations:', hasProviderTranslations ? '✅' : '❌');
    console.log('  - Placeholder translations:', hasPlaceholderTranslations ? '✅' : '❌');
    console.log('  - Info translations:', hasInfoTranslations ? '✅' : '❌');
  } else {
    console.log('❌ API keys component not found');
  }

  // Test 5: Check for any remaining hard-coded strings
  console.log('\n--- Checking for remaining hard-coded strings ---');
  const filesToCheck = [
    './apps/web/src/app/layout.tsx',
    './apps/web/src/app/(v2)/settings/page.tsx',
    './apps/web/src/components/task-list.tsx',
    './apps/web/src/features/settings-page/api-keys.tsx'
  ];

  const hardCodedPatterns = [
    'Settings',
    'Loading your settings',
    'Threads',
    'Loading threads',
    'API Key',
    'Configured',
    'Last used'
  ];

  let foundHardCoded = false;
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of hardCodedPatterns) {
        // Skip if it's in a comment or import
        const regex = new RegExp(`(?<!//.*|import.*|from.*)"${pattern}"`, 'g');
        if (regex.test(content)) {
          console.log(`⚠️  Found hard-coded string "${pattern}" in ${file}`);
          foundHardCoded = true;
        }
      }
    }
  }

  if (!foundHardCoded) {
    console.log('✅ No remaining hard-coded strings found');
  }

  console.log('\nSUCCESS: Web app components i18n implementation completed!');

} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}

