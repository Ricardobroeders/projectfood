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
  const t = await getTranslations({ locale, namespace: 'marketing' })
  const { canonical, languages } = getAlternates('/contact', locale)
  return {
    title: t('nav.contact'),
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
  const t = await getTranslations({ locale, namespace: 'marketing' })

  return (
    <section className="max-w-2xl mx-auto px-5 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-[#1F1B16] mb-4">{t('nav.contact')}</h1>
      <p className="text-[#6B645C]">{t('placeholder.workInProgress')}</p>
    </section>
  )
}
