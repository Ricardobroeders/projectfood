import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'nl', 'it'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]
const LOCALE_COOKIE = 'pf_locale'

// External localized slug → internal page segment, keyed by locale
const SLUG_TO_INTERNAL: Record<Locale, Record<string, string>> = {
  en: { about: 'about', contact: 'contact', terms: 'terms', privacy: 'privacy', recipes: 'recipes' },
  nl: { over: 'about', contact: 'contact', voorwaarden: 'terms', privacy: 'privacy', recepten: 'recipes' },
  it: { 'chi-siamo': 'about', contatto: 'contact', termini: 'terms', privacy: 'privacy', ricette: 'recipes' },
}

function detectLocale(request: NextRequest): Locale {
  const accept = request.headers.get('accept-language') ?? ''
  const preferred = accept.split(',')[0]?.split('-')[0]?.toLowerCase() ?? ''
  return (SUPPORTED_LOCALES.includes(preferred as Locale) ? preferred : 'en') as Locale
}

function setLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    httpOnly: false,
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)
  const firstSegment = parts[0] ?? ''

  // ── Marketing: root redirect ──────────────────────────────────────────────
  if (pathname === '/') {
    const locale = detectLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}`
    return NextResponse.redirect(url)
  }

  // ── Marketing: locale-prefixed paths ─────────────────────────────────────
  if (SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    const locale = firstSegment as Locale
    const slug = parts[1]

    if (slug) {
      const internalSlug = SLUG_TO_INTERNAL[locale]?.[slug]
      if (internalSlug && internalSlug !== slug) {
        // Rewrite /nl/over → /nl/about, /it/chi-siamo → /it/about, etc.
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/${internalSlug}`
        const response = NextResponse.rewrite(url)
        setLocaleCookie(response, locale)
        return response
      }
    }

    const response = NextResponse.next()
    setLocaleCookie(response, locale)
    return response
  }

  // ── PWA & auth paths: Supabase auth check ────────────────────────────────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && pathname !== '/login' && !pathname.startsWith('/auth') && !pathname.startsWith('/api/cron')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // Sync locale cookie from user_settings on first visit (no cookie set yet)
  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value
  if (!existingLocale && user) {
    const { data: settings } = await supabase
      .from('user_settings')
      .select('locale')
      .eq('user_id', user.id)
      .single()

    const locale =
      settings?.locale && SUPPORTED_LOCALES.includes(settings.locale as Locale)
        ? settings.locale
        : 'en'

    supabaseResponse.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })
    // Also forward as header so i18n/request.ts sees it in this same render
    // (response cookies are not visible in request.cookies() on the same request)
    supabaseResponse.headers.set('x-pf-locale', locale)
  } else if (existingLocale) {
    supabaseResponse.headers.set('x-pf-locale', existingLocale)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|flags|sw\\.js|sitemap\\.xml|robots\\.txt|images).*)'],
}
