import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAlternates, getLocalizedHref } from '@/lib/marketing'
import { getLearnHub } from '@/lib/learn'
import { HubJsonLd } from '@/components/learn-json-ld'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const { canonical, languages } = getAlternates('/learn', locale)
  return {
    title: t('hubTitle'),
    description: t('hubSubtitle'),
    alternates: { canonical, languages },
  }
}

export default async function LearnHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const pillars = await getLearnHub(locale)
  const learnBase = getLocalizedHref('/learn', locale)

  return (
    <>
      <HubJsonLd locale={locale} title={t('hubTitle')} description={t('hubSubtitle')} />

      {/* Hero */}
      <section className="bg-[#F4EFE8] pt-20 pb-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6B645C] mb-6 px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,197,24,0.18)' }}
          >
            {t('hubLabel')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {t('hubTitle')}
          </h1>
          <p className="text-lg text-[#6B645C] leading-relaxed max-w-lg mx-auto">
            {t('hubSubtitle')}
          </p>
        </div>
      </section>

      {/* Pillar cards */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          {pillars.length === 0 ? (
            <p className="text-center text-[#A39B91]">Coming soon.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {pillars.map((pillar) => (
                <Link
                  key={pillar.slug}
                  href={`${learnBase}/${pillar.slug}`}
                  className="group flex items-start gap-5 bg-white rounded-[24px] px-7 py-6 transition-shadow hover:shadow-md"
                  style={{ boxShadow: '0 2px 12px rgba(31,27,22,0.07)' }}
                >
                  {pillar.emoji && (
                    <span className="text-4xl shrink-0 mt-0.5">{pillar.emoji}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-extrabold text-[#1F1B16] group-hover:text-[#F59A0E] transition-colors leading-snug mb-1">
                      {pillar.title}
                    </h2>
                    {pillar.subtitle && (
                      <p className="text-[#6B645C] text-sm leading-relaxed">{pillar.subtitle}</p>
                    )}
                    {pillar.reading_time_min && (
                      <p className="text-xs text-[#A39B91] mt-2">
                        {t('readingTime', { min: pillar.reading_time_min })}
                      </p>
                    )}
                  </div>
                  <svg
                    className="shrink-0 mt-1 text-[#A39B91] group-hover:text-[#F59A0E] transition-colors"
                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                    aria-hidden="true"
                  >
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-[#1F1B16] py-20 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            {t('hubTitle')}
          </h2>
          <p className="text-[#A39B91] leading-relaxed mb-8">{t('hubSubtitle')}</p>
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
