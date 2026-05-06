const BASE = 'https://projectfood.dev'

type InternalPage = '/' | '/about' | '/contact' | '/terms' | '/privacy' | '/recipes'

const LOCALIZED_PATHS: Record<InternalPage, Record<string, string>> = {
  '/':        { en: '/en/',         nl: '/nl/',             it: '/it/'          },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
  '/recipes': { en: '/en/recipes',  nl: '/nl/recepten',     it: '/it/ricette'   },
}

export function getAlternates(page: InternalPage, locale: string) {
  const paths = LOCALIZED_PATHS[page]
  return {
    canonical: `${BASE}${paths[locale]}`,
    languages: {
      en: `${BASE}${paths.en}`,
      nl: `${BASE}${paths.nl}`,
      it: `${BASE}${paths.it}`,
      'x-default': `${BASE}${paths.en}`,
    } as Record<string, string>,
  }
}

export function getLocalizedHref(page: InternalPage, locale: string): string {
  return LOCALIZED_PATHS[page]?.[locale] ?? `/${locale}/`
}
