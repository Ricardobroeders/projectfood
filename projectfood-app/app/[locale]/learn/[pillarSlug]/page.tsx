import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLearnAlternates, getLocalizedHref } from '@/lib/marketing'
import { getAllPublishedPillarSlugs, getPillarPage } from '@/lib/learn'
import { PillarJsonLd } from '@/components/learn-json-ld'
import { LearnMarkdown } from '@/components/learn-markdown'

export async function generateStaticParams() {
  const slugs = await getAllPublishedPillarSlugs()
  return ['en', 'nl', 'it'].flatMap((locale) =>
    slugs.map((pillarSlug) => ({ locale, pillarSlug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pillarSlug: string }>
}): Promise<Metadata> {
  const { locale, pillarSlug } = await params
  const data = await getPillarPage(pillarSlug, locale)
  if (!data) return {}
  const { pillar } = data
  const { canonical, languages } = getLearnAlternates(pillarSlug, null, locale)
  return {
    title: pillar.meta_title ?? pillar.title,
    description: pillar.meta_description ?? pillar.subtitle ?? undefined,
    alternates: { canonical, languages },
    keywords: pillar.sd_keywords,
  }
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ locale: string; pillarSlug: string }>
}) {
  const { locale, pillarSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const data = await getPillarPage(pillarSlug, locale)
  if (!data) notFound()

  const { pillar, clusters } = data
  const learnBase = getLocalizedHref('/learn', locale)

  return (
    <>
      <PillarJsonLd
        locale={locale}
        pillarSlug={pillarSlug}
        title={pillar.meta_title ?? pillar.title}
        description={pillar.meta_description ?? pillar.subtitle ?? ''}
        keywords={pillar.sd_keywords}
        publishedAt={pillar.published_at}
        updatedAt={pillar.updated_at}
        faq={pillar.sd_faq}
        hubTitle={t('hubTitle')}
      />

      {/* Breadcrumb */}
      <div className="px-5 pt-6 pb-0">
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-[#A39B91]" aria-label="Breadcrumb">
            <Link href={learnBase} className="hover:text-[#6B645C] transition-colors">
              {t('backToLearn')}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-[#6B645C] truncate">{pillar.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#F4EFE8] mt-4 pt-16 pb-20 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          {pillar.emoji && (
            <div className="text-5xl mb-5">{pillar.emoji}</div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {pillar.title}
          </h1>
          {pillar.subtitle && (
            <p className="text-lg text-[#6B645C] leading-relaxed max-w-lg mx-auto">
              {pillar.subtitle}
            </p>
          )}
          {pillar.reading_time_min && (
            <p className="text-sm text-[#A39B91] mt-4">
              {t('readingTime', { min: pillar.reading_time_min })}
            </p>
          )}
        </div>
      </section>

      {/* Article body */}
      {pillar.body_md && (
        <section className="py-14 px-5">
          <div className="max-w-2xl mx-auto">
            <LearnMarkdown body={pillar.body_md} />
          </div>
        </section>
      )}

      {/* Citations */}
      {pillar.sd_citations && pillar.sd_citations.length > 0 && (
        <section className="px-5 pb-10">
          <div className="max-w-2xl mx-auto border-t border-[#E8E0D5] pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#A39B91] mb-4">
              {t('citations')}
            </h2>
            <ol className="flex flex-col gap-2">
              {pillar.sd_citations.map((c, i) => (
                <li key={i} className="text-sm text-[#6B645C]">
                  {c.author} ({c.year}). <em>{c.title}</em>.{' '}
                  {c.doi && (
                    <a
                      href={c.url ?? `https://doi.org/${c.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1F1B16] underline"
                    >
                      {c.doi}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Cluster articles */}
      {clusters.length > 0 && (
        <section className="bg-[#F4EFE8] py-16 px-5">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">
              {t('articleCount', { count: clusters.length })}
            </h2>
            <div className="flex flex-col gap-4">
              {clusters.map((cluster) => (
                <Link
                  key={cluster.slug}
                  href={`${learnBase}/${pillarSlug}/${cluster.slug}`}
                  className="group flex items-center justify-between bg-white rounded-[18px] px-6 py-4 transition-shadow hover:shadow-md"
                  style={{ boxShadow: '0 2px 8px rgba(31,27,22,0.06)' }}
                >
                  <div>
                    <p className="font-bold text-[#1F1B16] group-hover:text-[#F59A0E] transition-colors">
                      {cluster.title}
                    </p>
                    {cluster.reading_time_min && (
                      <p className="text-xs text-[#A39B91] mt-0.5">
                        {t('readingTime', { min: cluster.reading_time_min })}
                      </p>
                    )}
                  </div>
                  <svg
                    className="shrink-0 text-[#A39B91] group-hover:text-[#F59A0E] transition-colors"
                    width="18" height="18" viewBox="0 0 20 20" fill="none"
                    aria-hidden="true"
                  >
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
