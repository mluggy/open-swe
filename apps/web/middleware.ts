import createMiddleware from 'next-intl/middleware';
import { 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE, 
  normalizeLocale,
  detectLocale,
  parseAcceptLanguage 
} from '@open-swe/shared';

export default createMiddleware({
  // A list of all locales that are supported
  locales: [...SUPPORTED_LOCALES],

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  // Custom locale detection function
  localeDetection: true,

  // Custom locale prefix strategy
  localePrefix: 'as-needed',

  // Custom path names for different locales (optional)
  pathnames: {
    '/': '/',
    '/settings': {
      'en-US': '/settings',
      'he-IL': '/הגדרות'
    },
    '/chat': {
      'en-US': '/chat', 
      'he-IL': '/צ\'אט'
    }
  }
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(he-IL|en-US)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en-US/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};



