import createMiddleware from 'next-intl/middleware';
import { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE
} from '@open-swe/shared';

export default createMiddleware({
  // A list of all locales that are supported (using language codes for routing)
  locales: [...SUPPORTED_LANGUAGES],

  // Used when no locale matches
  defaultLocale: DEFAULT_LANGUAGE,

  // Custom locale detection function
  localeDetection: true,

  // Custom locale prefix strategy
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(he|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
};




