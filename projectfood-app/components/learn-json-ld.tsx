const BASE = 'https://projectfood.dev'
const ORG_ID = `${BASE}/#organization`

const LEARN_BASE: Record<string, string> = { en: 'learn', nl: 'leer', it: 'impara' }

function learnUrl(locale: string, pillarSlug?: string, articleSlug?: string) {
  const base = LEARN_BASE[locale] ?? 'learn'
  const parts = [BASE, locale, base, pillarSlug, articleSlug].filter(Boolean)
  return parts.join('/')
}

type FaqItem = { question: string; answer: string }

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

// ── Hub page ─────────────────────────────────────────────────────────────────

type HubJsonLdProps = {
  locale: string
  title: string
  description: string
}

export function HubJsonLd({ locale, title, description }: HubJsonLdProps) {
  const url = learnUrl(locale)
  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: `${title} | Project Food`,
      description,
      inLanguage: locale,
      publisher: { '@id': ORG_ID },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}/` },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    },
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Project Food',
      url: BASE,
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

// ── Pillar page ───────────────────────────────────────────────────────────────

type PillarJsonLdProps = {
  locale: string
  pillarSlug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string | null
  updatedAt: string
  faq?: FaqItem[] | null
  hubTitle: string
}

export function PillarJsonLd({
  locale, pillarSlug, title, description, keywords,
  publishedAt, updatedAt, faq, hubTitle,
}: PillarJsonLdProps) {
  const hubUrl = learnUrl(locale)
  const url = learnUrl(locale, pillarSlug)
  const articleId = `${url}#article`

  const graph: object[] = [
    {
      '@type': 'Article',
      '@id': articleId,
      url,
      headline: title,
      description,
      inLanguage: locale,
      keywords,
      datePublished: publishedAt ?? updatedAt,
      dateModified: updatedAt,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': `${hubUrl}#webpage` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}/` },
        { '@type': 'ListItem', position: 2, name: hubTitle, item: hubUrl },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Project Food',
      url: BASE,
    },
  ]

  if (faq && faq.length > 0) graph.push(faqGraph(faq))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

// ── Cluster article page ──────────────────────────────────────────────────────

type ClusterJsonLdProps = {
  locale: string
  pillarSlug: string
  pillarTitle: string
  articleSlug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string | null
  updatedAt: string
  faq?: FaqItem[] | null
  hubTitle: string
}

export function ClusterJsonLd({
  locale, pillarSlug, pillarTitle, articleSlug, title, description,
  keywords, publishedAt, updatedAt, faq, hubTitle,
}: ClusterJsonLdProps) {
  const hubUrl = learnUrl(locale)
  const pillarUrl = learnUrl(locale, pillarSlug)
  const url = learnUrl(locale, pillarSlug, articleSlug)

  const graph: object[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      url,
      headline: title,
      description,
      inLanguage: locale,
      keywords,
      datePublished: publishedAt ?? updatedAt,
      dateModified: updatedAt,
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      isPartOf: {
        '@type': 'Article',
        '@id': `${pillarUrl}#article`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/${locale}/` },
        { '@type': 'ListItem', position: 2, name: hubTitle, item: hubUrl },
        { '@type': 'ListItem', position: 3, name: pillarTitle, item: pillarUrl },
        { '@type': 'ListItem', position: 4, name: title, item: url },
      ],
    },
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Project Food',
      url: BASE,
    },
  ]

  if (faq && faq.length > 0) graph.push(faqGraph(faq))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}
