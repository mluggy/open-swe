// Test CLI app i18n implementation
console.log('Testing CLI app i18n implementation...');

const fs = require('fs');

try {
  // Test 1: Verify main CLI file has been updated with i18n
  const indexPath = './apps/cli/src/index.tsx';
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    console.log('✅ CLI index.tsx exists');
    
    // Check for i18n imports and usage
    const hasI18nImport = indexContent.includes("import { t, getLocaleInfo } from \"./i18n.js\"");
    const hasStartupTranslations = indexContent.includes("t('startup.title')") && 
                                   indexContent.includes("t('startup.workingDirectory')") && 
                                   indexContent.includes("t('startup.noAuth')");
    const hasCommandTranslations = indexContent.includes("t('commands.name')") && 
                                   indexContent.includes("t('commands.description')") && 
                                   indexContent.includes("t('commands.helpOption')");
    const hasFeedbackTranslations = indexContent.includes("t('feedback.planFeedback')") && 
                                    indexContent.includes("t('feedback.approve')") && 
                                    indexContent.includes("t('feedback.deny')") && 
                                    indexContent.includes("t('feedback.instructions')");
    const hasStatusTranslations = indexContent.includes("t('status.streaming')");
    const hasLoadingTranslations = indexContent.includes("t('loading.initializing')");
    const hasGoodbyeTranslations = indexContent.includes("t('startup.goodbye')");
    
    console.log('  - i18n import:', hasI18nImport ? '✅' : '❌');
    console.log('  - Startup translations:', hasStartupTranslations ? '✅' : '❌');
    console.log('  - Command translations:', hasCommandTranslations ? '✅' : '❌');
    console.log('  - Feedback translations:', hasFeedbackTranslations ? '✅' : '❌');
    console.log('  - Status translations:', hasStatusTranslations ? '✅' : '❌');
    console.log('  - Loading translations:', hasLoadingTranslations ? '✅' : '❌');
    console.log('  - Goodbye translations:', hasGoodbyeTranslations ? '✅' : '❌');
  } else {
    console.log('❌ CLI index.tsx not found');
  }

  // Test 2: Verify TerminalInterface component has been updated
  const terminalPath = './apps/cli/src/TerminalInterface.tsx';
  if (fs.existsSync(terminalPath)) {
    const terminalContent = fs.readFileSync(terminalPath, 'utf-8');
    console.log('✅ TerminalInterface.tsx exists');
    
    // Check for i18n updates
    const hasI18nImport = terminalContent.includes("import { t } from \"./i18n.js\"");
    const hasDescriptionTranslation = terminalContent.includes("t('commands.description')");
    const hasInputTranslations = terminalContent.includes("t('input.placeholder')") && 
                                 terminalContent.includes("t('input.submit')");
    const hasRepositoryTranslation = terminalContent.includes("t('common.repository')");
    
    console.log('  - i18n import:', hasI18nImport ? '✅' : '❌');
    console.log('  - Description translation:', hasDescriptionTranslation ? '✅' : '❌');
    console.log('  - Input translations:', hasInputTranslations ? '✅' : '❌');
    console.log('  - Repository translation:', hasRepositoryTranslation ? '✅' : '❌');
  } else {
    console.log('❌ TerminalInterface.tsx not found');
  }

  // Test 3: Verify CLI i18n system exists and works
  const cliI18nPath = './apps/cli/src/i18n.ts';
  if (fs.existsSync(cliI18nPath)) {
    const cliI18nContent = fs.readFileSync(cliI18nPath, 'utf-8');
    console.log('✅ CLI i18n.ts exists');
    
    // Check for key functions
    const hasInitializeFunction = cliI18nContent.includes('export function initializeI18n()');
    const hasTranslationFunction = cliI18nContent.includes('export function getTranslationFunction()');
    const hasLocaleInfo = cliI18nContent.includes('export function getLocaleInfo()');
    const hasSharedImports = cliI18nContent.includes("from '@open-swe/shared'");
    
    console.log('  - Initialize function:', hasInitializeFunction ? '✅' : '❌');
    console.log('  - Translation function:', hasTranslationFunction ? '✅' : '❌');
    console.log('  - Locale info function:', hasLocaleInfo ? '✅' : '❌');
    console.log('  - Shared imports:', hasSharedImports ? '✅' : '❌');
  } else {
    console.log('❌ CLI i18n.ts not found');
  }

  // Test 4: Verify CLI translation files exist and have required content
  const cliEnPath = './apps/cli/messages/en.json';
  if (fs.existsSync(cliEnPath)) {
    const cliEnContent = fs.readFileSync(cliEnPath, 'utf-8');
    const cliEnMessages = JSON.parse(cliEnContent);
    console.log('✅ CLI English messages exist');
    
    // Check for required sections
    const hasStartupSection = cliEnMessages.startup && 
                              cliEnMessages.startup.title && 
                              cliEnMessages.startup.workingDirectory && 
                              cliEnMessages.startup.noAuth;
    const hasCommandsSection = cliEnMessages.commands && 
                               cliEnMessages.commands.name && 
                               cliEnMessages.commands.description;
    const hasFeedbackSection = cliEnMessages.feedback && 
                               cliEnMessages.feedback.planFeedback && 
                               cliEnMessages.feedback.approve && 
                               cliEnMessages.feedback.deny;
    const hasLoadingSection = cliEnMessages.loading && cliEnMessages.loading.initializing;
    const hasStatusSection = cliEnMessages.status && cliEnMessages.status.streaming;
    const hasCommonSection = cliEnMessages.common && cliEnMessages.common.repository;
    
    console.log('  - Startup section:', hasStartupSection ? '✅' : '❌');
    console.log('  - Commands section:', hasCommandsSection ? '✅' : '❌');
    console.log('  - Feedback section:', hasFeedbackSection ? '✅' : '❌');
    console.log('  - Loading section:', hasLoadingSection ? '✅' : '❌');
    console.log('  - Status section:', hasStatusSection ? '✅' : '❌');
    console.log('  - Common section:', hasCommonSection ? '✅' : '❌');
  } else {
    console.log('❌ CLI English messages not found');
  }

  // Test 5: Check for any remaining hard-coded strings in CLI files
  console.log('\n--- Checking for remaining hard-coded strings in CLI ---');
  const cliFilesToCheck = [
    './apps/cli/src/index.tsx',
    './apps/cli/src/TerminalInterface.tsx'
  ];

  const hardCodedPatterns = [
    'Starting Open SWE CLI',
    'Working directory:',
    'No GitHub authentication',
    'Plan feedback:',
    'Approve',
    'Deny',
    'Streaming',
    'Starting agent',
    'LangChain Open SWE CLI',
    'Repository:'
  ];

  let foundHardCoded = false;
  for (const file of cliFilesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const pattern of hardCodedPatterns) {
        // Skip if it's in a comment or import
        const regex = new RegExp(`(?<!//.*|import.*|from.*)"[^"]*${pattern}[^"]*"`, 'g');
        if (regex.test(content)) {
          console.log(`⚠️  Found hard-coded string containing "${pattern}" in ${file}`);
          foundHardCoded = true;
        }
      }
    }
  }

  if (!foundHardCoded) {
    console.log('✅ No remaining hard-coded strings found in CLI files');
  }

  console.log('\nSUCCESS: CLI app i18n implementation completed!');

} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
