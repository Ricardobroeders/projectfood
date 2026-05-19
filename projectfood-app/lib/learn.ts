import { createClient as createClientJs } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

// Cookie-free client for build-time use (generateStaticParams, sitemap).
// Public RLS allows anon reads on published learn content.
function createAnonClient() {
  return createClientJs(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

export type ArticleType = 'pillar' | 'cluster'

export type LearnArticle = {
  id: string
  slug: string
  type: ArticleType
  pillar_id: string | null
  display_order: number
  emoji: string | null
  cover_image_url: string | null
  published_at: string | null
  updated_at: string
}

export type LearnArticleContent = {
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
  related_article_slugs: string[]
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

const ARTICLE_CONTENT_SELECT = `
  id, slug, type, pillar_id, display_order, emoji, cover_image_url, published_at, updated_at,
  learn_article_content!inner (
    title, subtitle, body_md, reading_time_min, meta_title, meta_description,
    sd_keywords, sd_faq, sd_citations, related_article_slugs
  )
`

function mergeContent(row: Record<string, unknown>): LearnArticleWithContent {
  const content = (row.learn_article_content as LearnArticleContent[])[0]
  const { learn_article_content: _, ...article } = row
  return { ...article, ...content } as LearnArticleWithContent
}

export async function getAllPublishedPillarSlugs(): Promise<string[]> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('learn_articles')
    .select('slug')
    .eq('type', 'pillar')
    .eq('is_published', true)
  return (data ?? []).map((r) => r.slug)
}

export async function getAllPublishedClusterSlugs(): Promise<
  Array<{ pillarSlug: string; articleSlug: string }>
> {
  const supabase = createAnonClient()
  const { data } = await supabase
    .from('learn_articles')
    .select('slug, pillar:pillar_id(slug)')
    .eq('type', 'cluster')
    .eq('is_published', true)
  return (data ?? []).map((r) => {
    const p = r.pillar
    const pillarSlug = Array.isArray(p) ? (p[0] as { slug: string })?.slug : (p as { slug: string } | null)?.slug
    return { pillarSlug: pillarSlug ?? '', articleSlug: r.slug }
  })
}

export async function getLearnHub(locale: string): Promise<PillarSummary[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('type', 'pillar')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .order('display_order')
  if (!data) return []
  return data.map(mergeContent).map(({ slug, emoji, title, subtitle, reading_time_min, display_order }) => ({
    slug, emoji, title, subtitle, reading_time_min, display_order,
  }))
}

export async function getPillarPage(
  pillarSlug: string,
  locale: string,
): Promise<PillarPageData | null> {
  const supabase = await createClient()

  const { data: pillarRow } = await supabase
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('slug', pillarSlug)
    .eq('type', 'pillar')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .single()

  if (!pillarRow) return null
  const pillar = mergeContent(pillarRow as Record<string, unknown>)

  const { data: clusterRows } = await supabase
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('pillar_id', pillar.id)
    .eq('type', 'cluster')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .order('display_order')

  const clusters = (clusterRows ?? []).map((r) => mergeContent(r as Record<string, unknown>))

  return { pillar, clusters }
}

export async function getClusterPage(
  pillarSlug: string,
  articleSlug: string,
  locale: string,
): Promise<{ article: LearnArticleWithContent; pillar: Pick<LearnArticleWithContent, 'slug' | 'title'> } | null> {
  const supabase = await createClient()

  const { data: articleRow } = await supabase
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('slug', articleSlug)
    .eq('type', 'cluster')
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .single()

  if (!articleRow) return null
  const article = mergeContent(articleRow as Record<string, unknown>)

  const { data: pillarRow } = await supabase
    .from('learn_articles')
    .select(ARTICLE_CONTENT_SELECT)
    .eq('id', article.pillar_id)
    .eq('slug', pillarSlug)
    .eq('is_published', true)
    .eq('learn_article_content.locale', locale)
    .single()

  if (!pillarRow) return null
  const pillarFull = mergeContent(pillarRow as Record<string, unknown>)

  return { article, pillar: { slug: pillarFull.slug, title: pillarFull.title } }
}
