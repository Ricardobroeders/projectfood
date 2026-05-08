import type { Metadata } from 'next'
import type { ReactNode } from 'react'
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
  const t = await getTranslations({ locale, namespace: 'marketing.terms' })
  const { canonical, languages } = getAlternates('/terms', locale)
  return {
    title: t('title'),
    alternates: { canonical, languages },
  }
}

function Section({ title, children, last = false }: { title: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={last ? '' : 'mb-10'}>
      <h2 className="text-xl font-extrabold text-[#1F1B16] mb-3">{title}</h2>
      {children}
    </div>
  )
}

function BulletItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-[17px] text-[#6B645C] leading-relaxed">
      <span className="text-[#F5C518] font-bold shrink-0 mt-0.5">•</span>
      <span>{children}</span>
    </li>
  )
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing.terms' })

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
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-12">{t('intro')}</p>

          <Section title={t('s1Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s1Body')}</p>
          </Section>

          <Section title={t('s2Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s2Body')}</p>
          </Section>

          <Section title={t('s3Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s3Body')}</p>
          </Section>

          <Section title={t('s4Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed mb-3">{t('s4Intro')}</p>
            <ul className="space-y-2">
              <BulletItem>{t('s4Item1')}</BulletItem>
              <BulletItem>{t('s4Item2')}</BulletItem>
              <BulletItem>{t('s4Item3')}</BulletItem>
              <BulletItem>{t('s4Item4')}</BulletItem>
            </ul>
          </Section>

          <Section title={t('s5Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s5Body')}</p>
          </Section>

          <Section title={t('s6Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s6Body')}</p>
          </Section>

          <Section title={t('s7Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s7Body')}</p>
          </Section>

          <Section title={t('s8Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s8Body')}</p>
          </Section>

          <Section title={t('s9Title')}>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s9Body')}</p>
          </Section>

          <Section title={t('s10Title')} last>
            <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('s10Body')}</p>
          </Section>
        </div>
      </section>
    </>
  )
}
