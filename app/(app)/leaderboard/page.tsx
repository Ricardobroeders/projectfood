'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { fetchLeaderboard, fetchStreakLeaderboard } from '@/lib/fetchers'

type PlantsRow = {
  rank: number
  username: string
  unique_plants: number
  is_me: boolean
}

type StreakRow = {
  rank: number
  username: string
  streak: number
  is_me: boolean
}

const MEDALS = ['🥇', '🥈', '🥉']

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[18px] ${className ?? ''}`} />
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-[#A39B91]">
      <div className="text-3xl mb-2">🏆</div>
      <p className="text-sm">{label}</p>
    </div>
  )
}

function LeaderRow({
  rank,
  username,
  value,
  unit,
  youLabel,
  isMe,
}: {
  rank: number
  username: string
  value: number
  unit: string
  youLabel: string
  isMe: boolean
}) {
  const medal = MEDALS[rank - 1]
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 rounded-[18px]"
      style={{
        background: isMe ? 'rgb(224 215 203)' : '#FFFFFF',
        boxShadow: isMe ? 'none' : '0 2px 6px rgba(31,27,22,0.04)',
      }}
    >
      <div className="w-9 text-center shrink-0">
        {medal ? (
          <span className="text-xl">{medal}</span>
        ) : (
          <span className="text-[14px] font-mono text-[#A39B91]">{rank}</span>
        )}
      </div>
      <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">
        {username}
        {isMe && (
          <span className="ml-2 text-[11px] font-mono uppercase tracking-widest text-[#A39B91]">
            {youLabel}
          </span>
        )}
      </p>
      <span className="font-mono text-[14px] text-[#1F1B16] shrink-0">
        {value}
        <span className="text-[#A39B91] text-[12px]"> {unit}</span>
      </span>
    </div>
  )
}

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard')
  const [tab, setTab] = useState<'plants' | 'streaks'>('plants')

  const { data: plantRows, isLoading: loadingPlants } = useSWR('leaderboard', fetchLeaderboard, { keepPreviousData: true })
  const { data: streakRows, isLoading: loadingStreaks } = useSWR('leaderboard_streaks', fetchStreakLeaderboard, { keepPreviousData: true })

  const isLoading = tab === 'plants' ? loadingPlants : loadingStreaks

  return (
    <div className="px-5 pt-4 pb-8 space-y-4">
      <h2 className="text-xl font-extrabold text-[#1F1B16]">{t('title')}</h2>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(['plants', 'streaks'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 h-10 rounded-2xl text-[13px] font-semibold transition-colors"
            style={
              tab === key
                ? { background: '#F5C518', color: '#1F1B16' }
                : { background: '#F4EFE8', color: '#6B645C' }
            }
          >
            {t(key === 'plants' ? 'tabPlants' : 'tabStreaks')}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-[#A39B91] -mt-2">
        {t(tab === 'plants' ? 'subtitle' : 'subtitleStreaks')}
      </p>

      <div className="space-y-2">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[60px]" />
        ))}

        {!isLoading && tab === 'plants' && (
          <>
            {plantRows?.map((row: PlantsRow) => (
              <LeaderRow
                key={row.rank}
                rank={row.rank}
                username={row.username}
                value={row.unique_plants}
                unit={t('plants')}
                youLabel={t('you')}
                isMe={row.is_me}
              />
            ))}
            {plantRows?.length === 0 && <EmptyState label={t('noEntries')} />}
          </>
        )}

        {!isLoading && tab === 'streaks' && (
          <>
            {streakRows?.map((row: StreakRow) => (
              <LeaderRow
                key={row.rank}
                rank={row.rank}
                username={row.username}
                value={row.streak}
                unit={t('days')}
                youLabel={t('you')}
                isMe={row.is_me}
              />
            ))}
            {streakRows?.length === 0 && <EmptyState label={t('noEntries')} />}
          </>
        )}
      </div>
    </div>
  )
}
