import { readFileSync } from 'fs';
import { join } from 'path';
import { 
  detectLocale, 
  getLanguageFromLocale, 
  isRTLLanguage,
  type SupportedLanguage 
} from '@open-swe/shared';

// Cache for loaded translations
const translationCache = new Map<string, Record<string, any>>();

// Current locale state
let currentLocale: string | null = null;
let currentLanguage: SupportedLanguage | null = null;

/**
 * Initialize i18n system with locale detection
 */
export function initializeI18n(): void {
  // Detect locale from environment or system
  currentLocale = detectLocale();
  currentLanguage = getLanguageFromLocale(currentLocale) as SupportedLanguage;
  
  // Pre-load the detected language translations
  loadTranslations(currentLanguage);
}

/**
 * Load translations for a specific language
 */
function loadTranslations(language: SupportedLanguage): Record<string, any> {
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  try {
    const messagesPath = join(__dirname, '..', 'messages', `${language}.json`);
    const messagesContent = readFileSync(messagesPath, 'utf-8');
    const messages = JSON.parse(messagesContent);
    
    translationCache.set(language, messages);
    return messages;
  } catch (error) {
    // Fallback to English if translation file not found
    if (language !== 'en') {
      console.warn(`Translation file for ${language} not found, falling back to English`);
      return loadTranslations('en');
    }
    
    // If even English fails, return empty object
    console.error('Failed to load any translation files:', error);
    return {};
  }
}

/**
 * Get current locale information
 */
export function getLocaleInfo() {
  if (!currentLocale || !currentLanguage) {
    initializeI18n();
  }
  
  return {
    locale: currentLocale!,
    language: currentLanguage!,
    isRTL: isRTLLanguage(currentLanguage!),
    dir: isRTLLanguage(currentLanguage!) ? 'rtl' : 'ltr',
  };
}

/**
 * Get translation function for current language
 */
export function getTranslationFunction() {
  if (!currentLanguage) {
    initializeI18n();
  }
  
  const messages = loadTranslations(currentLanguage!);
  
  return function t(key: string, params?: Record<string, string | number>): string {
    // Navigate through nested object using dot notation
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key if translation not found
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // If value is not a string, return the key
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }
    
    // Replace parameters in the translation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };
}

/**
 * Set locale and reload translations
 */
export function setLocale(locale: string): void {
  currentLocale = locale;
  currentLanguage = getLanguageFromLocale(locale) as SupportedLanguage;
  
  // Pre-load translations for the new language
  loadTranslations(currentLanguage);
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): SupportedLanguage[] {
  return ['en', 'he'];
}

/**
 * Format message with parameters
 */
export function formatMessage(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey]?.toString() || match;
  });
}

/**
 * Get RTL-aware text alignment
 */
export function getTextAlignment(): 'left' | 'right' {
  const { isRTL } = getLocaleInfo();
  return isRTL ? 'right' : 'left';
}

/**
 * Get direction-aware spacing
 */
export function getDirectionalSpacing(start: number, end: number): { paddingLeft: number; paddingRight: number } {
  const { isRTL } = getLocaleInfo();
  
  if (isRTL) {
    return {
      paddingLeft: end,
      paddingRight: start,
    };
  }
  
  return {
    paddingLeft: start,
    paddingRight: end,
  };
}

// Initialize on module load
initializeI18n();

// Export the translation function as default
export const t = getTranslationFunction();
export default t;
