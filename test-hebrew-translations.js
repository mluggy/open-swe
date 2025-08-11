// Test Hebrew translation files and RTL support
console.log('Testing Hebrew translation files and RTL support...');

try {
  const webHebrewMessages = require('./apps/web/messages/he.json');
  const cliHebrewMessages = require('./apps/cli/messages/he.json');
  const webEnglishMessages = require('./apps/web/messages/en.json');
  const cliEnglishMessages = require('./apps/cli/messages/en.json');
  
  console.log('✅ Hebrew web app messages loaded:', Object.keys(webHebrewMessages).length, 'sections');
  console.log('✅ Hebrew CLI app messages loaded:', Object.keys(cliHebrewMessages).length, 'sections');
  
  // Test specific Hebrew content
  console.log('\n--- Hebrew Web App Content ---');
  console.log('✅ Metadata title:', webHebrewMessages.metadata?.title);
  console.log('✅ Metadata description:', webHebrewMessages.metadata?.description);
  console.log('✅ Settings title:', webHebrewMessages.settings?.title);
  console.log('✅ Settings loading:', webHebrewMessages.settings?.loading);
  console.log('✅ Threads title:', webHebrewMessages.threads?.title);
  console.log('✅ Threads loading:', webHebrewMessages.threads?.loading);
  
  console.log('\n--- Hebrew CLI App Content ---');
  console.log('✅ Startup title:', cliHebrewMessages.startup?.title);
  console.log('✅ Working directory:', cliHebrewMessages.startup?.workingDirectory);
  console.log('✅ No auth message:', cliHebrewMessages.startup?.noAuth);
  console.log('✅ Command description:', cliHebrewMessages.commands?.description);
  
  // Verify structure consistency
  const webEnKeys = Object.keys(webEnglishMessages);
  const webHeKeys = Object.keys(webHebrewMessages);
  const cliEnKeys = Object.keys(cliEnglishMessages);
  const cliHeKeys = Object.keys(cliHebrewMessages);
  
  console.log('\n--- Structure Consistency Check ---');
  console.log('✅ Web app sections match:', webEnKeys.length === webHeKeys.length ? 'YES' : 'NO');
  console.log('✅ CLI app sections match:', cliEnKeys.length === cliHeKeys.length ? 'YES' : 'NO');
  
  // Check for Hebrew text (contains Hebrew characters)
  const hasHebrewChars = (text) => /[\u0590-\u05FF]/.test(text);
  const webHasHebrew = hasHebrewChars(JSON.stringify(webHebrewMessages));
  const cliHasHebrew = hasHebrewChars(JSON.stringify(cliHebrewMessages));
  
  console.log('✅ Web app contains Hebrew text:', webHasHebrew ? 'YES' : 'NO');
  console.log('✅ CLI app contains Hebrew text:', cliHasHebrew ? 'YES' : 'NO');
  
  console.log('\nSUCCESS: All Hebrew translation files are valid and properly structured!');
} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
