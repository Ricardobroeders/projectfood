'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations, useLocale } from 'next-intl'
import { CATS, CAT_ORDER, type Category } from '@/lib/cats'

type Plant = { id: string; name: string }

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[18px] ${className ?? ''}`} />
}

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as Category
  const t = useTranslations('stats')
  const tCat = useTranslations('categories')
  const locale = useLocale()
  const valid = CAT_ORDER.includes(category)

  useEffect(() => {
    if (!valid) router.replace('/stats')
  }, [valid, router])

  if (!valid) return null

  const c = CATS[category]

  const { data, isLoading } = useSWR(['stats-category', category, locale], async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const [{ data: plants }, { data: logs }, { data: translations }] = await Promise.all([
      supabase
        .from('plants')
        .select('id, name')
        .eq('category', category)
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('plant_logs')
        .select('plant_id')
        .eq('user_id', user!.id),
      supabase
        .from('plant_translations')
        .select('plant_id, name')
        .eq('locale', locale),
    ])

    const nameByPlantId = Object.fromEntries(
      ((translations ?? []) as { plant_id: string; name: string }[]).map((tr) => [tr.plant_id, tr.name])
    )

    const triedSet = new Set((logs ?? []).map((r) => r.plant_id))
    const allPlants: Plant[] = ((plants ?? []) as Plant[]).map((p) => ({
      ...p,
      name: nameByPlantId[p.id] ?? p.name,
    }))
    allPlants.sort((a, b) => a.name.localeCompare(b.name))

    return {
      tried: allPlants.filter((p) => triedSet.has(p.id)),
      untried: allPlants.filter((p) => !triedSet.has(p.id)),
      total: allPlants.length,
    }
  }, { keepPreviousData: true })

  return (
    <div className="px-5 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/stats"
          className="w-10 h-10 rounded-full bg-white grid place-items-center shrink-0"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.06)' }}
        >
          <ArrowLeft size={18} className="text-[#1F1B16]" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{c.emoji}</span>
          <h1 className="text-xl font-extrabold text-[#1F1B16]">{tCat(category)}</h1>
        </div>
        <span className="ml-auto text-sm font-mono text-[#A39B91]">
          {isLoading ? '…' : data?.tried.length}
          <span className="text-[#F4EFE8]">/</span>
          {isLoading ? '…' : data?.total}
        </span>
      </div>

      {isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px]" />
          ))}
        </div>
      ) : (
        <>
          {/* Tried */}
          {data.tried.length > 0 && (
            <div className="mb-5">
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
                {t('tried')}
              </p>
              <div className="space-y-2">
                {data.tried.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-[18px]"
                    style={{ background: 'rgb(224 215 203)' }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl grid place-items-center text-lg shrink-0"
                      style={{ background: c.bg }}
                    >
                      {c.emoji}
                    </div>
                    <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{plant.name}</p>
                    <div className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-[#F5C518]">
                      <Check size={16} strokeWidth={2.5} className="text-[#1F1B16]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not yet tried */}
          {data.untried.length > 0 && (
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
                {t('notYetTried')}
              </p>
              <div className="space-y-2">
                {data.untried.map((plant) => (
                  <div
                    key={plant.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-[18px] bg-white"
                    style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl grid place-items-center text-lg shrink-0"
                      style={{ background: c.bg }}
                    >
                      {c.emoji}
                    </div>
                    <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{plant.name}</p>
                    <div className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-[#F4EFE8]">
                      <Check size={16} strokeWidth={2.5} className="text-[#A39B91]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
