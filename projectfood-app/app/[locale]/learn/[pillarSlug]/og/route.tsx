import { getTranslations } from 'next-intl/server'
import { getPillarPage } from '@/lib/learn'
import { ogCard } from '@/lib/og'

export const revalidate = 3600

export async function GET(_: Request, { params }: { params: Promise<{ locale: string; pillarSlug: string }> }) {
  const { locale, pillarSlug } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  const data = await getPillarPage(pillarSlug, locale)
  return ogCard({ title: data?.pillar.title ?? t('hubTitle'), eyebrow: t('hubLabel'), image: data?.pillar.cover_image_url })
}
