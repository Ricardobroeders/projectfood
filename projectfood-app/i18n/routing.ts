import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'it'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/about':   { en: '/about',   nl: '/over',        it: '/chi-siamo' },
    '/contact': { en: '/contact', nl: '/contact',     it: '/contatto'  },
    '/terms':   { en: '/terms',   nl: '/voorwaarden', it: '/termini'   },
    '/privacy': { en: '/privacy', nl: '/privacy',     it: '/privacy'   },
    '/recipes': { en: '/recipes', nl: '/recepten',    it: '/ricette'   },
  },
})
