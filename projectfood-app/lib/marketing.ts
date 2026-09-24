const BASE = 'https://projectfood.dev'

export const LOCALES = ['en', 'nl', 'it'] as const
export type Locale = (typeof LOCALES)[number]

type InternalPage = '/' | '/about' | '/contact' | '/terms' | '/privacy' | '/delete-account' | '/recipes' | '/learn'

const LOCALIZED_PATHS: Record<InternalPage, Record<string, string>> = {
  '/':        { en: '/en/',         nl: '/nl/',             it: '/it/'          },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
  '/delete-account': { en: '/en/delete-account', nl: '/nl/account-verwijderen', it: '/it/elimina-account' },
  '/recipes': { en: '/en/recipes',  nl: '/nl/recepten',     it: '/it/ricette'   },
  '/learn':   { en: '/en/learn',    nl: '/nl/leer',         it: '/it/impara'    },
}

// The localized base segment of the learn hub. One copy; the middleware, the sitemap and the
// JSON-LD all import it from here.
export const LEARN_BASE: Record<Locale, string> = { en: 'learn', nl: 'leer', it: 'impara' }

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

/** Absolute URL of a learn page in one locale; slugs are that locale's public slugs. */
export function learnUrl(locale: string, pillarSlug?: string | null, articleSlug?: string | null): string {
  const base = LEARN_BASE[locale as Locale] ?? 'learn'
  return [BASE, locale, base, pillarSlug, articleSlug].filter(Boolean).join('/')
}

/** Site-relative path of a learn page in one locale. */
export function learnPath(locale: string, pillarSlug?: string | null, articleSlug?: string | null): string {
  return learnUrl(locale, pillarSlug, articleSlug).slice(BASE.length)
}

/**
 * Which locales an article exists in, with that locale's slugs. Slugs differ per locale since
 * 2026-09-24 (`learn_article_content.slug`), and not every article exists in every locale.
 */
export type LearnAlternateMap = Partial<Record<Locale, { pillarSlug: string; articleSlug?: string }>>

/**
 * hreflang set for a learn page: only the locales where the article exists. `x-default` is the
 * first existing locale in the order en, nl, it, so it is the same URL from every variant and
 * never points at a 404.
 */
export function getLearnAlternates(map: LearnAlternateMap, locale: string) {
  const languages: Record<string, string> = {}
  for (const loc of LOCALES) {
    const entry = map[loc]
    if (entry) languages[loc] = learnUrl(loc, entry.pillarSlug, entry.articleSlug)
  }
  const xDefault = languages.en ?? languages.nl ?? languages.it
  if (xDefault) languages['x-default'] = xDefault
  return {
    canonical: languages[locale] ?? learnUrl(locale),
    languages,
  }
}
