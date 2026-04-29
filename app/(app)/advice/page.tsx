'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronDown } from 'lucide-react'
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
  const thisWeek = currentWeekStart()
  const [openWeek, setOpenWeek] = useState<string>(thisWeek)

  const { data: rows, isLoading } = useSWR('advice-all', async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('weekly_advice')
      .select('week_start, advice')
      .order('week_start', { ascending: false })
    return (data ?? []) as WeekRow[]
  })

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Back nav */}
      <Link
        href="/home"
        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#6B645C] -ml-1"
      >
        <ChevronLeft size={16} />
        {t('backToHome')}
      </Link>

      {/* Page title */}
      <h1 className="text-[22px] font-extrabold text-[#1F1B16]">{t('title')}</h1>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}

      {/* No advice at all */}
      {!isLoading && rows?.length === 0 && (
        <div className="rounded-[24px] p-5 text-center" style={{ background: '#F4EFE8' }}>
          <p className="text-[15px] font-semibold text-[#6B645C]">{t('noAdviceYet')}</p>
          <p className="text-[13px] text-[#A39B91] mt-1">{t('noAdviceYetSub')}</p>
        </div>
      )}

      {/* Accordion */}
      {!isLoading && rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((row) => {
            const isCurrent = row.week_start === thisWeek
            const isOpen = openWeek === row.week_start
            const label = isCurrent ? t('thisWeek') : formatWeekRange(row.week_start)
            const preview = row.advice.suggestions.slice(0, 5).map((s) => s.plant).join(', ')

            return (
              <div key={row.week_start} className="rounded-[24px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(31,27,22,0.06)' }}>
                {/* Accordion header */}
                <button
                  onClick={() => setOpenWeek(isOpen ? '' : row.week_start)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#1F1B16]">{label}</p>
                    {!isOpen && (
                      <p className="text-[12px] text-[#A39B91] mt-0.5">{preview}</p>
                    )}
                  </div>
                  <ChevronDown
                    size={18}
                    className="text-[#A39B91] shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Accordion body */}
                {isOpen && (
                  <div className="px-4 pb-4">
                    <AdviceCard advice={row.advice} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
