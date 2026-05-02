'use client'

import useSWR from 'swr'
import { useTranslations, useLocale } from 'next-intl'
import { CATS, CAT_ORDER, type Category } from '@/lib/cats'
import { type Advice } from './AdviceCard'
import { AdviceBanner } from './AdviceBanner'
import { fetchHome } from '@/lib/fetchers'

function ProgressRing({ value, max }: { value: number; max: number }) {
  const size = 128
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#c0b7a8ff" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#F5C518" strokeWidth={stroke} fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-4xl font-extrabold leading-none text-[#1F1B16]">{value}</div>
          <div className="text-xs font-mono text-[#6B645C] mt-1">/ {max}</div>
        </div>
      </div>
    </div>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

export default function HomePage() {
  const t = useTranslations('home')
  const tCat = useTranslations('categories')
  const locale = useLocale()

  const { data, isLoading } = useSWR(['home', locale], fetchHome, { keepPreviousData: true })

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-4 pb-6 space-y-4">
        <Skeleton className="h-[220px]" />
        <Skeleton className="h-14" />
        <Skeleton className="h-32" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  const { weekCount, daysLeft, byCategory, todayPlants, weekAdvice } = data

  return (
    <div className="px-5 pt-4 pb-6 space-y-4">
      {/* Hero progress card */}
      <div className="rounded-[24px] p-6" style={{ background: 'rgb(224 215 203)' }}>
        <div className="flex items-center justify-between mb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B645C]">{t('thisWeek')}</span>
          <span className="text-[11px] font-mono text-[#6B645C]">{t('daysLeft', { days: daysLeft })}</span>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing value={weekCount} max={30} />
          <div className="mt-3 text-center">
            <p className="text-base font-semibold text-[#1F1B16]">{t('plantsOfGoal', { count: weekCount, goal: 30 })}</p>
            {weekCount < 30 && (
              <p className="text-sm text-[#6B645C] mt-0.5">{t('toGo', { n: 30 - weekCount })}</p>
            )}
            {weekCount >= 30 && (
              <p className="text-sm text-[#4F7A3D] font-semibold mt-0.5">{t('goalReached')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Grocery advice banner */}
      <AdviceBanner advice={weekAdvice} weekCount={weekCount} />

      {/* Today's plants */}
      {todayPlants.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-[#1F1B16] mb-2">{t('today')}</h3>
          <div className="flex flex-wrap gap-2">
            {todayPlants.map((p: any) => {
              const c = CATS[p.category as Category]
              return (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium"
                  style={{ background: c.bg, color: c.fg }}
                >
                  {c.emoji} {p.name}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* This week's collection by category */}
      {CAT_ORDER.some((cat) => byCategory[cat]?.length) ? (
        <div>
          <h3 className="text-base font-bold text-[#1F1B16] mb-3">{t('thisWeeksCollection')}</h3>
          <div className="space-y-3">
            {CAT_ORDER.filter((cat) => byCategory[cat]?.length).map((cat) => {
              const c = CATS[cat]
              const names = byCategory[cat]!
              return (
                <div key={cat} className="rounded-[18px] p-4" style={{ background: c.bg }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: c.fg }}>
                      <span>{c.emoji}</span>
                      <span>{tCat(cat)}</span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: c.fg }}>{names.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {names.map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center h-7 px-3 rounded-full text-xs font-medium bg-white/70"
                        style={{ color: c.fg }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🌱</div>
          <p className="text-base font-semibold text-[#1F1B16]">{t('logFirstPlant')}</p>
          <p className="text-sm text-[#6B645C] mt-1">{t('logFirstPlantSub')}</p>
        </div>
      )}

    </div>
  )
}
