import { readFileSync } from 'fs';
import { join } from 'path';
import {
  initializeI18n,
  getTranslationFunction,
  getLocaleInfo,
  setLocale,
  getAvailableLanguages,
  formatMessage,
  getTextAlignment,
  getDirectionalSpacing,
} from '../i18n';

// Mock fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

// Mock shared utilities
jest.mock('@open-swe/shared', () => ({
  detectLocale: jest.fn(),
  getLanguageFromLocale: jest.fn(),
  isRTLLanguage: jest.fn(),
}));

const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockDetectLocale = require('@open-swe/shared').detectLocale;
const mockGetLanguageFromLocale = require('@open-swe/shared').getLanguageFromLocale;
const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;

// Mock translation files
const mockEnglishMessages = {
  startup: {
    title: '🏠 Starting Open SWE CLI in Local Mode',
    workingDirectory: '   Working directory:',
    noAuth: '   No GitHub authentication required',
    goodbye: '\n👋 Goodbye!'
  },
  commands: {
    name: 'open-swe',
    description: 'Open SWE CLI - Local Mode',
    helpOption: 'Display help for command'
  },
  feedback: {
    planFeedback: 'Plan feedback: ',
    approve: 'Approve',
    deny: 'Deny',
    instructions: '(Use ←/→ to select, Enter to confirm)',
    exitHint: '(Press Ctrl+K to exit)'
  },
  loading: {
    default: 'Loading',
    processing: 'Processing',
    initializing: 'Initializing'
  },
  status: {
    streaming: 'Streaming',
    awaitingFeedback: 'Awaiting feedback',
    done: 'Done'
  },
  common: {
    yes: 'Yes',
    no: 'No',
    repository: 'Repository'
  }
};

const mockHebrewMessages = {
  startup: {
    title: '🏠 מתחיל Open SWE CLI במצב מקומי',
    workingDirectory: '   תיקיית עבודה:',
    noAuth: '   אין צורך באימות GitHub',
    goodbye: '\n👋 להתראות!'
  },
  commands: {
    name: 'open-swe',
    description: 'Open SWE CLI - מצב מקומי',
    helpOption: 'הצג עזרה לפקודה'
  },
  feedback: {
    planFeedback: 'משוב על התוכנית: ',
    approve: 'אשר',
    deny: 'דחה',
    instructions: '(השתמש ב←/→ לבחירה, Enter לאישור)',
    exitHint: '(לחץ Ctrl+K ליציאה)'
  },
  loading: {
    default: 'טוען',
    processing: 'מעבד',
    initializing: 'מאתחל'
  },
  status: {
    streaming: 'זורם',
    awaitingFeedback: 'ממתין למשוב',
    done: 'הושלם'
  },
  common: {
    yes: 'כן',
    no: 'לא',
    repository: 'מאגר'
  }
};

