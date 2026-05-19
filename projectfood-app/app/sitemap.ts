import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://projectfood.dev'
const LOCALES = ['en', 'nl', 'it']

const LEARN_BASE: Record<string, string> = { en: 'learn', nl: 'leer', it: 'impara' }

const PAGES: Record<string, Record<string, string>> = {
  '/':        { en: '/en',          nl: '/nl',              it: '/it'           },
  '/about':   { en: '/en/about',    nl: '/nl/over',         it: '/it/chi-siamo' },
  '/contact': { en: '/en/contact',  nl: '/nl/contact',      it: '/it/contatto'  },
  '/terms':   { en: '/en/terms',    nl: '/nl/voorwaarden',  it: '/it/termini'   },
  '/privacy': { en: '/en/privacy',  nl: '/nl/privacy',      it: '/it/privacy'   },
}

function learnPaths(pillarSlug?: string, articleSlug?: string): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((loc) => {
      const base = LEARN_BASE[loc]
      const parts = [loc, base, pillarSlug, articleSlug].filter(Boolean)
      return [loc, `/${parts.join('/')}`]
    })
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static marketing pages
  for (const paths of Object.values(PAGES)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}${paths[locale]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: paths === PAGES['/'] ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}${paths[loc]}`])),
        },
      })
    }
  }

  // Learn hub (one per locale)
  const hubPaths = learnPaths()
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE}${hubPaths[locale]}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}${hubPaths[loc]}`])),
      },
    })
  }

  // Dynamic learn articles from Supabase (public RLS — anon key is sufficient)
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: pillars } = await supabase
      .from('learn_articles')
      .select('slug, updated_at')
      .eq('type', 'pillar')
      .eq('is_published', true)

    for (const pillar of pillars ?? []) {
      const paths = learnPaths(pillar.slug)
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE}${paths[locale]}`,
          lastModified: new Date(pillar.updated_at),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}${paths[loc]}`])),
          },
        })
      }
    }

    const { data: clusters } = await supabase
      .from('learn_articles')
      .select('slug, updated_at, pillar:pillar_id(slug)')
      .eq('type', 'cluster')
      .eq('is_published', true)

    for (const cluster of clusters ?? []) {
      const p = cluster.pillar
      const pillarSlug = Array.isArray(p) ? (p[0] as { slug: string })?.slug : (p as { slug: string } | null)?.slug
      if (!pillarSlug) continue
      const paths = learnPaths(pillarSlug, cluster.slug)
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE}${paths[locale]}`,
          lastModified: new Date(cluster.updated_at),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(LOCALES.map((loc) => [loc, `${BASE}${paths[loc]}`])),
          },
        })
      }
    }
  } catch {
    // Sitemap degrades gracefully if DB is unreachable at build time
  }

  return entries
}
