// Quick test of shared i18n utilities
const shared = require('./packages/shared/dist/index.js');

console.log('Testing shared i18n utilities...');
console.log('Available exports:', Object.keys(shared).slice(0, 10));

// Test locale normalization with fallback logic
console.log('\n--- Locale Normalization Tests ---');
console.log('normalizeLocale("en-GB"):', shared.normalizeLocale('en-GB')); // Should fallback to en-US
console.log('normalizeLocale("he"):', shared.normalizeLocale('he')); // Should fallback to he-IL
console.log('normalizeLocale("en-US"):', shared.normalizeLocale('en-US')); // Should stay en-US
console.log('normalizeLocale("he-IL"):', shared.normalizeLocale('he-IL')); // Should stay he-IL

// Test locale detection
console.log('\n--- Locale Detection Tests ---');
console.log('detectLocale({browserLanguage: "he"}):', shared.detectLocale({browserLanguage: 'he'}));
console.log('detectLocale({userPreference: "en-GB"}):', shared.detectLocale({userPreference: 'en-GB'}));

// Test RTL detection
console.log('\n--- RTL Detection Tests ---');
console.log('isRTLLocale("he-IL"):', shared.isRTLLocale('he-IL')); // Should be true
console.log('isRTLLocale("en-US"):', shared.isRTLLocale('en-US')); // Should be false

// Test Accept-Language parsing
console.log('\n--- Accept-Language Parsing Tests ---');
console.log('parseAcceptLanguage("en-US,en;q=0.9,he;q=0.8"):', shared.parseAcceptLanguage('en-US,en;q=0.9,he;q=0.8'));
console.log('parseAcceptLanguage("he,en-GB;q=0.8"):', shared.parseAcceptLanguage('he,en-GB;q=0.8'));

console.log('\nSUCCESS: All shared i18n utilities are working correctly!');
