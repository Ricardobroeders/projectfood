import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
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
  const t = await getTranslations({ locale, namespace: 'marketing.contact' })
  const { canonical, languages } = getAlternates('/contact', locale)
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical, languages },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.contact' })

  return (
    <>
      {/* Hero */}
      <section className="bg-[#F4EFE8] pt-20 pb-24 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-block text-xs font-semibold tracking-widest uppercase text-[#6B645C] mb-6 px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,197,24,0.18)' }}
          >
            Community
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-[#6B645C] leading-relaxed max-w-lg mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="py-20 px-5">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-10">{t('body')}</p>
          <a
            href="https://discord.gg/p5ggwbyvPk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#4752C4] text-white font-bold text-base px-8 py-4 rounded-full transition-colors"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <path d="M18.628 1.33A18.16 18.16 0 0 0 14.588 0a.068.068 0 0 0-.072.034c-.175.31-.369.715-.505 1.033a16.76 16.76 0 0 0-5.023 0A10.54 10.54 0 0 0 8.48.034.07.07 0 0 0 8.41 0a18.12 18.12 0 0 0-4.04 1.33.064.064 0 0 0-.03.025C.533 5.86-.32 10.255.1 14.596a.075.075 0 0 0 .028.05 18.24 18.24 0 0 0 5.495 2.777.07.07 0 0 0 .077-.025c.424-.578.801-1.188 1.124-1.83a.068.068 0 0 0-.037-.095 12.02 12.02 0 0 1-1.72-.82.07.07 0 0 1-.007-.115c.116-.086.231-.176.341-.267a.067.067 0 0 1 .07-.009c3.607 1.646 7.51 1.646 11.075 0a.067.067 0 0 1 .071.008c.11.091.225.182.342.268a.07.07 0 0 1-.006.115c-.549.32-1.12.592-1.72.82a.068.068 0 0 0-.037.095c.328.641.706 1.251 1.124 1.83a.07.07 0 0 0 .077.025 18.19 18.19 0 0 0 5.502-2.778.07.07 0 0 0 .028-.049c.5-5.177-.838-9.674-3.548-13.241a.055.055 0 0 0-.028-.026ZM7.35 11.968c-1.082 0-1.974-.993-1.974-2.213 0-1.22.875-2.213 1.974-2.213 1.107 0 1.99 1.002 1.974 2.213 0 1.22-.875 2.213-1.974 2.213Zm7.298 0c-1.082 0-1.974-.993-1.974-2.213 0-1.22.875-2.213 1.974-2.213 1.107 0 1.99 1.002 1.974 2.213 0 1.22-.867 2.213-1.974 2.213Z" fill="currentColor"/>
            </svg>
            {t('cta')}
          </a>
          <p className="mt-12 text-sm text-[#A39B91]">
            {t('emailLabel')}{' '}
            <a href="mailto:info@projectfood.dev" className="text-[#6B645C] hover:text-[#1F1B16] transition-colors underline underline-offset-2">
              info@projectfood.dev
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
