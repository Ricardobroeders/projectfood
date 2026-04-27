'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

type Locale = 'en' | 'nl'

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English',    flag: '/flags/en.svg' },
  { code: 'nl', label: 'Nederlands', flag: '/flags/nl.svg' },
]

export function LanguageSwitcher({
  userId,
  currentLocale,
}: {
  userId: string
  currentLocale: Locale
}) {
  const router = useRouter()
  const t = useTranslations('account')

  async function switchLocale(locale: Locale) {
    if (locale === currentLocale) return

    const supabase = createClient()
    await supabase
      .from('user_settings')
      .update({ locale })
      .eq('user_id', userId)

    // Update cookie immediately so next-intl picks it up on router.refresh()
    document.cookie = `pf_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`

    router.refresh()
  }

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-[15px] font-medium text-[#1F1B16]">{t('language')}</span>
      <div className="flex items-center gap-2">
        {LOCALES.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => switchLocale(code)}
            title={label}
            className="relative w-8 h-8 rounded-full overflow-hidden transition-all"
            style={{
              outline: currentLocale === code ? '2px solid #F5C518' : '2px solid transparent',
              outlineOffset: '2px',
              opacity: currentLocale === code ? 1 : 0.45,
            }}
          >
            <Image
              src={flag}
              alt={label}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
