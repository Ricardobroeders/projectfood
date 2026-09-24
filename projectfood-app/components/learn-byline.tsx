import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getLocalizedHref } from '@/lib/marketing'
import { AUTHOR_NAME } from '@/lib/seo'

type Props = {
  locale: string
  readingTimeMin: number | null
  publishedAt: string | null
}

/** "By Ricardo Broeders · 6 min read · Published 24 September 2026", under the article dek. */
export async function LearnByline({ locale, readingTimeMin, publishedAt }: Props) {
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const parts: React.ReactNode[] = [
    <Link key="author" href={getLocalizedHref('/about', locale)} className="hover:text-[#6B645C] transition-colors">
      {t('byAuthor', { name: AUTHOR_NAME })}
    </Link>,
  ]
  if (readingTimeMin) parts.push(<span key="time">{t('readingTime', { min: readingTimeMin })}</span>)
  if (publishedAt) {
    parts.push(
      <span key="date">
        {t('publishedOn', {
          date: new Date(publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
        })}
      </span>,
    )
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 text-sm text-[#A39B91]">
      {parts}
    </div>
  )
}
