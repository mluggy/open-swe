import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { useTranslation } from '../hooks/useTranslation';
import { getRequestConfig } from '../i18n/request';

// Mock next-intl
jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children, messages, locale }: any) => children,
  useTranslations: jest.fn(),
  getTranslations: jest.fn(),
}));

// Mock shared utilities
jest.mock('@open-swe/shared', () => ({
  detectLocale: jest.fn(),
  getLanguageFromLocale: jest.fn(),
  isRTLLanguage: jest.fn(),
  normalizeLocale: jest.fn(),
}));

// Test component for hook testing
function TestComponent({ namespace }: { namespace?: string }) {
  const { t, locale, isRTL } = useTranslation(namespace);
  
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="isRTL">{isRTL.toString()}</div>
      <div data-testid="translation">{t('test.key')}</div>
    </div>
  );
}

describe('Web App i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useTranslation hook', () => {
    const mockUseTranslations = require('next-intl').useTranslations;
    const mockDetectLocale = require('@open-swe/shared').detectLocale;
    const mockGetLanguageFromLocale = require('@open-swe/shared').getLanguageFromLocale;
    const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;

    beforeEach(() => {
      mockUseTranslations.mockReturnValue((key: string) => `translated-${key}`);
      mockDetectLocale.mockReturnValue('en-US');
      mockGetLanguageFromLocale.mockReturnValue('en');
      mockIsRTLLanguage.mockReturnValue(false);
    });

    it('should provide translation function', () => {
      render(<TestComponent />);
      
      expect(screen.getByTestId('translation')).toHaveTextContent('translated-test.key');
      expect(mockUseTranslations).toHaveBeenCalled();
    });

    it('should provide locale information', () => {
      render(<TestComponent />);
      
      expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
      expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
    });

    it('should handle RTL languages correctly', () => {
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      mockIsRTLLanguage.mockReturnValue(true);

      render(<TestComponent />);
      
      expect(screen.getByTestId('locale')).toHaveTextContent('he-IL');
      expect(screen.getByTestId('isRTL')).toHaveTextContent('true');
    });

    it('should use namespace when provided', () => {
      render(<TestComponent namespace="settings" />);
      
      expect(mockUseTranslations).toHaveBeenCalledWith('settings');
    });

    it('should use default namespace when not provided', () => {
      render(<TestComponent />);
      
      expect(mockUseTranslations).toHaveBeenCalledWith();
    });
  });

  describe('getRequestConfig', () => {
    it('should load English messages correctly', async () => {
      const config = await getRequestConfig({ locale: 'en' });
      
      expect(config).toHaveProperty('messages');
      expect(config.locale).toBe('en');
    });

    it('should load Hebrew messages correctly', async () => {
      const config = await getRequestConfig({ locale: 'he' });
      
      expect(config).toHaveProperty('messages');
      expect(config.locale).toBe('he');
    });

    it('should handle unsupported locales by falling back to English', async () => {
      const config = await getRequestConfig({ locale: 'fr' as any });
      
      expect(config).toHaveProperty('messages');
      expect(config.locale).toBe('fr'); // Locale is preserved but messages fallback
    });
  });

  describe('Translation file loading', () => {
    it('should load English translation files without errors', async () => {
      const enMessages = await import('../../messages/en.json');
      
      expect(enMessages).toBeDefined();
      expect(enMessages.metadata).toBeDefined();
      expect(enMessages.metadata.title).toBe('Open SWE');
      expect(enMessages.metadata.description).toBe('Open SWE UX by LangChain');
    });

    it('should load Hebrew translation files without errors', async () => {
      const heMessages = await import('../../messages/he.json');
      
      expect(heMessages).toBeDefined();
      expect(heMessages.metadata).toBeDefined();
      expect(heMessages.metadata.title).toBeDefined();
      expect(heMessages.metadata.description).toBeDefined();
    });

    it('should have consistent structure between English and Hebrew files', async () => {
      const enMessages = await import('../../messages/en.json');
      const heMessages = await import('../../messages/he.json');
      
      // Check that both files have the same top-level keys
      const enKeys = Object.keys(enMessages);
      const heKeys = Object.keys(heMessages);
      
      expect(enKeys.sort()).toEqual(heKeys.sort());
      
      // Check specific sections exist in both
      expect(enMessages.metadata).toBeDefined();
      expect(heMessages.metadata).toBeDefined();
      expect(enMessages.settings).toBeDefined();
      expect(heMessages.settings).toBeDefined();
      expect(enMessages.threads).toBeDefined();
      expect(heMessages.threads).toBeDefined();
    });
  });

  describe('Locale detection and fallback', () => {
    const mockNormalizeLocale = require('@open-swe/shared').normalizeLocale;

    it('should handle locale fallback correctly', () => {
      mockNormalizeLocale.mockReturnValue('en-US');
      
      render(<TestComponent />);
      
      expect(mockNormalizeLocale).toHaveBeenCalled();
    });

    it('should detect RTL languages correctly', () => {
      const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;
      
      // Test Hebrew (RTL)
      mockIsRTLLanguage.mockReturnValue(true);
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('isRTL')).toHaveTextContent('true');
      
      // Test English (LTR)
      mockIsRTLLanguage.mockReturnValue(false);
      mockDetectLocale.mockReturnValue('en-US');
      mockGetLanguageFromLocale.mockReturnValue('en');
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
    });
  });

  describe('Translation key validation', () => {
    it('should have all required metadata keys', async () => {
      const enMessages = await import('../../messages/en.json');
      
      expect(enMessages.metadata.title).toBeDefined();
      expect(enMessages.metadata.description).toBeDefined();
    });

    it('should have all required settings keys', async () => {
      const enMessages = await import('../../messages/en.json');
      
      expect(enMessages.settings.title).toBeDefined();
      expect(enMessages.settings.loading).toBeDefined();
      expect(enMessages.settings.apiKeys).toBeDefined();
      expect(enMessages.settings.apiKeys.title).toBeDefined();
      expect(enMessages.settings.apiKeys.providers).toBeDefined();
    });

    it('should have all required threads keys', async () => {
      const enMessages = await import('../../messages/en.json');
      
      expect(enMessages.threads.title).toBeDefined();
      expect(enMessages.threads.loading).toBeDefined();
      expect(enMessages.threads.count).toBeDefined();
      expect(enMessages.threads.pagination).toBeDefined();
    });

    it('should have parameterized strings for dynamic content', async () => {
      const enMessages = await import('../../messages/en.json');
      
      // Check for parameter placeholders
      expect(enMessages.threads.count).toContain('{count}');
      expect(enMessages.threads.pagination.showing).toContain('{start}');
      expect(enMessages.threads.pagination.showing).toContain('{end}');
      expect(enMessages.threads.pagination.showing).toContain('{total}');
      expect(enMessages.settings.apiKeys.placeholder).toContain('{provider}');
    });
  });

  describe('RTL support', () => {
    it('should provide correct direction information for LTR languages', () => {
      const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;
      mockIsRTLLanguage.mockReturnValue(false);
      mockDetectLocale.mockReturnValue('en-US');
      mockGetLanguageFromLocale.mockReturnValue('en');
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('isRTL')).toHaveTextContent('false');
    });

    it('should provide correct direction information for RTL languages', () => {
      const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;
      mockIsRTLLanguage.mockReturnValue(true);
      mockDetectLocale.mockReturnValue('he-IL');
      mockGetLanguageFromLocale.mockReturnValue('he');
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('isRTL')).toHaveTextContent('true');
    });
  });

  describe('Error handling', () => {
    it('should handle missing translation keys gracefully', () => {
      const mockUseTranslations = require('next-intl').useTranslations;
      mockUseTranslations.mockReturnValue((key: string) => key); // Return key if translation missing
      
      render(<TestComponent />);
      
      expect(screen.getByTestId('translation')).toHaveTextContent('test.key');
    });

    it('should handle invalid locale gracefully', () => {
      const mockDetectLocale = require('@open-swe/shared').detectLocale;
      mockDetectLocale.mockReturnValue('invalid-locale');
      
      expect(() => render(<TestComponent />)).not.toThrow();
    });
  });

  describe('Integration with shared utilities', () => {
    it('should use shared locale detection', () => {
      const mockDetectLocale = require('@open-swe/shared').detectLocale;
      
      render(<TestComponent />);
      
      expect(mockDetectLocale).toHaveBeenCalled();
    });

    it('should use shared language extraction', () => {
      const mockGetLanguageFromLocale = require('@open-swe/shared').getLanguageFromLocale;
      
      render(<TestComponent />);
      
      expect(mockGetLanguageFromLocale).toHaveBeenCalled();
    });

    it('should use shared RTL detection', () => {
      const mockIsRTLLanguage = require('@open-swe/shared').isRTLLanguage;
      
      render(<TestComponent />);
      
      expect(mockIsRTLLanguage).toHaveBeenCalled();
    });
  });
});
