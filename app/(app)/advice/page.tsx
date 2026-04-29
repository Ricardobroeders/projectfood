'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { ChevronLeft } from 'lucide-react'
import { AdviceCard, type Advice } from '../home/AdviceCard'

type WeekRow = { week_start: string; advice: Advice }

function currentWeekStart(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toLocaleDateString('en-CA')
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + 'T12:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(end)}`
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

export default function AdvicePage() {
  const t = useTranslations('advice')

  const { data: rows, isLoading } = useSWR('advice-all', async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('weekly_advice')
      .select('week_start, advice')
      .order('week_start', { ascending: false })
    return (data ?? []) as WeekRow[]
  })

  const thisWeek = currentWeekStart()
  const current = rows?.find((r) => r.week_start === thisWeek) ?? null
  const past = rows?.filter((r) => r.week_start !== thisWeek) ?? []

  return (
    <div className="px-5 pt-4 pb-6 space-y-5">
      {/* Back nav */}
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B645C] -ml-1"
      >
        <ChevronLeft size={16} />
        {t('backToHome')}
      </Link>

      {/* Page title */}
      <h1 className="text-[22px] font-extrabold text-[#1F1B16] -mt-1">{t('title')}</h1>

      {/* Current week */}
      <section>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#6B645C] mb-3">
          {t('thisWeek')}
        </p>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : current ? (
          <AdviceCard advice={current.advice} />
        ) : (
          <div
            className="rounded-[24px] p-5 text-center"
            style={{ background: '#F4EFE8' }}
          >
            <p className="text-[15px] font-semibold text-[#6B645C]">{t('noAdviceYet')}</p>
            <p className="text-[13px] text-[#A39B91] mt-1">{t('noAdviceYetSub')}</p>
          </div>
        )}
      </section>

      {/* Past weeks */}
      {!isLoading && past.length > 0 && (
        <section className="space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#6B645C]">
            {t('previousWeeks')}
          </p>
          {past.map((row) => (
            <div key={row.week_start}>
              <p className="text-[12px] font-medium text-[#A39B91] mb-2">
                {formatWeekRange(row.week_start)}
              </p>
              <AdviceCard advice={row.advice} />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
