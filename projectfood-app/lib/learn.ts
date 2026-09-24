import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { LearnAlternateMap, Locale } from '@/lib/marketing'

// Cookie-free client. Public RLS allows anon reads on published learn content only, which is
// exactly what the pages show, so the learn tree renders statically (ISR) without a session.
let client: ReturnType<typeof createClient> | null = null
function anon() {
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
  return client
}

export type ArticleType = 'pillar' | 'cluster'

export type LearnArticle = {
  id: string
  /** The stable internal key (`learn_articles.slug`), also the content folder name. */
  internal_slug: string
  type: ArticleType
  pillar_id: string | null
  display_order: number
  emoji: string | null
  cover_image_url: string | null
  published_at: string | null
  updated_at: string
}

export type LearnArticleContent = {
  /** This locale's public slug (`learn_article_content.slug`). */
  slug: string
  title: string
  subtitle: string | null
  body_md: string
  reading_time_min: number | null
  meta_title: string | null
  meta_description: string | null
  sd_keywords: string[]
  sd_faq: Array<{ question: string; answer: string }> | null
  sd_citations: Array<{
    author: string
    title: string
    year: number
    doi?: string
    url?: string
  }> | null
  /** Internal slugs of related articles, resolved per locale by getArticlesBySlugs. */
  related_article_slugs: string[]
  content_updated_at: string
}

export type LearnArticleWithContent = LearnArticle & LearnArticleContent

export type PillarSummary = Pick<
  LearnArticleWithContent,
  'slug' | 'emoji' | 'title' | 'subtitle' | 'reading_time_min' | 'display_order'
>

export type PillarPageData = {
  pillar: LearnArticleWithContent
  clusters: LearnArticleWithContent[]
}

export type RelatedArticle = {
  internal_slug: string
  slug: string
  pillarSlug: string
  articleSlug: string | null
  title: string
  reading_time_min: number | null
}

const CONTENT_FIELDS = `
  slug, title, subtitle, body_md, reading_time_min, meta_title, meta_description,
  sd_keywords, sd_faq, sd_citations, related_article_slugs, content_updated_at:updated_at
`

const ARTICLE_CONTENT_SELECT = `
  id, internal_slug:slug, type, pillar_id, display_order, emoji, cover_image_url, published_at, updated_at,
  learn_article_content!inner (${CONTENT_FIELDS})
`

const SLUGS = 'learn_article_content(locale, slug)'

type SlugRow = { locale: string; slug: string }
type Row = Record<string, unknown>

function one<T>(v: T | T[] | null | undefined): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : (v ?? null)
}

function slugIn(rows: SlugRow[] | null | undefined, locale: string): string | null {
  return rows?.find((r) => r.locale === locale)?.slug ?? null
}

function mergeContent(row: Row): LearnArticleWithContent {
  const content = one(row.learn_article_content as LearnArticleContent[] | LearnArticleContent)!
  const { learn_article_content: _, ...article } = row
  return { ...article, ...content } as LearnArticleWithContent
}

/** The later of the article row's and the content row's `updated_at`; the honest dateModified. */
export function lastModified(a: { updated_at: string; content_updated_at?: string | null }): string {
  const c = a.content_updated_at
  return c && c > a.updated_at ? c : a.updated_at
}

export async function getAllPublishedPillarParams(): Promise<Array<{ locale: string; pillarSlug: string }>> {
  const { data } = await anon()
    .from('learn_articles')
    .select(SLUGS)
    .eq('type', 'pillar')
    .eq('is_published', true)
  return (data ?? []).flatMap((r) =>
    ((r as Row).learn_article_content as SlugRow[] | null ?? []).map((c) => ({ locale: c.locale, pillarSlug: c.slug })),
  )
}

export async function getAllPublishedClusterParams(): Promise<
  Array<{ locale: string; pillarSlug: string; articleSlug: string }>
> {
  const { data } = await anon()
    .from('learn_articles')
    .select(`${SLUGS}, pillar:pillar_id(${SLUGS})`)
    .eq('type', 'cluster')
    .eq('is_published', true)
  const out: Array<{ locale: string; pillarSlug: string; articleSlug: string }> = []
  for (const r of (data ?? []) as Row[]) {
    const own = (r.learn_article_content as SlugRow[] | null) ?? []
    const pillar = one(r.pillar as Row | Row[] | null)
    const pillarRows = (pillar?.learn_article_content as SlugRow[] | null) ?? []
    for (const c of own) {
      const pillarSlug = slugIn(pillarRows, c.locale)
      if (pillarSlug) out.push({ locale: c.locale, pillarSlug, articleSlug: c.slug })
    }
  }
  return out
}

