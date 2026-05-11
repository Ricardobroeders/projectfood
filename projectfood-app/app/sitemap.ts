import type { MetadataRoute } from 'next'

const BASE = 'https://projectfood.dev'
const LOCALES = ['en', 'nl', 'it']

const PAGES: Record<string, Record<string, string>> = {
  '/':        { en: '/en',          nl: '/nl',              it: '/it'           },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
  '/recipes': { en: '/en/recipes',  nl: '/nl/recepten',     it: '/it/ricette'   },
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const paths of Object.values(PAGES)) {
    for (const locale of LOCALES) {
      const url = `${BASE}${paths[locale]}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: paths === PAGES['/'] ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((loc) => [loc, `${BASE}${paths[loc]}`])
          ),
        },
      })
    }
  }

  return entries
}
