import { getLocalizedHref } from '@/lib/marketing'

export const SITE = 'https://projectfood.dev'
export const ORG_ID = `${SITE}/#organization`
export const AUTHOR_ID = `${SITE}/#ricardo`
export const AUTHOR_NAME = 'Ricardo Broeders'

// Public profiles of the author, reused as `sameAs` on the Person node (E-E-A-T, AI-search
// attribution). Empty until Ricardo supplies them; an empty list emits no `sameAs`.
export const AUTHOR_SAME_AS: string[] = []

/** BCP-47 tags for JSON-LD `inLanguage`; hreflang keeps the bare locale. */
export const BCP47: Record<string, string> = { en: 'en-GB', nl: 'nl-NL', it: 'it-IT' }

/**
 * Store links. Play is in closed testing (2026-09-27): the opt-in URL works for listed testers
 * and is the CTA until the production listing exists. Flip `playPublic` and swap `playUrl` for
 * `https://play.google.com/store/apps/details?id=dev.projectfood.app` on the production release;
 * `SoftwareApplication` JSON-LD is only emitted once a store page is public.
 */
export const STORE = {
  playId: 'dev.projectfood.app',
  playUrl: 'https://play.google.com/apps/testing/dev.projectfood.app',
  playPublic: false,
  appStoreUrl: null as string | null,
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'Project Food',
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: `${SITE}/images/logo.png` },
  }
}

export function personNode(locale: string) {
  return {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: AUTHOR_NAME,
    url: `${SITE}${getLocalizedHref('/about', locale)}`,
    ...(AUTHOR_SAME_AS.length ? { sameAs: AUTHOR_SAME_AS } : {}),
  }
}

/** Word count of a Markdown body: link targets, markup and punctuation stripped. */
export function countWords(md: string): number {
  return md
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*_>`[\]|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

/** `SoftwareApplication` node for the home page; null until a store page is public. */
export function softwareApplicationNode(locale: string, description: string) {
  const urls = [STORE.playPublic ? STORE.playUrl : null, STORE.appStoreUrl].filter(Boolean) as string[]
  if (urls.length === 0) return null
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE}/#app`,
    name: 'Project Food',
    description,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: [STORE.playPublic ? 'Android' : null, STORE.appStoreUrl ? 'iOS' : null].filter(Boolean).join(', '),
    inLanguage: BCP47[locale] ?? locale,
    url: `${SITE}/${locale}`,
    installUrl: urls,
    sameAs: urls,
    author: { '@id': ORG_ID },
  }
}
