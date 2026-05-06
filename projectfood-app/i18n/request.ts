import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const SUPPORTED_LOCALES = ['en', 'nl', 'it']

export default getRequestConfig(async ({ requestLocale }) => {
  // For marketing routes (app/[locale]/*), requestLocale is the URL segment.
  // For PWA routes (app/(app)/*), requestLocale is undefined — fall back to cookie.
  const urlLocale = await requestLocale

  let locale: string
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
    locale = urlLocale
  } else {
    const cookieStore = await cookies()
    const raw = cookieStore.get('pf_locale')?.value ?? 'en'
    locale = SUPPORTED_LOCALES.includes(raw) ? raw : 'en'
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
