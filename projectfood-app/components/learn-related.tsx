import Link from 'next/link'
import type { RelatedArticle } from '@/lib/learn'

type Props = {
  title: string
  items: RelatedArticle[]
  learnBase: string
  readingTimeLabel: (min: number) => string
}

/** Sibling links at the end of a cluster article, resolved from `related_article_slugs`. */
export function LearnRelated({ title, items, learnBase, readingTimeLabel }: Props) {
  if (items.length === 0) return null
  return (
    <section className="bg-[#F4EFE8] py-14 px-5">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{title}</h2>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Link
              key={item.internal_slug}
              href={item.articleSlug ? `${learnBase}/${item.pillarSlug}/${item.articleSlug}` : `${learnBase}/${item.pillarSlug}`}
              className="group flex items-center justify-between bg-white rounded-[18px] px-6 py-4 transition-colors"
            >
              <div>
                <p className="font-bold text-[#1F1B16] group-hover:text-[#F59A0E] transition-colors">
                  {item.title}
                </p>
                {item.reading_time_min && (
                  <p className="text-xs text-[#A39B91] mt-0.5">{readingTimeLabel(item.reading_time_min)}</p>
                )}
              </div>
              <svg
                className="shrink-0 text-[#A39B91] group-hover:text-[#F59A0E] transition-colors"
                width="18" height="18" viewBox="0 0 20 20" fill="none"
                aria-hidden="true"
              >
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
