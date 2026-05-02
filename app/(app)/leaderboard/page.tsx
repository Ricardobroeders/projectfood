'use client'

import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { fetchLeaderboard } from '@/lib/fetchers'

type LeaderboardRow = {
  rank: number
  username: string
  unique_plants: number
  is_me: boolean
}

const MEDALS = ['🥇', '🥈', '🥉']

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[18px] ${className ?? ''}`} />
}

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard')

  const { data: rows, isLoading } = useSWR('leaderboard', fetchLeaderboard, { keepPreviousData: true })

  return (
    <div className="px-5 pt-4 pb-8 space-y-4">
      <h2 className="text-xl font-extrabold text-[#1F1B16]">{t('title')}</h2>
      <p className="text-[13px] text-[#A39B91] -mt-2">{t('subtitle')}</p>

      <div className="space-y-2">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[60px]" />
        ))}

        {!isLoading && rows?.map((row) => {
          const medal = MEDALS[row.rank - 1]
          return (
            <div
              key={row.rank}
              className="flex items-center gap-4 px-4 py-3 rounded-[18px]"
              style={{
                background: row.is_me ? 'rgb(224 215 203)' : '#FFFFFF',
                boxShadow: row.is_me ? 'none' : '0 2px 6px rgba(31,27,22,0.04)',
              }}
            >
              <div className="w-9 text-center shrink-0">
                {medal ? (
                  <span className="text-xl">{medal}</span>
                ) : (
                  <span className="text-[14px] font-mono text-[#A39B91]">{row.rank}</span>
                )}
              </div>
              <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">
                {row.username}
                {row.is_me && (
                  <span className="ml-2 text-[11px] font-mono uppercase tracking-widest text-[#A39B91]">
                    {t('you')}
                  </span>
                )}
              </p>
              <span className="font-mono text-[14px] text-[#1F1B16] shrink-0">
                {row.unique_plants}
                <span className="text-[#A39B91] text-[12px]"> {t('plants')}</span>
              </span>
            </div>
          )
        })}

        {!isLoading && rows?.length === 0 && (
          <div className="text-center py-16 text-[#A39B91]">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm">{t('noEntries')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
