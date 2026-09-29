import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { getAlternates, learnPath } from '@/lib/marketing'
import { organizationNode, softwareApplicationNode, STORE } from '@/lib/seo'
import { LearnFaq } from '@/components/learn-faq'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

const RENDER = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/food-images'

/** The pillar and two clusters the home page points at, per locale (public slugs). */
const LEARN_LINKS: Record<string, { pillar: string; c1: string; c2: string }> = {
  en: { pillar: 'learn-to-eat-everything', c1: 'how-many-times-to-try-a-food', c2: 'toddler-wont-eat' },
  nl: { pillar: 'alles-leren-eten', c1: 'hoe-vaak-proeven', c2: 'peuter-wil-niet-eten' },
  it: { pillar: 'imparare-a-mangiare-tutto', c1: 'il-bambino-non-mangia', c2: 'neofobia-alimentare' },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.home' })
  const { canonical, languages } = getAlternates('/', locale)
  const og = `https://projectfood.dev/${locale}/og`

  return {
    title: { absolute: t('metaTitle') },
    description: t('metaDescription'),
    alternates: { canonical, languages },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: canonical,
      siteName: 'Project Food',
      locale,
      type: 'website',
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: t('metaTitle'), description: t('metaDescription'), images: [og] },
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
  const links = LEARN_LINKS[locale] ?? LEARN_LINKS.en

  const faq = ([
    ['faq1q', 'faq1a'], ['faq2q', 'faq2a'], ['faq3q', 'faq3a'],
    ['faq4q', 'faq4a'], ['faq5q', 'faq5a'], ['faq6q', 'faq6a'],
  ] as const).map(([q, a]) => ({ question: t(q), answer: t(a) }))
  const app = softwareApplicationNode(locale, t('metaDescription'))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://projectfood.dev/#website',
        url: 'https://projectfood.dev/',
        name: 'Project Food',
        description: t('metaDescription'),
        inLanguage: locale,
        publisher: { '@id': 'https://projectfood.dev/#organization' },
      },
      organizationNode(),
      ...(app ? [app] : []),
      {
        '@type': 'FAQPage',
        '@id': `https://projectfood.dev/${locale}#faq`,
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  }

  const steps = [
    { image: `${RENDER}/carrot.png`, title: t('step1Title'), body: t('step1Body') },
    { image: `${RENDER}/strawberry.png`, title: t('step2Title'), body: t('step2Body') },
    { image: `${RENDER}/broccoli.png`, title: t('step3Title'), body: t('step3Body') },
  ]

  const learn = [
    { href: learnPath(locale, links.pillar), label: t('learnPillar') },
    { href: learnPath(locale, links.pillar, links.c1), label: t('learnCluster1') },
    { href: learnPath(locale, links.pillar, links.c2), label: t('learnCluster2') },
  ]

  const playButton = 'inline-block bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors'

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
            {t('heroLabel')}
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
            <a href={STORE.playUrl} className={playButton} rel="noopener">
              {t('ctaPlay')}
            </a>
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-white text-[#1F1B16] font-bold text-base px-8 py-4 rounded-full transition-colors hover:text-[#F59A0E]"
            >
              {t('whyWeDoThis')}
            </Link>
          </div>
          <p className="text-sm text-[#6B645C] mt-5">{t('ctaPlayNote')}</p>
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

      {/* Three steps */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-8 text-center">{t('stepsTitle')}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
            {steps.map(({ image, title, body }, i) => (
              <li key={title} className="bg-[#F4EFE8] rounded-[24px] p-8">
                <div className="mb-4 flex items-center gap-4">
                  <Image src={image} alt="" width={72} height={72} sizes="72px" />
                  <span className="text-sm font-semibold text-[#6B645C]">{i + 1}</span>
                </div>
                <h3 className="text-[17px] font-bold text-[#1F1B16] mb-2">{title}</h3>
                <p className="text-[15px] text-[#6B645C] leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The science, two sentences */}
      <section className="bg-[#F4EFE8] py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{t('scienceTitle')}</h2>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-5">{t('science1')}</p>
          <p className="text-[17px] text-[#6B645C] leading-relaxed">{t('science2')}</p>
        </div>
      </section>

      {/* Learn links */}
      <section className="py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-4">{t('learnTitle')}</h2>
          <p className="text-[17px] text-[#6B645C] leading-relaxed mb-6">{t('learnBody')}</p>
          <ul className="flex flex-col gap-3 list-none p-0 m-0">
            {learn.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block bg-[#F4EFE8] rounded-[18px] px-6 py-4 font-bold text-[#1F1B16] hover:text-[#F59A0E] transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ, visible and mirrored in FAQPage JSON-LD */}
      <LearnFaq title={t('faqTitle')} items={faq} />

      {/* Bottom CTA */}
      <section className="py-20 px-5 text-center bg-[#1F1B16]">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4">{t('bottomTitle')}</h2>
          <p className="text-[#A39B91] mb-8">{t('bottomBody')}</p>
          <a href={STORE.playUrl} className={playButton} rel="noopener">
            {t('ctaPlay')}
          </a>
        </div>
      </section>
    </>
  )
}
