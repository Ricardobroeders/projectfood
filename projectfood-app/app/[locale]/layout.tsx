import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { MarketingHeader } from '@/components/marketing-header'
import { MarketingLanguageSwitcher } from '@/components/marketing-language-switcher'
import { getLocalizedHref } from '@/lib/marketing'

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
  return {
    title: {
      default: 'Project Food',
      template: '%s | Project Food',
    },
    description: t('heroBody'),
  }
}

export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing' })

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased">
      {/* Header */}
      <MarketingHeader
        locale={locale}
        labels={{
          home: t('nav.home'),
          about: t('nav.about'),
          recipes: t('nav.recipes'),
          contact: t('nav.contact'),
          learn: t('nav.learn'),
          openApp: t('nav.openApp'),
        }}
      />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#F4EFE8] py-12 mt-16">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src="/images/logo.png"
                  alt="Project Food"
                  width={36}
                  height={36}
                  unoptimized
                  className="shrink-0 rounded-xs"
                />
                <span className="font-bold text-[#1F1B16]">Project Food</span>
              </div>
              <p className="text-sm text-[#6B645C]">{t('footer.tagline')}</p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6B645C]">
              <Link href={getLocalizedHref('/about',   locale)} className="hover:text-[#1F1B16] transition-colors">{t('footer.about')}</Link>
              <Link href={getLocalizedHref('/contact', locale)} className="hover:text-[#1F1B16] transition-colors">{t('footer.contact')}</Link>
              <Link href={getLocalizedHref('/terms',   locale)} className="hover:text-[#1F1B16] transition-colors">{t('footer.terms')}</Link>
              <Link href={getLocalizedHref('/privacy', locale)} className="hover:text-[#1F1B16] transition-colors">{t('footer.privacy')}</Link>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-[#E8E0D5] flex items-center justify-between gap-4">
            <span className="text-xs text-[#A39B91]">© {new Date().getFullYear()} Project Food</span>
            <MarketingLanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </footer>
    </div>
  )
}
