import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getAlternates } from '@/lib/marketing'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.home' })
  const { canonical, languages } = getAlternates('/', locale)

  return {
    title: `Project Food — ${t('heroSubtitle')}`,
    description: t('heroBody'),
    alternates: { canonical, languages },
    openGraph: {
      title: 'Project Food',
      description: t('heroBody'),
      url: canonical,
      siteName: 'Project Food',
      locale,
      type: 'website',
    },
    twitter: { card: 'summary', title: 'Project Food', description: t('heroBody') },
  }
}

export default async function MarketingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.home' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://projectfood.dev/#website',
        url: 'https://projectfood.dev/',
        name: 'Project Food',
        description: t('heroBody'),
        inLanguage: locale,
      },
      {
        '@type': 'Organization',
        '@id': 'https://projectfood.dev/#organization',
        name: 'Project Food',
        url: 'https://projectfood.dev/',
        logo: 'https://projectfood.dev/icons/logo.svg',
      },
    ],
  }

  const features = [
    { icon: '🌿', title: t('feature1Title'), body: t('feature1Body') },
    { icon: '📈', title: t('feature2Title'), body: t('feature2Body') },
    { icon: '🛒', title: t('feature3Title'), body: t('feature3Body') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[#F4EFE8] pt-20 pb-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6B645C] mb-6 px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,197,24,0.18)' }}
          >
            30 plants a week
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-3">
            {t('heroTitle')}
          </h1>
          <p className="text-3xl md:text-4xl font-extrabold text-[#F5C518] mb-6">
            {t('heroSubtitle')}
          </p>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-10 max-w-lg mx-auto">
            {t('heroBody')}
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors"
          >
            {t('openApp')}
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon, title, body }) => (
            <div
              key={title}
              className="bg-[#F4EFE8] rounded-[24px] p-8"
            >
              <div className="text-3xl mb-4">{icon}</div>
              <h2 className="text-[17px] font-bold text-[#1F1B16] mb-2">{title}</h2>
              <p className="text-[15px] text-[#6B645C] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-5 text-center bg-[#1F1B16]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">{t('heroTitle')}</h2>
          <p className="text-[#A39B91] mb-8">{t('heroBody')}</p>
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
