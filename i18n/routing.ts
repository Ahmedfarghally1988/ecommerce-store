import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localeDetection: false, // Do not detect locale from Accept-Language or cookies
  localePrefix: 'always' // Always use /en or /ar
});

export type Locale = (typeof routing.locales)[number];
