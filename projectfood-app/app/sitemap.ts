import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { LOCALES, getLearnAlternates, learnUrl, type LearnAlternateMap, type Locale } from '@/lib/marketing'

// Regenerated hourly; the learn publish script also revalidates it on demand.
export const revalidate = 3600

const BASE = 'https://projectfood.dev'

const PAGES: Record<string, Record<string, string>> = {
  '/':        { en: '/en/',         nl: '/nl/',             it: '/it/'          },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
  '/delete-account': { en: '/en/delete-account', nl: '/nl/account-verwijderen', it: '/it/elimina-account' },
}

type SlugRow = { locale: string; slug: string; updated_at?: string }
type ArticleRow = {
  type: 'pillar' | 'cluster'
  updated_at: string
  learn_article_content: SlugRow[] | null
  pillar: { learn_article_content: SlugRow[] | null } | Array<{ learn_article_content: SlugRow[] | null }> | null
}

function staticAlternates(paths: Record<string, string>) {
  const languages = Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}${paths[loc]}`]))
  return { languages: { ...languages, 'x-default': `${BASE}${paths.en}` } }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static marketing pages. No lastModified: a fake build date on every URL teaches crawlers
  // to ignore the field.
  for (const [page, paths] of Object.entries(PAGES)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${paths[locale]}`,
        changeFrequency: 'weekly',
        priority: page === '/' ? 1.0 : 0.8,
        alternates: staticAlternates(paths),
      })
    }
  }

  // Learn hub (one per locale)
  const hubLanguages = Object.fromEntries(LOCALES.map((loc) => [loc, learnUrl(loc)]))
  for (const locale of LOCALES) {
    entries.push({
      url: learnUrl(locale),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { ...hubLanguages, 'x-default': hubLanguages.en } },
    })
  }

  // Learn articles: one entry per locale the article exists in, hreflang set from the same
  // rule as the pages (getLearnAlternates), slugs per locale.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data } = await supabase
      .from('learn_articles')
      .select('type, updated_at, learn_article_content(locale, slug, updated_at), pillar:pillar_id(learn_article_content(locale, slug))')
      .eq('is_published', true)

    for (const row of (data ?? []) as unknown as ArticleRow[]) {
      const own = row.learn_article_content ?? []
      const pillar = Array.isArray(row.pillar) ? row.pillar[0] : row.pillar
      const pillarRows = pillar?.learn_article_content ?? []

      const map: LearnAlternateMap = {}
      for (const c of own) {
        if (row.type === 'pillar') {
          map[c.locale as Locale] = { pillarSlug: c.slug }
        } else {
          const pillarSlug = pillarRows.find((p) => p.locale === c.locale)?.slug
          if (pillarSlug) map[c.locale as Locale] = { pillarSlug, articleSlug: c.slug }
        }
      }

      for (const c of own) {
        const loc = c.locale as Locale
        if (!map[loc]) continue
        const { canonical, languages } = getLearnAlternates(map, loc)
        const contentUpdated = c.updated_at ?? row.updated_at
        entries.push({
          url: canonical,
          lastModified: new Date(contentUpdated > row.updated_at ? contentUpdated : row.updated_at),
          changeFrequency: 'monthly',
          priority: row.type === 'pillar' ? 0.8 : 0.7,
          alternates: { languages },
        })
      }
    }
  } catch {
    // Sitemap degrades gracefully if DB is unreachable at build time
  }

  return entries
}
