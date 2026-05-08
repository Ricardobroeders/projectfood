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
  const t = await getTranslations({ locale, namespace: 'marketing.about' })
  const { canonical, languages } = getAlternates('/about', locale)
  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
    alternates: { canonical, languages },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.about' })

  return (
    <>
      {/* Hero */}
      <section className="bg-[#F4EFE8] pt-20 pb-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6B645C] mb-6 px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,197,24,0.18)' }}
          >
            {t('heroLabel')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-lg text-[#6B645C] leading-relaxed max-w-lg mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{t('storyTitle')}</h2>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-5">{t('story1')}</p>
          <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('story2')}</p>
        </div>
      </section>

      {/* Discovery + science */}
      <section className="bg-[#F4EFE8] py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{t('discoveryTitle')}</h2>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-5">{t('discovery1')}</p>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-10">{t('discovery2')}</p>
          <div className="bg-[#1F1B16] rounded-[24px] px-8 py-6 text-center">
            <p className="text-xl font-extrabold text-[#F5C518]">{t('callout')}</p>
          </div>
        </div>
      </section>

      {/* Why the app */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{t('appTitle')}</h2>
          <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('app1')}</p>
        </div>
      </section>

      {/* Vision + CTA */}
      <section className="bg-[#1F1B16] py-20 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">{t('visionTitle')}</h2>
          <p className="text-[#A39B91] leading-relaxed mb-8">{t('vision1')}</p>
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
