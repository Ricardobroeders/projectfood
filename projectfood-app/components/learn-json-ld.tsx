import { learnUrl } from '@/lib/marketing'
import { AUTHOR_ID, BCP47, ORG_ID, SITE, organizationNode, personNode } from '@/lib/seo'

type FaqItem = { question: string; answer: string }
type PartRef = { slug: string; title: string }

function faqGraph(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function jsonLd(graph: object[]) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

// ── Hub page ─────────────────────────────────────────────────────────────────

type HubJsonLdProps = {
  locale: string
  title: string
  description: string
  pillars: PartRef[]
}

export function HubJsonLd({ locale, title, description, pillars }: HubJsonLdProps) {
  const url = learnUrl(locale)
  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: `${title} | Project Food`,
      description,
      inLanguage: BCP47[locale] ?? locale,
      publisher: { '@id': ORG_ID },
      hasPart: pillars.map((p) => ({
        '@type': 'Article',
        '@id': `${learnUrl(locale, p.slug)}#article`,
        name: p.title,
        url: learnUrl(locale, p.slug),
      })),
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    },
    organizationNode(),
  ]
  return jsonLd(graph)
}

// ── Article pages ────────────────────────────────────────────────────────────

type ArticleJsonLdBase = {
  locale: string
  title: string
  description: string
  keywords: string[]
  wordCount: number
  publishedAt: string | null
  /** The later of the article's and the content row's updated_at (see lastModified). */
  updatedAt: string
  /** Only pass the FAQ that is rendered on the page; the markup must match visible content. */
  faq?: FaqItem[] | null
  hubTitle: string
}

function articleNode(url: string, p: ArticleJsonLdBase, extra: object) {
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: p.title,
    description: p.description,
    inLanguage: BCP47[p.locale] ?? p.locale,
    keywords: p.keywords,
    wordCount: p.wordCount,
    datePublished: p.publishedAt ?? p.updatedAt,
    dateModified: p.updatedAt,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': ORG_ID },
    ...extra,
  }
}

type PillarJsonLdProps = ArticleJsonLdBase & {
  pillarSlug: string
  clusters: PartRef[]
}

export function PillarJsonLd(p: PillarJsonLdProps) {
  const hubUrl = learnUrl(p.locale)
  const url = learnUrl(p.locale, p.pillarSlug)

  const graph: object[] = [
    articleNode(url, p, {
      isPartOf: { '@id': `${hubUrl}#webpage` },
      hasPart: p.clusters.map((c) => ({
        '@type': 'Article',
        '@id': `${learnUrl(p.locale, p.pillarSlug, c.slug)}#article`,
        name: c.title,
        url: learnUrl(p.locale, p.pillarSlug, c.slug),
      })),
    }),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${p.locale}/` },
        { '@type': 'ListItem', position: 2, name: p.hubTitle, item: hubUrl },
        { '@type': 'ListItem', position: 3, name: p.title, item: url },
      ],
    },
    personNode(p.locale),
    organizationNode(),
  ]
  if (p.faq && p.faq.length > 0) graph.push(faqGraph(p.faq))
  return jsonLd(graph)
}

type ClusterJsonLdProps = ArticleJsonLdBase & {
  pillarSlug: string
  pillarTitle: string
  articleSlug: string
}

export function ClusterJsonLd(p: ClusterJsonLdProps) {
  const hubUrl = learnUrl(p.locale)
  const pillarUrl = learnUrl(p.locale, p.pillarSlug)
  const url = learnUrl(p.locale, p.pillarSlug, p.articleSlug)

  const graph: object[] = [
    articleNode(url, p, {
      isPartOf: { '@type': 'Article', '@id': `${pillarUrl}#article` },
    }),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${p.locale}/` },
        { '@type': 'ListItem', position: 2, name: p.hubTitle, item: hubUrl },
        { '@type': 'ListItem', position: 3, name: p.pillarTitle, item: pillarUrl },
        { '@type': 'ListItem', position: 4, name: p.title, item: url },
      ],
    },
    personNode(p.locale),
    organizationNode(),
  ]
  if (p.faq && p.faq.length > 0) graph.push(faqGraph(p.faq))
  return jsonLd(graph)
}
