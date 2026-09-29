import { getTranslations } from 'next-intl/server'
import { getFeedEntries } from '@/lib/learn'
import { learnUrl } from '@/lib/marketing'
import { AUTHOR_NAME } from '@/lib/seo'

// Atom feed of the learn hub in one locale, newest first. Linked from the hub's <head>.
export const revalidate = 3600

const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] as string)

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const entries = await getFeedEntries(locale)
  const hub = learnUrl(locale)
  const updated = entries[0]?.updated ?? new Date().toISOString()
  const xml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">`,
    `<title>${esc(t('hubTitle'))} | Project Food</title>`,
    `<subtitle>${esc(t('hubSubtitle'))}</subtitle>`,
    `<link href="${hub}"/>`,
    `<link rel="self" type="application/atom+xml" href="${hub}/feed"/>`,
    `<id>${hub}</id>`,
    `<updated>${updated}</updated>`,
    `<author><name>${esc(AUTHOR_NAME)}</name></author>`,
    ...entries.map((e) =>
      [
        '<entry>',
        `<title>${esc(e.title)}</title>`,
        `<link href="${e.url}"/>`,
        `<id>${e.url}</id>`,
        `<published>${e.published}</published>`,
        `<updated>${e.updated}</updated>`,
        e.summary ? `<summary>${esc(e.summary)}</summary>` : '',
        '</entry>',
      ].join(''),
    ),
    '</feed>',
    '',
  ].join('\n')
  return new Response(xml, { headers: { 'content-type': 'application/atom+xml; charset=utf-8' } })
}
