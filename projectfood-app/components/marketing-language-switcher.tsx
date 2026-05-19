'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

const LOCALES = ['en', 'nl', 'it'] as const
type Locale = (typeof LOCALES)[number]

const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  en: { label: 'English',    flag: '/flags/en.svg' },
  nl: { label: 'Nederlands', flag: '/flags/nl.svg' },
  it: { label: 'Italiano',   flag: '/flags/it.svg' },
}

// External slug → internal page name, per locale
const SLUG_TO_INTERNAL: Record<Locale, Record<string, string>> = {
  en: { about: 'about', contact: 'contact', terms: 'terms', privacy: 'privacy', recipes: 'recipes', learn: 'learn' },
  nl: { over: 'about', contact: 'contact', voorwaarden: 'terms', privacy: 'privacy', recepten: 'recipes', leer: 'learn' },
  it: { 'chi-siamo': 'about', contatto: 'contact', termini: 'terms', privacy: 'privacy', ricette: 'recipes', impara: 'learn' },
}

// Internal page name → external slug per locale
const INTERNAL_TO_SLUG: Record<Locale, Record<string, string>> = {
  en: { about: 'about', contact: 'contact', terms: 'terms', privacy: 'privacy', recipes: 'recipes', learn: 'learn' },
  nl: { about: 'over', contact: 'contact', terms: 'voorwaarden', privacy: 'privacy', recipes: 'recepten', learn: 'leer' },
  it: { about: 'chi-siamo', contact: 'contatto', terms: 'termini', privacy: 'privacy', recipes: 'ricette', learn: 'impara' },
}

export function MarketingLanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()

  // pathname as the browser sees it, e.g. /nl/over or /en/ or /nl/leer/plant-diversity
  const parts = pathname.split('/').filter(Boolean)
  const locale = (parts[0] ?? 'en') as Locale
  const externalSlug = parts[1] // may be a localized slug like 'over' or 'leer'
  const internalPage = externalSlug
    ? (SLUG_TO_INTERNAL[locale]?.[externalSlug] ?? externalSlug)
    : ''
  // Sub-segments after the base (e.g. pillarSlug/articleSlug for /learn paths)
  const subSegments = parts.slice(2)

  return (
    <div className="flex items-center gap-1.5">
      {LOCALES.map((loc) => {
        const { label, flag } = LOCALE_META[loc]
        const slug = internalPage ? INTERNAL_TO_SLUG[loc]?.[internalPage] : undefined
        // For /learn paths, carry through sub-segments (slugs are shared across locales)
        const href = slug
          ? subSegments.length
            ? `/${loc}/${slug}/${subSegments.join('/')}`
            : `/${loc}/${slug}`
          : `/${loc}/`

        return (
          <a
            key={loc}
            href={href}
            title={label}
            aria-label={label}
            className="relative w-7 h-7 rounded-full overflow-hidden transition-opacity"
            style={{
              outline: currentLocale === loc ? '2px solid #F5C518' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: currentLocale === loc ? 1 : 0.45,
            }}
          >
            <Image src={flag} alt={label} fill unoptimized className="object-cover" />
          </a>
        )
      })}
    </div>
  )
}
