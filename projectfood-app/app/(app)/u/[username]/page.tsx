'use client'

import { use } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { fetchUserProfile, fetchUserDailyHistory } from '@/lib/fetchers'
import { Avatar } from '@/components/avatar'
import { ACHIEVEMENTS, type UserStats, type Achievement } from '@/lib/achievements'
import { WeeklyHistoryChart } from '@/components/weekly-history-chart'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[18px] ${className ?? ''}`} />
}

function StatCard({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="flex-1 rounded-[18px] bg-white p-4 text-center" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-[#1F1B16] leading-none">{value}</p>
      {unit && <p className="text-[11px] text-[#A39B91] mt-0.5">{unit}</p>}
    </div>
  )
}

function AchievementBadge({ achievement, unlocked }: { achievement: Achievement; unlocked: boolean }) {
  const bg = achievement.borderColor ? `${achievement.borderColor}25` : '#F4EFE8'
  return (
    <div className={`flex flex-col items-center gap-1.5 ${unlocked ? '' : 'opacity-35'}`}>
      <div
        className="size-14 rounded-[16px] flex items-center justify-center"
        style={{ background: unlocked ? bg : '#F4EFE8' }}
      >
        {achievement.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={achievement.image} alt={achievement.label} className="size-10 object-contain" />
        ) : (
          <span className="text-2xl">{achievement.icon}</span>
        )}
      </div>
      <p className="text-[11px] text-center text-[#6B645C] font-medium leading-tight w-16">{achievement.label}</p>
    </div>
  )
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const router = useRouter()
  const t = useTranslations('profile')

  const { data, isLoading } = useSWR(['profile', username], () => fetchUserProfile(username))
  const { data: dailyHistory, isLoading: loadingHistory } = useSWR(
    ['daily-history', username],
    () => fetchUserDailyHistory(username)
  )

  const stats: UserStats | null = data
    ? { totalUniquePlants: data.total_plants, longestStreakDays: data.longest_streak_days, challengesCompleted: 0 }
    : null

  return (
    <div className="px-5 pt-4 pb-8 space-y-5">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-[13px] text-[#A39B91]">
        <ArrowLeft className="size-4" />
        {t('back')}
      </button>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-36" />
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-24" />
            <Skeleton className="flex-1 h-24" />
            <Skeleton className="flex-1 h-24" />
          </div>
          <Skeleton className="h-28" />
        </div>
      )}

      {!isLoading && !data && (
        <div className="text-center py-16 text-[#A39B91]">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-sm">{t('notFound')}</p>
        </div>
      )}

      {!isLoading && data && stats && (
        <>
          {/* Avatar + username */}
          <div className="flex flex-col items-center py-4 gap-3">
            <Avatar username={data.username} imageUrl={data.avatar_url} size="lg" border={data.active_border ?? 'default'} />
            <h2 className="text-xl font-extrabold text-[#1F1B16]">{data.username}</h2>
          </div>

          {/* Stat cards */}
          <div className="flex gap-3">
            <StatCard label={t('totalPlants')} value={data.total_plants} />
            <StatCard label={t('thisWeek')} value={data.week_count} unit="/30" />
            <StatCard label={t('streak')} value={data.streak} unit={t('days')} />
          </div>

          {/* Week progress bar */}
          <div className="rounded-[18px] bg-white p-4" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#1F1B16]">{t('weekProgress')}</p>
              <p className="text-[13px] font-mono text-[#A39B91]">{data.week_count}/30</p>
            </div>
            <div className="h-2.5 rounded-full bg-[#F4EFE8] overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-[#F5C518] transition-all"
                style={{ width: `${Math.min(100, (data.week_count / 30) * 100)}%` }}
              />
            </div>
          </div>

          {/* Daily history chart */}
          {loadingHistory && <Skeleton className="h-[120px]" />}
          {!loadingHistory && dailyHistory && dailyHistory.some(d => d.variety > 0) && (
            <div className="rounded-[18px] bg-white p-4" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3">
                {t('dailyHistory')}
              </p>
              <WeeklyHistoryChart data={dailyHistory} />
            </div>
          )}

          {/* Achievement badges */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
              {t('achievements')}
            </p>
            <div className="flex flex-wrap gap-4">
              {ACHIEVEMENTS.map(a => (
                <AchievementBadge key={a.id} achievement={a} unlocked={a.check(stats)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
