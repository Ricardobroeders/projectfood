'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronRight, Bell } from 'lucide-react'
import { fetchAccount } from '@/lib/fetchers'
import { UsernameForm } from './UsernameForm'
import { InstallButton } from './InstallButton'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Avatar } from '@/components/avatar'

import { createClient } from '@/lib/supabase/client'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

export default function AccountPage() {
  const t = useTranslations('account')
  const tA = useTranslations('achievements')
  const locale = useLocale()

  const { data, isLoading, mutate } = useSWR(['account', locale], fetchAccount, { keepPreviousData: true })

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

  const { userId, name, email, username, currentLocale, notifSettings, unlockedBorders, activeBorder } = data
  const notifOn = notifSettings.notificationsEnabled
  const availableBorders = ['default', ...(unlockedBorders ?? [])]

  return (
    <div className="px-5 pt-6 pb-8 space-y-6">
      {/* Profile card */}
      <div
        className="rounded-[24px] bg-white p-6 flex items-center gap-4"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <Avatar
          username={username ?? name ?? '?'}
          imageUrl={data.avatar}
          size="lg"
          border={activeBorder}
        />
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

      {/* Avatar border picker — only shown once borders are unlocked */}
      {availableBorders.length > 1 && username && (
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
            {tA('borderPickerTitle')}
          </p>
          <div
            className="rounded-[24px] bg-white p-5 flex items-center gap-4"
            style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
          >
            {availableBorders.map(b => (
              <button key={b} onClick={() => setActiveBorder(b)} className="flex flex-col items-center gap-1.5">
                <Avatar
                  username={username}
                  imageUrl={data.avatar}
                  size="md"
                  border={b}
                  className={activeBorder === b ? 'ring-2 ring-offset-2 ring-[#1F1B16]' : ''}
                />
                <span className="text-[10px] text-[#A39B91] capitalize">
                  {b === 'default' ? tA('borderDefault') : b}
                </span>
              </button>
            ))}
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
