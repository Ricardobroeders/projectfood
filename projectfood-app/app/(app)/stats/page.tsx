'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CATS, CAT_ORDER, type Category } from '@/lib/cats'
import { fetchStats, type WeekRow, type CatRow } from '@/lib/fetchers'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

export default function StatsPage() {
  const t = useTranslations('stats')
  const tCat = useTranslations('categories')

  const { data, isLoading } = useSWR('stats', fetchStats, { keepPreviousData: true })

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-4 pb-8 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-48" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    )
  }

  const { streakCount, totalTried, totalPlants, weeks, cats } = data

  return (
    <div className="px-5 pt-4 pb-8 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[24px] p-5 bg-[#DDEACB]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#4F7A3D] mb-2">{t('streak')}</div>
          <div className="text-[40px] font-extrabold leading-none text-[#1F1B16]">{streakCount}</div>
          <div className="text-sm text-[#6B645C] mt-1">{t('days')}</div>
        </div>
        <div className="rounded-[24px] p-5 bg-[#E5D6EE]">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#6A4880] mb-2">{t('plantsTried')}</div>
          <div className="text-[40px] font-extrabold leading-none text-[#1F1B16]">{totalTried}</div>
          <div className="text-sm text-[#6B645C] mt-1">{t('ofTotal', { total: totalPlants })}</div>
        </div>
      </div>

      {/* Weekly history */}
      <div>
        <h3 className="text-base font-bold text-[#1F1B16] mb-3">{t('weeklyHistory')}</h3>
        <div className="rounded-[18px] bg-white p-4 space-y-3" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
          {weeks.map((w) => {
            const start = new Date(w.week_start + 'T12:00:00')
            const end = new Date(start)
            end.setDate(end.getDate() + 6)
            const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const label = `${fmt(start)} – ${fmt(end)}`
            const pct = Math.min((w.variety / 30) * 100, 100)
            return (
              <div key={w.week_start}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="text-[#6B645C]">{label}</span>
                  <span className="font-mono text-[#1F1B16]">
                    {w.variety}
                    <span className="text-[#A39B91]">/30</span>
                    {w.hit_goal && <span className="ml-1 text-[#F5C518]">★</span>}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-[#F4EFE8] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: w.hit_goal ? '#F5C518' : '#1F1B16' }}
                  />
                </div>
              </div>
            )
          })}
          {weeks.length === 0 && (
            <p className="text-sm text-[#A39B91] text-center py-4">{t('noData')}</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-base font-bold text-[#1F1B16] mb-3">{t('plantsTried')}</h3>
        <div className="space-y-2">
          {CAT_ORDER.map((cat) => {
            const row = cats.find((r) => r.category === cat)
            const unique = row?.unique_count ?? 0
            const total = row?.total_in_category ?? 1
            const pct = Math.round((unique / total) * 100)
            const c = CATS[cat]
            return (
              <Link key={cat} href={`/stats/${cat}`} className="block rounded-[18px] p-4" style={{ background: c.bg }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: c.fg }}>
                    <span>{c.emoji}</span>
                    <span>{tCat(cat)}</span>
                  </div>
                  <span className="font-mono text-[12px]" style={{ color: c.fg }}>
                    {unique}/{total}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `${c.dot}30` }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: c.dot }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
