import type { Metadata } from 'next'
import Link from 'next/link'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getAlternates, getLocalizedHref } from '@/lib/marketing'

/** One numbered section of the policy; the copy lives in messages/<locale>.json under marketing.privacy.sections. */
type Section = {
  title: string
  body?: string
  intro?: string
  items?: string[]
  outro?: string
  link?: 'deleteAccount'
  linkLabel?: string
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.privacy' })
  const { canonical, languages } = getAlternates('/privacy', locale)
  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical, languages },
  }
}

const para = 'text-[17px] text-[#6B645C] leading-relaxed'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.privacy' })
  const sections = t.raw('sections') as Section[]

  return (
    <>
      <section className="bg-[#F4EFE8] pt-20 pb-16 px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F1B16] leading-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-sm text-[#A39B91]">{t('effectiveDate')}</p>
        </div>
      </section>

      <section className="py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <p className={`${para} mb-12`}>{t('intro')}</p>

          {sections.map((s, i) => (
            <div key={s.title} className={i === sections.length - 1 ? '' : 'mb-10'}>
              <h2 className="text-xl font-extrabold text-[#1F1B16] mb-3">{s.title}</h2>
              {s.body && <p className={para}>{s.body}</p>}
              {s.intro && <p className={`${para} mb-3`}>{s.intro}</p>}
              {s.items && (
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className={`flex gap-3 ${para}`}>
                      <span className="text-[#F5C518] font-bold shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.outro && <p className={`${para} mt-4`}>{s.outro}</p>}
              {s.link === 'deleteAccount' && s.linkLabel && (
                <p className="mt-4">
                  <Link
                    href={getLocalizedHref('/delete-account', locale)}
                    className="text-[17px] font-semibold text-[#1F1B16] underline decoration-[#F5C518] decoration-2 underline-offset-4 hover:decoration-[#F59A0E]"
                  >
                    {s.linkLabel}
                  </Link>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
