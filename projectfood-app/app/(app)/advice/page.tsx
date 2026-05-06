'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import { AdviceCard, type Advice } from '../home/AdviceCard'
import { fetchAdvice, type AdviceRow as WeekRow } from '@/lib/fetchers'

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

  const { data: rows, isLoading } = useSWR('advice-all', fetchAdvice, { keepPreviousData: true })

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

      {/* Accordion */}
      {!isLoading && rows && (
        <div className="space-y-3">
          {/* This week — always shown */}
          {(() => {
            const thisWeekRow = rows.find((r) => r.week_start === thisWeek)
            if (thisWeekRow) {
              const isOpen = openWeek === thisWeek
              const preview = thisWeekRow.advice.suggestions.slice(0, 5).map((s) => s.plant).join(', ')
              return (
                <div className="rounded-[24px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(31,27,22,0.06)' }}>
                  <button
                    onClick={() => setOpenWeek(isOpen ? '' : thisWeek)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#1F1B16]">{t('thisWeek')}</p>
                      {!isOpen && <p className="text-[12px] text-[#A39B91] mt-0.5">{preview}</p>}
                    </div>
                    <ChevronDown
                      size={18}
                      className="text-[#A39B91] shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      <AdviceCard advice={thisWeekRow.advice} />
                    </div>
                  )}
                </div>
              )
            }
            return (
              <div className="rounded-[24px] px-5 py-4 flex items-center justify-between" style={{ background: '#EDE8E1' }}>
                <div>
                  <p className="text-[15px] font-semibold text-[#6B645C]">{t('thisWeek')}</p>
                  <p className="text-[12px] text-[#A39B91] mt-0.5">{t('thisWeekLocked')}</p>
                </div>
              </div>
            )
          })()}

          {/* Previous weeks */}
          {rows.filter((r) => r.week_start !== thisWeek).map((row) => {
            const isOpen = openWeek === row.week_start
            const preview = row.advice.suggestions.slice(0, 5).map((s) => s.plant).join(', ')
            return (
              <div key={row.week_start} className="rounded-[24px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(31,27,22,0.06)' }}>
                <button
                  onClick={() => setOpenWeek(isOpen ? '' : row.week_start)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#1F1B16]">{formatWeekRange(row.week_start)}</p>
                    {!isOpen && <p className="text-[12px] text-[#A39B91] mt-0.5">{preview}</p>}
                  </div>
                  <ChevronDown
                    size={18}
                    className="text-[#A39B91] shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
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
