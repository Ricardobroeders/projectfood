import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
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
      <header
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm"
        style={{ boxShadow: '0 1px 0 rgba(31,27,22,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={`/${locale}/`} className="flex items-center gap-2 shrink-0">
            <Image src="/icons/logo.svg" alt="Project Food" width={26} height={26} />
            <span className="font-bold text-[#1F1B16] text-[15px]">Project Food</span>
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#6B645C]">
            <Link
              href={getLocalizedHref('/about', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {t('nav.about')}
            </Link>
            <Link
              href={getLocalizedHref('/recipes', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {t('nav.recipes')}
            </Link>
          </nav>

          {/* Right: lang switcher + CTA */}
          <div className="flex items-center gap-3">
            <MarketingLanguageSwitcher currentLocale={locale} />
            <Link
              href="/login"
              className="bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-semibold text-sm px-4 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              {t('nav.openApp')}
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#F4EFE8] py-12 mt-16">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Image src="/icons/logo.svg" alt="Project Food" width={22} height={22} />
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
          <div className="mt-8 pt-6 border-t border-[#E8E0D5] text-xs text-[#A39B91]">
            © {new Date().getFullYear()} Project Food
          </div>
        </div>
      </footer>
    </div>
  )
}
