const BASE = 'https://projectfood.dev'

type InternalPage = '/' | '/about' | '/contact' | '/terms' | '/privacy' | '/recipes' | '/learn'

const LOCALIZED_PATHS: Record<InternalPage, Record<string, string>> = {
  '/':        { en: '/en/',         nl: '/nl/',             it: '/it/'          },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
  '/recipes': { en: '/en/recipes',  nl: '/nl/recepten',     it: '/it/ricette'   },
  '/learn':   { en: '/en/learn',    nl: '/nl/leer',         it: '/it/impara'    },
}

const LEARN_BASE: Record<string, string> = { en: 'learn', nl: 'leer', it: 'impara' }

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

export function getLearnAlternates(
  pillarSlug: string | null,
  articleSlug: string | null,
  locale: string,
) {
  const suffix = [pillarSlug, articleSlug].filter(Boolean).join('/')
  const makeUrl = (loc: string) => {
    const base = LEARN_BASE[loc] ?? 'learn'
    return suffix ? `${BASE}/${loc}/${base}/${suffix}` : `${BASE}/${loc}/${base}`
  }
  return {
    canonical: makeUrl(locale),
    languages: {
      en: makeUrl('en'),
      nl: makeUrl('nl'),
      it: makeUrl('it'),
      'x-default': makeUrl('en'),
    } as Record<string, string>,
  }
}
