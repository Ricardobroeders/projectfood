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
