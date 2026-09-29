import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MarketingHeader } from '@/components/marketing-header'
import { MarketingLanguageSwitcher } from '@/components/marketing-language-switcher'
import { LOCALES, getLocalizedHref, type Locale } from '@/lib/marketing'
import '../globals.css'

// Root layout of the marketing site (one of two root layouts; the PWA's is app/(pwa)/layout.tsx).
// It lives inside [locale] on purpose: next-intl's getLocale() in a layout above the locale
// segment reads request headers, which turned every marketing page into a dynamic render
// (cache-control: no-store on all of them, revalidate = 3600 never applied). Here the locale is
// a route param, setRequestLocale() pins it, and the pages prerender.

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

export const viewport: Viewport = {
  themeColor: '#F5C518',
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'nl' }, { locale: 'it' }]
}

// Only the three locales exist. Without this, any unknown first segment that the middleware does
// not catch (`/foo.txt`, which the matcher skips) rendered the English home page with a 200.
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.home' })
  return {
    metadataBase: new URL('https://projectfood.dev'),
    title: {
      default: 'Project Food',
      template: '%s | Project Food',
    },
    description: t('metaDescription'),
    manifest: '/manifest.json',
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
  // dynamicParams alone did not stop `/foo.txt` from rendering the English home page with a 200.
  if (!LOCALES.includes(locale as Locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'marketing' })
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${jakarta.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased">
      {/* Header */}
      <MarketingHeader
        locale={locale}
        labels={{
          home: t('nav.home'),
          about: t('nav.about'),
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
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Image
                src="/images/logo.png"
                alt="Project Food"
                width={36}
                height={36}
                unoptimized
                className="shrink-0 rounded-xs"
              />
              <span className="font-bold text-[#1F1B16]">Project Food</span>
              <span aria-hidden="true" className="text-[#A39B91]">&middot;</span>
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
            <span className="text-xs text-[#6B645C]">© {new Date().getFullYear()} Project Food</span>
            <MarketingLanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </footer>
    </div>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
