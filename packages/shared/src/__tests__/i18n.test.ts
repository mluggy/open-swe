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
      expect(normalizeLocale('iw')).toBe('he-IL'); // Legacy Hebrew code
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
      expect(isRTLLanguage('ar')).toBe(true);
    });

    it('should correctly identify LTR languages', () => {
      expect(isRTLLanguage('en')).toBe(false);
      expect(isRTLLanguage('fr')).toBe(false);
      expect(isRTLLanguage('es')).toBe(false);
    });

    it('should handle case insensitive input', () => {
      expect(isRTLLanguage('HE')).toBe(true);
      expect(isRTLLanguage('EN')).toBe(false);
    });

    it('should return false for unsupported languages', () => {
      expect(isRTLLanguage('invalid')).toBe(false);
      expect(isRTLLanguage('')).toBe(false);
    });
  });

  describe('parseAcceptLanguage', () => {
    it('should parse simple Accept-Language headers', () => {
      expect(parseAcceptLanguage('en-US')).toEqual(['en-US']);
      expect(parseAcceptLanguage('he-IL')).toEqual(['he-IL']);
      expect(parseAcceptLanguage('en')).toEqual(['en']);
    });

    it('should parse Accept-Language headers with quality values', () => {
      const result = parseAcceptLanguage('en-US,en;q=0.9,he;q=0.8');
      expect(result).toEqual(['en-US', 'en', 'he']);
    });

    it('should sort by quality values in descending order', () => {
      const result = parseAcceptLanguage('he;q=0.8,en-US;q=1.0,en;q=0.9');
      expect(result).toEqual(['en-US', 'en', 'he']);
    });

    it('should handle complex Accept-Language headers', () => {
      const result = parseAcceptLanguage('he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7,*;q=0.5');
      expect(result).toEqual(['he-IL', 'he', 'en-US', 'en']);
    });

    it('should handle malformed headers gracefully', () => {
      expect(parseAcceptLanguage('')).toEqual([]);
      expect(parseAcceptLanguage('invalid')).toEqual(['invalid']);
      expect(parseAcceptLanguage('en-US;q=invalid')).toEqual(['en-US']);
    });

    it('should remove duplicates while preserving order', () => {
      const result = parseAcceptLanguage('en-US,en,en-US;q=0.9');
      expect(result).toEqual(['en-US', 'en']);
    });
  });

  describe('detectLocale', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      // Reset environment variables
      process.env = { ...originalEnv };
      delete process.env.LANG;
      delete process.env.LANGUAGE;
      delete process.env.LC_ALL;
      delete process.env.LC_MESSAGES;
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should detect locale from LANG environment variable', () => {
      process.env.LANG = 'he_IL.UTF-8';
      expect(detectLocale()).toBe('he-IL');

      process.env.LANG = 'en_US.UTF-8';
      expect(detectLocale()).toBe('en-US');
    });

    it('should detect locale from LANGUAGE environment variable', () => {
      process.env.LANGUAGE = 'he_IL:he:en_US:en';
      expect(detectLocale()).toBe('he-IL');
    });

    it('should detect locale from LC_ALL environment variable', () => {
      process.env.LC_ALL = 'he_IL.UTF-8';
      expect(detectLocale()).toBe('he-IL');
    });

    it('should detect locale from LC_MESSAGES environment variable', () => {
      process.env.LC_MESSAGES = 'he_IL.UTF-8';
      expect(detectLocale()).toBe('he-IL');
    });

    it('should prioritize environment variables correctly', () => {
      process.env.LC_ALL = 'he_IL.UTF-8';
      process.env.LANG = 'en_US.UTF-8';
      expect(detectLocale()).toBe('he-IL'); // LC_ALL should take precedence
    });

    it('should fallback to default locale when no environment variables are set', () => {
      expect(detectLocale()).toBe('en-US');
    });

    it('should handle malformed environment variables', () => {
      process.env.LANG = 'invalid';
      expect(detectLocale()).toBe('en-US');
    });

    it('should normalize detected locales', () => {
      process.env.LANG = 'en_GB.UTF-8';
      expect(detectLocale()).toBe('en-US'); // Should fallback en-GB → en-US
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
      expect(RTL_LANGUAGES).toEqual(['he', 'ar']);
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
      expect(normalizeLocale(null as any)).toBe('en-US');
      expect(normalizeLocale(undefined as any)).toBe('en-US');
      expect(getLanguageFromLocale(null as any)).toBe('en');
      expect(getLanguageFromLocale(undefined as any)).toBe('en');
    });

    it('should handle empty strings', () => {
      expect(normalizeLocale('')).toBe('en-US');
      expect(getLanguageFromLocale('')).toBe('en');
      expect(parseAcceptLanguage('')).toEqual([]);
    });

    it('should handle whitespace-only inputs', () => {
      expect(normalizeLocale('   ')).toBe('en-US');
      expect(getLanguageFromLocale('   ')).toBe('en');
    });
  });
});
