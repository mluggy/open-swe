import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { 
  SUPPORTED_LANGUAGES, 
  getLanguageFromLocale, 
  type SupportedLanguage 
} from '@open-swe/shared';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const language = getLanguageFromLocale(locale);
  
  // Check if the language is supported
  if (!SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${language}.json`)).default
  };
});


