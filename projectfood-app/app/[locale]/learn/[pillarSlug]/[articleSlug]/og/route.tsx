import { getTranslations } from 'next-intl/server'
import { getClusterPage } from '@/lib/learn'
import { ogCard } from '@/lib/og'

export const revalidate = 3600

export async function GET(
  _: Request,
  { params }: { params: Promise<{ locale: string; pillarSlug: string; articleSlug: string }> },
) {
  const { locale, pillarSlug, articleSlug } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const data = await getClusterPage(pillarSlug, articleSlug, locale)
  return ogCard({ title: data?.article.title ?? t('hubTitle'), eyebrow: t('hubLabel'), image: data?.article.cover_image_url })
}
