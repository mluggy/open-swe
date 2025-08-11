import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { 
  SUPPORTED_LANGUAGES, 
  getLanguageFromLocale, 
  DEFAULT_LANGUAGE,
  type SupportedLanguage 
} from '@open-swe/shared';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined, fallback to default if not
  const currentLocale = locale || DEFAULT_LANGUAGE;
  
  // Validate that the incoming `locale` parameter is valid
  const language = getLanguageFromLocale(currentLocale);
  
  // Check if the language is supported
  if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`../../messages/${language}.json`)).default
  };
});




