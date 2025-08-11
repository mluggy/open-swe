import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { 
  SUPPORTED_LOCALES, 
  normalizeLocale, 
  type SupportedLocale 
} from '@open-swe/shared';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const normalizedLocale = normalizeLocale(locale);
  
  // Check if the normalized locale is supported
  if (!SUPPORTED_LOCALES.includes(normalizedLocale as SupportedLocale)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${normalizedLocale.split('-')[0]}.json`)).default
  };
});

