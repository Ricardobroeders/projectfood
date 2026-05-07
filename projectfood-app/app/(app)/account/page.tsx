'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronRight, Bell } from 'lucide-react'
import { fetchAccount, fetchAchievementsStats } from '@/lib/fetchers'
import { UsernameForm } from './UsernameForm'
import { InstallButton } from './InstallButton'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Avatar } from '@/components/avatar'
import { ACHIEVEMENTS, getUnlockedBorders, type UserStats } from '@/lib/achievements'
import { createClient } from '@/lib/supabase/client'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

function AchievementBadge({ achievement, unlocked }: { achievement: (typeof ACHIEVEMENTS)[0]; unlocked: boolean }) {
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

export default function AccountPage() {
  const t = useTranslations('account')
  const tA = useTranslations('achievements')
  const locale = useLocale()

  const { data, isLoading, mutate } = useSWR(['account', locale], fetchAccount, { keepPreviousData: true })
  const { data: achievementData } = useSWR('achievements_stats', fetchAchievementsStats)

  const stats: UserStats | null = achievementData
    ? { totalUniquePlants: achievementData.total_plants, longestStreakDays: achievementData.longest_streak_days, challengesCompleted: 0 }
    : null

  const newlyUnlocked = stats ? getUnlockedBorders(stats) : []

  // Auto-unlock borders when a new one is earned
  useEffect(() => {
    if (!data || !stats || newlyUnlocked.length === 0) return
    const current = data.unlockedBorders ?? []
    const toAdd = newlyUnlocked.filter(b => !current.includes(b))
    if (toAdd.length === 0) return

    const next = [...new Set([...current, ...toAdd])]
    createClient()
      .from('user_settings')
      .update({ unlocked_borders: next })
      .eq('user_id', data.userId)
      .then(() => mutate())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievementData])

  const setActiveBorder = async (border: string) => {
    if (!data) return
    await createClient()
      .from('user_settings')
      .update({ active_border: border })
      .eq('user_id', data.userId)
    mutate()
  }

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-6 pb-8 space-y-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-48" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    )
  }

  const { userId, name, email, avatar, username, currentLocale, notifSettings, unlockedBorders, activeBorder } = data
  const notifOn = notifSettings.notificationsEnabled
  const availableBorders = ['default', ...(unlockedBorders ?? [])]

  return (
    <div className="px-5 pt-6 pb-8 space-y-6">
      {/* Profile card */}
      <div
        className="rounded-[24px] bg-white p-6 flex items-center gap-4"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#FBEDB5] flex items-center justify-center text-2xl">
            🥦
          </div>
        )}
        <div className="min-w-0">
          {name && <p className="text-base font-bold text-[#1F1B16] truncate">{name}</p>}
          {email && <p className="text-sm text-[#6B645C] truncate">{email}</p>}
        </div>
      </div>

      {/* Settings */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-2 px-1">
          {t('settingsSection')}
        </p>
        <div
          className="rounded-[24px] bg-white divide-y divide-[#F4EFE8]"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <UsernameForm userId={userId} initial={username} />
          <LanguageSwitcher userId={userId} currentLocale={currentLocale} />
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[15px] font-medium text-[#1F1B16]">{t('weeklyGoal')}</span>
            <span className="text-[14px] text-[#A39B91]">{t('weeklyGoalValue')}</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {stats && (
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
            {tA('sectionTitle')}
          </p>
          <div
            className="rounded-[24px] bg-white p-5"
            style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
          >
            <div className="flex flex-wrap gap-4">
              {ACHIEVEMENTS.map(a => (
                <AchievementBadge key={a.id} achievement={a} unlocked={a.check(stats)} />
              ))}
            </div>

            {/* Border picker — only shown when at least one border is unlocked */}
            {availableBorders.length > 1 && username && (
              <div className="mt-5 pt-5 border-t border-[#F4EFE8]">
                <p className="text-[13px] font-semibold text-[#1F1B16] mb-3">{tA('borderPickerTitle')}</p>
                <div className="flex items-center gap-3">
                  {availableBorders.map(b => (
                    <button
                      key={b}
                      onClick={() => setActiveBorder(b)}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <Avatar
                        username={username}
                        size="md"
                        border={b}
                        className={activeBorder === b ? 'ring-2 ring-offset-2 ring-[#1F1B16]' : ''}
                      />
                      <span className="text-[10px] text-[#A39B91]">
                        {b === 'default' ? tA('borderDefault') : b}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Install app */}
      <div
        className="rounded-[24px] bg-white"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <InstallButton />
      </div>

      {/* Notifications nav row */}
      <Link
        href="/account/notifications"
        className="rounded-[24px] bg-white flex items-center justify-between px-5 py-4 gap-3 active:opacity-70 transition-opacity"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Bell size={18} className="text-[#1F1B16] shrink-0" />
          <span className="text-[15px] font-medium text-[#1F1B16]">{t('notifications')}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] text-[#A39B91]">{notifOn ? t('on') : t('off')}</span>
          <ChevronRight size={16} className="text-[#A39B91]" />
        </div>
      </Link>

      {/* Sign out */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-2 px-1">
          {t('accountSection')}
        </p>
        <div
          className="rounded-[24px] bg-white"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-5 py-4 text-[15px] font-medium text-red-500"
            >
              {t('signOut')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
