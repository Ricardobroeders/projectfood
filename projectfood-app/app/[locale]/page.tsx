import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { getAlternates } from '@/lib/marketing'
import { organizationNode } from '@/lib/seo'

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
      images: [{ url: `https://projectfood.dev/${locale}/og`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: 'Project Food', description: t('heroBody'), images: [`https://projectfood.dev/${locale}/og`] },
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
      organizationNode(),
    ],
  }

  const features = [
    {
      image: '/images/fruits.png',
      title: t('feature1Title'),
      body: t('feature1Body'),
    },
    {
      image: '/images/calendar.png',
      title: t('feature2Title'),
      body: t('feature2Body'),
    },
    {
      image: '/images/shopping-cart-web.png',
      title: t('feature3Title'),
      body: t('feature3Body'),
    },
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
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-block bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors"
            >
              {t('openApp')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-white text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors hover:text-[#F59A0E]"
            >
              {t('whyWeDoThis')}
            </Link>
          </div>
        </div>
      </section>

      {/* Fruit strip */}
      <section className="w-full overflow-hidden">
        <Image
          src="/images/fruit-line-mobile.png"
          alt=""
          width={800}
          height={200}
          className="w-full h-auto md:hidden"
          sizes="100vw"
          priority
        />
        <Image
          src="/images/fruit-line-web.png"
          alt=""
          width={1440}
          height={200}
          className="w-full h-auto hidden md:block"
          priority
          sizes="100vw"
        />
      </section>

      {/* Feature cards */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ image, title, body }) => (
            <div
              key={title}
              className="bg-[#F4EFE8] rounded-[24px] p-8"
            >
              <div className="mb-4">
                <Image src={image} alt="" width={64} height={64} />
              </div>
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
          <p className="text-[#6B645C] mb-8">{t('heroBody')}</p>
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