export async function getLearnHub(locale: string): Promise<PillarSummary[]> {
  const { data } = await anon()
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('type', 'pillar')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .order('display_order')
  if (!data) return []
  return (data as Row[]).map(mergeContent).map(({ slug, emoji, title, subtitle, reading_time_min, display_order }) => ({
    slug, emoji, title, subtitle, reading_time_min, display_order,
  }))
}

export const getPillarPage = cache(async (pillarSlug: string, locale: string): Promise<PillarPageData | null> => {
  const { data: pillarRow } = await anon()
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('type', 'pillar')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .eq('learn_article_content.slug', pillarSlug)
    .maybeSingle()

  if (!pillarRow) return null
  const pillar = mergeContent(pillarRow as Row)

  const { data: clusterRows } = await anon()
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('pillar_id', pillar.id)
    .eq('type', 'cluster')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .order('display_order')

  const clusters = ((clusterRows ?? []) as Row[]).map(mergeContent)
  return { pillar, clusters }
})

export const getClusterPage = cache(async (
  pillarSlug: string,
  articleSlug: string,
  locale: string,
): Promise<{ article: LearnArticleWithContent; pillar: Pick<LearnArticleWithContent, 'slug' | 'title'> } | null> => {
  const { data: articleRow } = await anon()
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('type', 'cluster')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .eq('learn_article_content.slug', articleSlug)
    .maybeSingle()

  if (!articleRow) return null
  const article = mergeContent(articleRow as Row)
  if (!article.pillar_id) return null

  const { data: pillarRow } = await anon()
    .from('learn_articles')
    .select('id, learn_article_content!inner(slug, title)')
    .eq('id', article.pillar_id)
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .eq('learn_article_content.slug', pillarSlug)
    .maybeSingle()

  if (!pillarRow) return null
  const pillarContent = one((pillarRow as Row).learn_article_content as Array<{ slug: string; title: string }>)!
  return { article, pillar: { slug: pillarContent.slug, title: pillarContent.title } }
})

/** The locales this article exists in, with the slugs to build its hreflang set. */
export const getSiblingSlugs = cache(async (articleId: string): Promise<LearnAlternateMap> => {
  const { data } = await anon()
    .from('learn_articles')
    .select(`type, ${SLUGS}, pillar:pillar_id(${SLUGS})`)
    .eq('id', articleId)
    .maybeSingle()
  const map: LearnAlternateMap = {}
  if (!data) return map
  const row = data as Row
  const own = (row.learn_article_content as SlugRow[] | null) ?? []
  if (row.type === 'pillar') {
    for (const c of own) map[c.locale as Locale] = { pillarSlug: c.slug }
    return map
  }
  const pillar = one(row.pillar as Row | Row[] | null)
  const pillarRows = (pillar?.learn_article_content as SlugRow[] | null) ?? []
  for (const c of own) {
    const pillarSlug = slugIn(pillarRows, c.locale)
    if (pillarSlug) map[c.locale as Locale] = { pillarSlug, articleSlug: c.slug }
  }
  return map
})

/** Resolve internal slugs (from `related_article_slugs`) to this locale's published articles, in input order. */
export async function getArticlesBySlugs(internalSlugs: string[], locale: string): Promise<RelatedArticle[]> {
  if (internalSlugs.length === 0) return []
  const { data } = await anon()
    .from('learn_articles')
    .select(`internal_slug:slug, type, learn_article_content!inner(slug, title, reading_time_min), pillar:pillar_id(${SLUGS})`)
    .in('slug', internalSlugs)
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
  const found = new Map<string, RelatedArticle>()
  for (const r of (data ?? []) as Row[]) {
    const content = one(r.learn_article_content as Array<{ slug: string; title: string; reading_time_min: number | null }>)
    if (!content) continue
    const internal = r.internal_slug as string
    if (r.type === 'pillar') {
      found.set(internal, { internal_slug: internal, slug: content.slug, pillarSlug: content.slug, articleSlug: null, title: content.title, reading_time_min: content.reading_time_min })
      continue
    }
    const pillar = one(r.pillar as Row | Row[] | null)
    const pillarSlug = slugIn((pillar?.learn_article_content as SlugRow[] | null) ?? [], locale)
    if (!pillarSlug) continue
    found.set(internal, { internal_slug: internal, slug: content.slug, pillarSlug, articleSlug: content.slug, title: content.title, reading_time_min: content.reading_time_min })
  }
  return internalSlugs.map((s) => found.get(s)).filter((x): x is RelatedArticle => Boolean(x))
}
