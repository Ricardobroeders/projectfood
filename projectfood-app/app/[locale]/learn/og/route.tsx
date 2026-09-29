import { getTranslations } from 'next-intl/server'
import { ogCard } from '@/lib/og'

export const revalidate = 3600

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'marketing.learn' })
  return ogCard({ title: t('hubTitle'), eyebrow: t('hubLabel') })
}
