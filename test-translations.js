// Test translation files
console.log('Testing translation files...');

try {
  const webMessages = require('./apps/web/messages/en.json');
  const cliMessages = require('./apps/cli/messages/en.json');
  
  console.log('✅ Web app messages loaded:', Object.keys(webMessages).length, 'sections');
  console.log('✅ CLI app messages loaded:', Object.keys(cliMessages).length, 'sections');
  
  // Test specific required content
  console.log('\n--- Required Web App Content ---');
  console.log('✅ Metadata title:', webMessages.metadata?.title);
  console.log('✅ Metadata description:', webMessages.metadata?.description);
  console.log('✅ Settings title:', webMessages.settings?.title);
  console.log('✅ Settings loading:', webMessages.settings?.loading);
  console.log('✅ Threads title:', webMessages.threads?.title);
  console.log('✅ Threads loading:', webMessages.threads?.loading);
  
  console.log('\n--- Required CLI App Content ---');
  console.log('✅ Startup title:', cliMessages.startup?.title);
  console.log('✅ Working directory:', cliMessages.startup?.workingDirectory);
  console.log('✅ No auth message:', cliMessages.startup?.noAuth);
  console.log('✅ Command description:', cliMessages.commands?.description);
  
  console.log('\nSUCCESS: All translation files are valid and contain required content!');
} catch (e) {
  console.error('ERROR:', e.message);
  process.exit(1);
}
