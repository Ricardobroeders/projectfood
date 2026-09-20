import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAlternates } from '@/lib/marketing'
import { DeleteAccountFlow } from './DeleteAccountFlow'

// The account-deletion page both stores ask for: the in-app route, a self-service web flow and a
// manual fallback. Public, no PWA sign-in involved (the flow keeps its session in memory).

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.deleteAccount' })
  const { canonical, languages } = getAlternates('/delete-account', locale)
  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical, languages },
  }
}

const para = 'text-[17px] text-[#6B645C] leading-relaxed'

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.deleteAccount' })

  return (
    <>
      <section className="bg-[#F4EFE8] pt-20 pb-16 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-4">
            {t('title')}
          </h1>
          <p className={para}>{t('intro')}</p>
        </div>
      </section>

      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-extrabold text-[#1F1B16] mb-3">{t('inAppTitle')}</h2>
          <p className={`${para} mb-10`}>{t('inAppBody')}</p>

          <h2 className="text-xl font-extrabold text-[#1F1B16] mb-3">{t('webTitle')}</h2>
          <p className={`${para} mb-6`}>{t('webBody')}</p>
          <DeleteAccountFlow />

          <p className="text-sm text-[#6B645C] leading-relaxed mt-10">{t('fallback')}</p>
          <p className="text-sm text-[#6B645C] leading-relaxed mt-3">{t('joined')}</p>
        </div>
      </section>
    </>
  )
}
