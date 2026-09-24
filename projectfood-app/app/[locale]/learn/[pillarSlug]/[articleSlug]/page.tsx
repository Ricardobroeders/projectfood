import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLearnAlternates, getLocalizedHref } from '@/lib/marketing'
import {
  getAllPublishedClusterParams, getArticlesBySlugs, getClusterPage, getSiblingSlugs, lastModified,
} from '@/lib/learn'
import { countWords } from '@/lib/seo'
import { ClusterJsonLd } from '@/components/learn-json-ld'
import { LearnMarkdown } from '@/components/learn-markdown'
import { LearnFaq } from '@/components/learn-faq'
import { LearnRelated } from '@/components/learn-related'
import { LearnByline } from '@/components/learn-byline'

// Static with hourly revalidation; the publish script also revalidates on demand.
export const revalidate = 3600

export async function generateStaticParams() {
  return getAllPublishedClusterParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pillarSlug: string; articleSlug: string }>
}): Promise<Metadata> {
  const { locale, pillarSlug, articleSlug } = await params
  const data = await getClusterPage(pillarSlug, articleSlug, locale)
  if (!data) return {}
  const { article } = data
  const { canonical, languages } = getLearnAlternates(await getSiblingSlugs(article.id), locale)
  return {
    title: article.meta_title ?? article.title,
    description: article.meta_description ?? article.subtitle ?? undefined,
    alternates: { canonical, languages },
    keywords: article.sd_keywords,
  }
}

export default async function ClusterArticlePage({
  params,
}: {
  params: Promise<{ locale: string; pillarSlug: string; articleSlug: string }>
}) {
  const { locale, pillarSlug, articleSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const data = await getClusterPage(pillarSlug, articleSlug, locale)
  if (!data) notFound()

  const { article, pillar } = data
  const learnBase = getLocalizedHref('/learn', locale)
  const faq = article.sd_faq ?? []
  const related = await getArticlesBySlugs(article.related_article_slugs, locale)

  return (
    <>
      <ClusterJsonLd
        locale={locale}
        pillarSlug={pillarSlug}
        pillarTitle={pillar.title}
        articleSlug={articleSlug}
        title={article.meta_title ?? article.title}
        description={article.meta_description ?? article.subtitle ?? ''}
        keywords={article.sd_keywords}
        wordCount={countWords(article.body_md)}
        publishedAt={article.published_at}
        updatedAt={lastModified(article)}
        faq={faq}
        hubTitle={t('hubTitle')}
      />

      {/* Breadcrumb */}
      <div className="px-5 pt-6 pb-0">
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#A39B91] flex-wrap" aria-label="Breadcrumb">
            <Link href={learnBase} className="hover:text-[#6B645C] transition-colors">
              {t('backToLearn')}
            </Link>
            <span aria-hidden="true">›</span>
            <Link href={`${learnBase}/${pillarSlug}`} className="hover:text-[#6B645C] transition-colors truncate max-w-[140px]">
              {pillar.title}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-[#6B645C] truncate max-w-[160px]">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#F4EFE8] mt-4 pt-16 pb-20 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-lg text-[#6B645C] leading-relaxed max-w-lg mx-auto">
              {article.subtitle}
            </p>
          )}
          <LearnByline locale={locale} readingTimeMin={article.reading_time_min} publishedAt={article.published_at} />
        </div>
      </section>

      {/* Article body */}
      {article.body_md && (
        <section className="py-14 px-5">
          <div className="max-w-2xl mx-auto">
            <LearnMarkdown body={article.body_md} />
          </div>
        </section>
      )}

      {/* FAQ (visible; mirrored in the FAQPage JSON-LD above) */}
      <LearnFaq title={t('faqTitle')} items={faq} />

      {/* Citations */}
      {article.sd_citations && article.sd_citations.length > 0 && (
        <section className="px-5 pb-10">
          <div className="max-w-2xl mx-auto border-t border-[#E8E0D5] pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#A39B91] mb-4">
              {t('citations')}
            </h2>
            <ol className="flex flex-col gap-2">
              {article.sd_citations.map((c, i) => (
                <li key={i} className="text-sm text-[#6B645C]">
                  {c.author} ({c.year}). <em>{c.title}</em>.{' '}
                  {(c.doi || c.url) && (
                    <a
                      href={c.url ?? `https://doi.org/${c.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F1B16] underline"
                    >
                      {c.doi ?? c.url}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Related articles (two siblings, from related_article_slugs) */}
      <LearnRelated
        title={t('relatedArticles')}
        items={related}
        learnBase={learnBase}
        readingTimeLabel={(min) => t('readingTime', { min })}
      />

      {/* Back to pillar */}
      <section className="px-5 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`${learnBase}/${pillarSlug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B645C] hover:text-[#1F1B16] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('backToPillar', { title: pillar.title })}
          </Link>
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-[#1F1B16] py-16 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <Link
            href="/login"
            className="inline-block bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors"
          >
            {t('openApp')}
          </Link>
        </div>
      </section>
    </>
  )
}