describe('CLI i18n system', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset default mocks
    mockDetectLocale.mockReturnValue('en-US');
    mockGetLanguageFromLocale.mockReturnValue('en');
    mockIsRTLLanguage.mockReturnValue(false);
    
    // Mock file reading
    mockReadFileSync.mockImplementation((path: string) => {
      if (path.includes('en.json')) {
        return JSON.stringify(mockEnglishMessages);
      } else if (path.includes('he.json')) {
        return JSON.stringify(mockHebrewMessages);
      }
      throw new Error('File not found');
    });
  });

  describe('initializeI18n', () => {
    it('should initialize with detected locale', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      
      expect(() => initializeI18n()).not.toThrow();
      expect(mockDetectLocale).toHaveBeenCalled();
      expect(mockGetLanguageFromLocale).toHaveBeenCalledWith('he-IL');
    });

    it('should fallback to English if Hebrew file not found', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockReadFileSync.mockImplementation((path: string) => {
        if (path.includes('he.json')) {
          throw new Error('File not found');
        } else if (path.includes('en.json')) {
          return JSON.stringify(mockEnglishMessages);
        }
        throw new Error('File not found');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(() => initializeI18n()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Translation file for he not found, falling back to English');
      
      consoleSpy.mockRestore();
    });

    it('should handle complete file loading failure gracefully', () => {
      mockReadFileSync.mockImplementation(() => {
        throw new Error('All files missing');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => initializeI18n()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load any translation files:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('getTranslationFunction', () => {
    beforeEach(() => {
      initializeI18n();
    });

    it('should return translation function that translates keys correctly', () => {
      const t = getTranslationFunction();
      
      expect(t('startup.title')).toBe('🏠 Starting Open SWE CLI in Local Mode');
      expect(t('commands.name')).toBe('open-swe');
      expect(t('feedback.approve')).toBe('Approve');
    });

    it('should handle nested translation keys', () => {
      const t = getTranslationFunction();
      
      expect(t('startup.workingDirectory')).toBe('   Working directory:');
      expect(t('feedback.instructions')).toBe('(Use ←/→ to select, Enter to confirm)');
    });

    it('should return key if translation not found', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const t = getTranslationFunction();
      
      expect(t('nonexistent.key')).toBe('nonexistent.key');
      expect(consoleSpy).toHaveBeenCalledWith('Translation key not found: nonexistent.key');
      
      consoleSpy.mockRestore();
    });

    it('should handle parameter interpolation', () => {
      // Add a parameterized message to mock
      mockReadFileSync.mockImplementation((path: string) => {
        if (path.includes('en.json')) {
          return JSON.stringify({
            ...mockEnglishMessages,
            test: {
              parameterized: 'Hello {name}, you have {count} messages'
            }
          });
        }
        return JSON.stringify(mockHebrewMessages);
      });

      initializeI18n();
      const t = getTranslationFunction();
      
      expect(t('test.parameterized', { name: 'John', count: 5 })).toBe('Hello John, you have 5 messages');
    });

    it('should handle missing parameters gracefully', () => {
      mockReadFileSync.mockImplementation((path: string) => {
        if (path.includes('en.json')) {
          return JSON.stringify({
            ...mockEnglishMessages,
            test: {
              parameterized: 'Hello {name}, you have {count} messages'
            }
          });
        }
        return JSON.stringify(mockHebrewMessages);
      });

      initializeI18n();
      const t = getTranslationFunction();
      
      expect(t('test.parameterized', { name: 'John' })).toBe('Hello John, you have {count} messages');
    });

    it('should work with Hebrew translations', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      
      initializeI18n();
      const t = getTranslationFunction();
      
      expect(t('startup.title')).toBe('🏠 מתחיל Open SWE CLI במצב מקומי');
      expect(t('feedback.approve')).toBe('אשר');
      expect(t('feedback.deny')).toBe('דחה');
    });
  });

  describe('getLocaleInfo', () => {
    it('should return correct locale info for English', () => {
      mockDetectLocale.mockReturnValue('en-US');
      mockGetLanguageFromLocale.mockReturnValue('en');
      mockIsRTLLanguage.mockReturnValue(false);
      
      initializeI18n();
      const localeInfo = getLocaleInfo();
      
      expect(localeInfo).toEqual({
        locale: 'en-US',
        language: 'en',
        isRTL: false,
        dir: 'ltr'
      });
    });

    it('should return correct locale info for Hebrew', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockIsRTLLanguage.mockReturnValue(true);
      
      initializeI18n();
      const localeInfo = getLocaleInfo();
      
      expect(localeInfo).toEqual({
        locale: 'he-IL',
        language: 'he',
        isRTL: true,
        dir: 'rtl'
      });
    });

    it('should initialize if not already initialized', () => {
      // Don't call initializeI18n first
      const localeInfo = getLocaleInfo();
      
      expect(localeInfo).toBeDefined();
      expect(localeInfo.locale).toBeDefined();
      expect(localeInfo.language).toBeDefined();
    });
  });

  describe('setLocale', () => {
    it('should change locale and reload translations', () => {
      initializeI18n();
      
      // Initially English
      let t = getTranslationFunction();
      expect(t('feedback.approve')).toBe('Approve');
      
      // Change to Hebrew
      mockGetLanguageFromLocale.mockReturnValue('he');
      setLocale('he-IL');
      
      t = getTranslationFunction();
      expect(t('feedback.approve')).toBe('אשר');
    });

    it('should update locale info after setting new locale', () => {
      initializeI18n();
      
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockIsRTLLanguage.mockReturnValue(true);
      setLocale('he-IL');
      
      const localeInfo = getLocaleInfo();
      expect(localeInfo.locale).toBe('he-IL');
      expect(localeInfo.language).toBe('he');
      expect(localeInfo.isRTL).toBe(true);
    });
  });

  describe('getAvailableLanguages', () => {
    it('should return supported languages', () => {
      const languages = getAvailableLanguages();
      expect(languages).toEqual(['en', 'he']);
    });
  });

  describe('formatMessage', () => {
    it('should format message with parameters', () => {
      const template = 'Hello {name}, you have {count} messages';
      const params = { name: 'John', count: 5 };
      
      expect(formatMessage(template, params)).toBe('Hello John, you have 5 messages');
    });

    it('should handle missing parameters', () => {
      const template = 'Hello {name}, you have {count} messages';
      const params = { name: 'John' };
      
      expect(formatMessage(template, params)).toBe('Hello John, you have {count} messages');
    });

    it('should handle empty parameters', () => {
      const template = 'Hello {name}';
      const params = {};
      
      expect(formatMessage(template, params)).toBe('Hello {name}');
    });
  });

  describe('getTextAlignment', () => {
    it('should return left alignment for LTR languages', () => {
      mockIsRTLLanguage.mockReturnValue(false);
      initializeI18n();
      
      expect(getTextAlignment()).toBe('left');
    });

    it('should return right alignment for RTL languages', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockIsRTLLanguage.mockReturnValue(true);
      initializeI18n();
      
      expect(getTextAlignment()).toBe('right');
    });
  });

  describe('getDirectionalSpacing', () => {
    it('should return normal spacing for LTR languages', () => {
      mockIsRTLLanguage.mockReturnValue(false);
      initializeI18n();
      
      const spacing = getDirectionalSpacing(10, 20);
      expect(spacing).toEqual({
        paddingLeft: 10,
        paddingRight: 20
      });
    });

    it('should return flipped spacing for RTL languages', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockIsRTLLanguage.mockReturnValue(true);
      initializeI18n();
      
      const spacing = getDirectionalSpacing(10, 20);
      expect(spacing).toEqual({
        paddingLeft: 20,
        paddingRight: 10
      });
    });
  });

  describe('Translation file structure validation', () => {
    it('should validate English translation file structure', () => {
      initializeI18n();
      const t = getTranslationFunction();
      
      // Test all required sections exist
      expect(t('startup.title')).toBeDefined();
      expect(t('commands.name')).toBeDefined();
      expect(t('feedback.planFeedback')).toBeDefined();
      expect(t('loading.default')).toBeDefined();
      expect(t('status.streaming')).toBeDefined();
      expect(t('common.yes')).toBeDefined();
    });

    it('should validate Hebrew translation file structure', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      initializeI18n();
      const t = getTranslationFunction();
      
      // Test all required sections exist in Hebrew
      expect(t('startup.title')).toBeDefined();
      expect(t('commands.name')).toBeDefined();
      expect(t('feedback.planFeedback')).toBeDefined();
      expect(t('loading.default')).toBeDefined();
      expect(t('status.streaming')).toBeDefined();
      expect(t('common.yes')).toBeDefined();
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle malformed JSON files', () => {
      mockReadFileSync.mockImplementation(() => 'invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => initializeI18n()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should handle non-string translation values', () => {
      mockReadFileSync.mockImplementation((path: string) => {
        if (path.includes('en.json')) {
          return JSON.stringify({
            test: {
              invalid: { nested: 'object' }
            }
          });
        }
        return JSON.stringify(mockHebrewMessages);
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      initializeI18n();
      const t = getTranslationFunction();
      
      expect(t('test.invalid')).toBe('test.invalid');
      expect(consoleSpy).toHaveBeenCalledWith('Translation value is not a string for key: test.invalid');
      
      consoleSpy.mockRestore();
    });

    it('should handle empty translation files', () => {
      mockReadFileSync.mockImplementation(() => JSON.stringify({}));
      
      expect(() => initializeI18n()).not.toThrow();
      
      const t = getTranslationFunction();
      expect(t('any.key')).toBe('any.key');
    });
  });

  describe('Integration with shared utilities', () => {
    it('should use shared detectLocale function', () => {
      initializeI18n();
      expect(mockDetectLocale).toHaveBeenCalled();
    });

    it('should use shared getLanguageFromLocale function', () => {
      initializeI18n();
      expect(mockGetLanguageFromLocale).toHaveBeenCalled();
    });

    it('should use shared isRTLLanguage function', () => {
      getLocaleInfo();
      expect(mockIsRTLLanguage).toHaveBeenCalled();
    });
  });
});
