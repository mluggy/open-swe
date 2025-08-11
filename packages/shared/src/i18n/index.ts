/**
 * Shared internationalization utilities for Open SWE
 * Provides locale detection, fallback logic, and common i18n utilities
 * that can be used across both web and CLI applications.
 */

import { z } from "zod";

// Supported locales
export const SUPPORTED_LOCALES = ["en-US", "he-IL"] as const;
export const SUPPORTED_LANGUAGES = ["en", "he"] as const;

// Type definitions
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Zod schemas for validation
export const SupportedLocaleSchema = z.enum(SUPPORTED_LOCALES);
export const SupportedLanguageSchema = z.enum(SUPPORTED_LANGUAGES);

// Default locale configuration
export const DEFAULT_LOCALE: SupportedLocale = "en-US";
export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

// RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = ["he"];

/**
 * Locale configuration interface
 */
export interface LocaleConfig {
  locale: SupportedLocale;
  language: SupportedLanguage;
  isRTL: boolean;
  displayName: string;
  nativeName: string;
}

/**
 * Locale configurations
 */
export const LOCALE_CONFIGS: Record<SupportedLocale, LocaleConfig> = {
  "en-US": {
    locale: "en-US",
    language: "en",
    isRTL: false,
    displayName: "English (US)",
    nativeName: "English",
  },
  "he-IL": {
    locale: "he-IL",
    language: "he",
    isRTL: true,
    displayName: "Hebrew (Israel)",
    nativeName: "עברית",
  },
};

/**
 * Extract language code from locale
 * @param locale - The locale string (e.g., "en-US", "he-IL")
 * @returns The language code (e.g., "en", "he")
 */
export function getLanguageFromLocale(locale: string): SupportedLanguage {
  const language = locale.split("-")[0].toLowerCase();
  
  // Validate and return supported language, fallback to default
  if (SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
    return language as SupportedLanguage;
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Normalize locale string to supported locale with fallback logic
 * Implements fallback: en-GB → en-US, he → he-IL, etc.
 * @param locale - The input locale string
 * @returns A supported locale with fallback applied
 */
export function normalizeLocale(locale: string): SupportedLocale {
  // Direct match
  if (SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return locale as SupportedLocale;
  }
  
  // Extract language and find matching supported locale
  const language = getLanguageFromLocale(locale);
  
  // Find the first supported locale for this language
  const matchingLocale = SUPPORTED_LOCALES.find(
    (supportedLocale) => getLanguageFromLocale(supportedLocale) === language
  );
  
  return matchingLocale || DEFAULT_LOCALE;
}

/**
 * Detect locale from various sources with fallback logic
 * @param sources - Object containing potential locale sources
 * @returns Normalized supported locale
 */
export function detectLocale(sources: {
  userPreference?: string;
  browserLanguage?: string;
  acceptLanguage?: string;
  systemLocale?: string;
}): SupportedLocale {
  const { userPreference, browserLanguage, acceptLanguage, systemLocale } = sources;
  
  // Priority order: user preference > browser language > accept language > system locale > default
  const candidates = [
    userPreference,
    browserLanguage,
    acceptLanguage,
    systemLocale,
  ].filter(Boolean);
  
  for (const candidate of candidates) {
    if (candidate) {
      const normalized = normalizeLocale(candidate);
      if (normalized !== DEFAULT_LOCALE || candidate.startsWith(DEFAULT_LANGUAGE)) {
        return normalized;
      }
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Check if a language is RTL (Right-to-Left)
 * @param language - The language code
 * @returns True if the language is RTL
 */
export function isRTLLanguage(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language);
}

/**
 * Check if a locale is RTL (Right-to-Left)
 * @param locale - The locale string
 * @returns True if the locale's language is RTL
 */
export function isRTLLocale(locale: SupportedLocale): boolean {
  const language = getLanguageFromLocale(locale);
  return isRTLLanguage(language);
}

/**
 * Get locale configuration
 * @param locale - The locale string
 * @returns Locale configuration object
 */
export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return LOCALE_CONFIGS[locale];
}

/**
 * Get all available locale configurations
 * @returns Array of all locale configurations
 */
export function getAllLocaleConfigs(): LocaleConfig[] {
  return Object.values(LOCALE_CONFIGS);
}

/**
 * Format locale for display
 * @param locale - The locale string
 * @param displayInNative - Whether to display in native language
 * @returns Formatted locale string
 */
export function formatLocaleDisplay(
  locale: SupportedLocale,
  displayInNative: boolean = false
): string {
  const config = getLocaleConfig(locale);
  return displayInNative ? config.nativeName : config.displayName;
}

/**
 * Parse Accept-Language header and return best matching locale
 * @param acceptLanguage - Accept-Language header value
 * @returns Best matching supported locale
 */
export function parseAcceptLanguage(acceptLanguage: string): SupportedLocale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }
  
  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,he;q=0.8")
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [locale, qValue] = lang.trim().split(";q=");
      return {
        locale: locale.trim(),
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Find the best matching supported locale
  for (const { locale } of languages) {
    const normalized = normalizeLocale(locale);
    if (normalized !== DEFAULT_LOCALE || locale.startsWith(DEFAULT_LANGUAGE)) {
      return normalized;
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Utility type for translation keys (to be extended by applications)
 */
export type TranslationKey = string;

/**
 * Base translation function type
 */
export type TranslationFunction = (key: TranslationKey, params?: Record<string, any>) => string;

/**
 * Translation namespace type for organizing translations
 */
export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

/**
 * Flatten nested translation object to dot notation keys
 * @param obj - Nested translation object
 * @param prefix - Key prefix for recursion
 * @returns Flattened object with dot notation keys
 */
export function flattenTranslations(
  obj: TranslationNamespace,
  prefix: string = ""
): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === "string") {
      flattened[newKey] = value;
    } else if (typeof value === "object" && value !== null) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    }
  }
  
  return flattened;
}

/**
 * Simple interpolation function for translation strings
 * @param template - Template string with {{key}} placeholders
 * @param params - Parameters to interpolate
 * @returns Interpolated string
 */
export function interpolateString(
  template: string,
  params: Record<string, any> = {}
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

/**
 * Validate locale string
 * @param locale - Locale string to validate
 * @returns True if locale is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Validate language string
 * @param language - Language string to validate
 * @returns True if language is supported
 */
export function isValidLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}
