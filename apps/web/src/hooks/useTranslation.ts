import { useTranslations, useLocale } from 'next-intl';
import { 
  getLanguageFromLocale, 
  isRTLLanguage, 
  type SupportedLanguage 
} from '@open-swe/shared';

/**
 * Custom hook that wraps next-intl's useTranslations with additional utilities
 * Provides type-safe translations and RTL detection
 */
export function useTranslation(namespace?: string) {
  const t = useTranslations(namespace);
  const locale = useLocale();
  const language = getLanguageFromLocale(locale) as SupportedLanguage;
  const isRTL = isRTLLanguage(language);

  return {
    t,
    locale,
    language,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
  };
}

/**
 * Hook for getting translation function without namespace
 * Useful for components that need translations from multiple namespaces
 */
export function useT(namespace?: string) {
  return useTranslations(namespace);
}

/**
 * Hook for getting locale information
 */
export function useLocaleInfo() {
  const locale = useLocale();
  const language = getLanguageFromLocale(locale) as SupportedLanguage;
  const isRTL = isRTLLanguage(language);

  return {
    locale,
    language,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
  };
}

/**
 * Hook for getting RTL-aware CSS classes
 */
export function useRTLClasses() {
  const { isRTL } = useLocaleInfo();
  
  return {
    textAlign: isRTL ? 'text-right' : 'text-left',
    textStart: 'text-start',
    textEnd: 'text-end',
    marginStart: isRTL ? 'mr-' : 'ml-',
    marginEnd: isRTL ? 'ml-' : 'mr-',
    paddingStart: isRTL ? 'pr-' : 'pl-',
    paddingEnd: isRTL ? 'pl-' : 'pr-',
    direction: isRTL ? 'rtl' : 'ltr',
    directionClass: isRTL ? 'rtl' : 'ltr',
  };
}
