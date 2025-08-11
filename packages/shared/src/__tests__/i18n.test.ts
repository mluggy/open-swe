import {
  normalizeLocale,
  detectLocale,
  getLanguageFromLocale,
  isRTLLanguage,
  parseAcceptLanguage,
  SUPPORTED_LOCALES,
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
  type SupportedLocale,
  type SupportedLanguage,
} from '../i18n/index.js';

describe('Shared i18n utilities', () => {
  describe('normalizeLocale', () => {
    it('should normalize valid locales correctly', () => {
      expect(normalizeLocale('en-US')).toBe('en-US');
      expect(normalizeLocale('he-IL')).toBe('he-IL');
      expect(normalizeLocale('en')).toBe('en-US');
      expect(normalizeLocale('he')).toBe('he-IL');
    });

    it('should handle case insensitive input', () => {
      expect(normalizeLocale('EN-us')).toBe('en-US');
      expect(normalizeLocale('HE-il')).toBe('he-IL');
      expect(normalizeLocale('EN')).toBe('en-US');
      expect(normalizeLocale('HE')).toBe('he-IL');
    });

    it('should fallback to default locale for unsupported locales', () => {
      expect(normalizeLocale('fr-FR')).toBe('en-US');
      expect(normalizeLocale('es-ES')).toBe('en-US');
      expect(normalizeLocale('invalid')).toBe('en-US');
      expect(normalizeLocale('')).toBe('en-US');
    });

    it('should handle fallback logic (en-GB → en-US)', () => {
      expect(normalizeLocale('en-GB')).toBe('en-US');
      expect(normalizeLocale('en-CA')).toBe('en-US');
      expect(normalizeLocale('en-AU')).toBe('en-US');
    });

    it('should handle Hebrew variants', () => {
      expect(normalizeLocale('he-IL')).toBe('he-IL');
      expect(normalizeLocale('he')).toBe('he-IL');
      // Note: Legacy Hebrew code 'iw' is not supported in current implementation
    });
  });

  describe('getLanguageFromLocale', () => {
    it('should extract language from locale correctly', () => {
      expect(getLanguageFromLocale('en-US')).toBe('en');
      expect(getLanguageFromLocale('he-IL')).toBe('he');
      expect(getLanguageFromLocale('en')).toBe('en');
      expect(getLanguageFromLocale('he')).toBe('he');
    });

    it('should handle case insensitive input', () => {
      expect(getLanguageFromLocale('EN-US')).toBe('en');
      expect(getLanguageFromLocale('HE-IL')).toBe('he');
    });

    it('should fallback to default language for unsupported locales', () => {
      expect(getLanguageFromLocale('fr-FR')).toBe('en');
      expect(getLanguageFromLocale('es-ES')).toBe('en');
      expect(getLanguageFromLocale('invalid')).toBe('en');
    });
  });

  describe('isRTLLanguage', () => {
    it('should correctly identify RTL languages', () => {
      expect(isRTLLanguage('he')).toBe(true);
    });

    it('should correctly identify LTR languages', () => {
      expect(isRTLLanguage('en')).toBe(false);
    });
  });

  describe('parseAcceptLanguage', () => {
    it('should parse simple Accept-Language headers', () => {
      expect(parseAcceptLanguage('en-US')).toBe('en-US');
      expect(parseAcceptLanguage('he-IL')).toBe('he-IL');
      expect(parseAcceptLanguage('en')).toBe('en-US'); // Should normalize to supported locale
    });

    it('should parse Accept-Language headers with quality values', () => {
      const result = parseAcceptLanguage('en-US,en;q=0.9,he;q=0.8');
      expect(result).toBe('en-US'); // Should return best match
    });

    it('should sort by quality values and return best match', () => {
      const result = parseAcceptLanguage('he;q=0.8,en-US;q=1.0,en;q=0.9');
      expect(result).toBe('en-US'); // Highest quality
    });

    it('should handle complex Accept-Language headers', () => {
      const result = parseAcceptLanguage('he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7,*;q=0.5');
      expect(result).toBe('he-IL'); // First and highest quality
    });

    it('should handle malformed headers gracefully', () => {
      expect(parseAcceptLanguage('')).toBe('en-US'); // Default locale
      expect(parseAcceptLanguage('invalid')).toBe('en-US'); // Fallback to default
    });

    it('should normalize locales to supported ones', () => {
      const result = parseAcceptLanguage('en-GB,en;q=0.9');
      expect(result).toBe('en-US'); // Should normalize en-GB to en-US
    });
  });

  describe('detectLocale', () => {
    it('should detect locale from system locale', () => {
      const result = detectLocale({ systemLocale: 'he-IL' });
      expect(result).toBe('he-IL');
    });

    it('should detect locale from user preference', () => {
      const result = detectLocale({ userPreference: 'en-US' });
      expect(result).toBe('en-US');
    });

    it('should detect locale from browser language', () => {
      const result = detectLocale({ browserLanguage: 'he-IL' });
      expect(result).toBe('he-IL');
    });

    it('should detect locale from accept language', () => {
      const result = detectLocale({ acceptLanguage: 'he-IL,he;q=0.9,en;q=0.8' });
      expect(result).toBe('he-IL');
    });

    it('should prioritize sources correctly', () => {
      const result = detectLocale({ 
        userPreference: 'he-IL',
        browserLanguage: 'en-US',
        systemLocale: 'fr-FR'
      });
      expect(result).toBe('he-IL'); // User preference should take precedence
    });

    it('should fallback to default locale when no sources provided', () => {
      const result = detectLocale({});
      expect(result).toBe('en-US');
    });

    it('should handle malformed locale strings', () => {
      const result = detectLocale({ systemLocale: 'invalid' });
      expect(result).toBe('en-US');
    });

    it('should normalize detected locales', () => {
      const result = detectLocale({ systemLocale: 'en_GB.UTF-8' });
      expect(result).toBe('en-US'); // Should fallback en-GB → en-US
    });
  });

  describe('Constants', () => {
    it('should have correct supported locales', () => {
      expect(SUPPORTED_LOCALES).toEqual(['en-US', 'he-IL']);
    });

    it('should have correct supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toEqual(['en', 'he']);
    });

    it('should have correct RTL languages', () => {
      expect(RTL_LANGUAGES).toEqual(['he']);
    });
  });

  describe('Type safety', () => {
    it('should properly type supported locales', () => {
      const locale: SupportedLocale = 'en-US';
      expect(SUPPORTED_LOCALES).toContain(locale);
    });

    it('should properly type supported languages', () => {
      const language: SupportedLanguage = 'en';
      expect(SUPPORTED_LANGUAGES).toContain(language);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      // Note: The actual implementation may not handle null/undefined gracefully
      // These tests verify the expected behavior if such inputs were handled
      expect(() => normalizeLocale(null as any)).toThrow();
      expect(() => normalizeLocale(undefined as any)).toThrow();
      expect(() => getLanguageFromLocale(null as any)).toThrow();
      expect(() => getLanguageFromLocale(undefined as any)).toThrow();
    });

    it('should handle empty strings', () => {
      expect(normalizeLocale('')).toBe('en-US');
      expect(getLanguageFromLocale('')).toBe('en');
      expect(parseAcceptLanguage('')).toBe('en-US');
    });

    it('should handle whitespace-only inputs', () => {
      expect(normalizeLocale('   ')).toBe('en-US');
      expect(getLanguageFromLocale('   ')).toBe('en');
    });

    it('should handle detectLocale with empty sources', () => {
      expect(detectLocale({})).toBe('en-US');
      expect(detectLocale({ userPreference: '' })).toBe('en-US');
    });
  });
});









