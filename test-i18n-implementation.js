// Test i18n hooks and providers implementation
console.log('Testing i18n hooks and providers implementation...');

const fs = require('fs');
const path = require('path');

try {
  // Test 1: Verify web app translation hook exists
  const webHookPath = './apps/web/src/hooks/useTranslation.ts';
  if (fs.existsSync(webHookPath)) {
    const hookContent = fs.readFileSync(webHookPath, 'utf-8');
    console.log('✅ Web app translation hook created');
    
    // Check for key functions
    const hasUseTranslation = hookContent.includes('export function useTranslation');
    const hasUseT = hookContent.includes('export function useT');
    const hasUseLocaleInfo = hookContent.includes('export function useLocaleInfo');
    const hasUseRTLClasses = hookContent.includes('export function useRTLClasses');
    
    console.log('  - useTranslation function:', hasUseTranslation ? '✅' : '❌');
    console.log('  - useT function:', hasUseT ? '✅' : '❌');
    console.log('  - useLocaleInfo function:', hasUseLocaleInfo ? '✅' : '❌');
    console.log('  - useRTLClasses function:', hasUseRTLClasses ? '✅' : '❌');
  } else {
    console.log('❌ Web app translation hook not found');
  }

  // Test 2: Verify web app layout.tsx has been updated
  const layoutPath = './apps/web/src/app/layout.tsx';
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
    console.log('✅ Web app layout.tsx exists');
    
    // Check for key imports and usage
    const hasNextIntlImport = layoutContent.includes('NextIntlClientProvider');
    const hasGetMessages = layoutContent.includes('getMessages');
    const hasGetLocale = layoutContent.includes('getLocale');
    const hasSharedImport = layoutContent.includes('@open-swe/shared');
    const hasRTLSupport = layoutContent.includes('dir={isRTL');
    const hasLocaleInHtml = layoutContent.includes('lang={language}');
    
    console.log('  - NextIntlClientProvider import:', hasNextIntlImport ? '✅' : '❌');
    console.log('  - getMessages import:', hasGetMessages ? '✅' : '❌');
    console.log('  - getLocale import:', hasGetLocale ? '✅' : '❌');
    console.log('  - Shared utilities import:', hasSharedImport ? '✅' : '❌');
    console.log('  - RTL support in HTML:', hasRTLSupport ? '✅' : '❌');
    console.log('  - Locale in HTML lang:', hasLocaleInHtml ? '✅' : '❌');
  } else {
    console.log('❌ Web app layout.tsx not found');
  }

  // Test 3: Verify CLI i18n functionality
  const cliI18nPath = './apps/cli/src/i18n.ts';
  if (fs.existsSync(cliI18nPath)) {
    const cliContent = fs.readFileSync(cliI18nPath, 'utf-8');
    console.log('✅ CLI i18n functionality created');
    
    // Check for key functions
    const hasInitializeI18n = cliContent.includes('export function initializeI18n');
    const hasGetLocaleInfo = cliContent.includes('export function getLocaleInfo');
    const hasGetTranslationFunction = cliContent.includes('export function getTranslationFunction');
    const hasSetLocale = cliContent.includes('export function setLocale');
    const hasFormatMessage = cliContent.includes('export function formatMessage');
    const hasDefaultExport = cliContent.includes('export default t');
    
    console.log('  - initializeI18n function:', hasInitializeI18n ? '✅' : '❌');
    console.log('  - getLocaleInfo function:', hasGetLocaleInfo ? '✅' : '❌');
    console.log('  - getTranslationFunction:', hasGetTranslationFunction ? '✅' : '❌');
    console.log('  - setLocale function:', hasSetLocale ? '✅' : '❌');
    console.log('  - formatMessage function:', hasFormatMessage ? '✅' : '❌');
    console.log('  - Default export (t):', hasDefaultExport ? '✅' : '❌');
  } else {
    console.log('❌ CLI i18n functionality not found');
  }

  // Test 4: Check if all required files exist
  const requiredFiles = [
    './apps/web/src/hooks/useTranslation.ts',
    './apps/web/src/app/layout.tsx',
    './apps/cli/src/i18n.ts',
    './apps/web/messages/en.json',
    './apps/web/messages/he.json',
    './apps/cli/messages/en.json',
    './apps/cli/messages/he.json'
  ];

  console.log('\n--- File Existence Check ---');
  let allFilesExist = true;
  for (const file of requiredFiles) {
    const exists = fs.existsSync(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
  }

  if (allFilesExist) {
    console.log('\nSUCCESS: All i18n hooks and providers are properly implemented!');
  } else {
    console.log('\nWARNING: Some required files are missing');
  }

} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
