'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronLeft, Bell, BellOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { fetchAccount } from '@/lib/fetchers'
import { NotificationPermissionModal } from '@/components/NotificationPermissionModal'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none disabled:opacity-40"
      style={{ background: checked ? '#16a34a' : '#D1C9C0' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  )
}

function Row({ label, description, checked, onChange, disabled }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-3">
      <div className="min-w-0">
        <p className="text-[15px] font-medium text-[#1F1B16]">{label}</p>
        {description && <p className="text-[12px] text-[#A39B91] mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const t = useTranslations('notifications')
  const locale = useLocale()

  const { data, isLoading } = useSWR(['account', locale], fetchAccount, { keepPreviousData: true })

  const [enabled, setEnabled] = useState(false)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [streakRescue, setStreakRescue] = useState(true)
  const [weeklyNudge, setWeeklyNudge] = useState(true)
  const [reengagement, setReengagement] = useState(true)
  const [timezone, setTimezone] = useState('Europe/Amsterdam')

  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Hydrate from fetched data
  useEffect(() => {
    if (!data?.notifSettings) return
    const s = data.notifSettings
    setEnabled(s.notificationsEnabled)
    setDailyReminder(s.notifDailyReminder)
    setStreakRescue(s.notifStreakRescue)
    setWeeklyNudge(s.notifWeeklyNudge)
    setReengagement(s.notifReengagement)
    setTimezone(s.timezone)
  }, [data])

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    setIsStandalone(standalone)
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent))
    if ('Notification' in window) setPermission(Notification.permission)
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-6 pb-8 space-y-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-20" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  const userId = data.userId

  async function save(patch: Record<string, unknown>) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('user_settings').update(patch).eq('user_id', userId)
    setSaving(false)
  }

  async function subscribe(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    })
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub.toJSON()),
    })
    return res.ok
  }

  async function unsubscribe() {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    const endpoint = sub?.endpoint
    await sub?.unsubscribe()
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    })
  }

  async function handleMasterToggle(on: boolean) {
    if (!on) {
      await unsubscribe()
      setEnabled(false)
      await save({ notifications_enabled: false })
      return
    }
    if (isIOS && !isStandalone) return
    if (permission === 'denied') return
    if (permission === 'granted') {
      const ok = await subscribe()
      if (ok) {
        setEnabled(true)
        await save({ notifications_enabled: true, timezone })
      }
      return
    }
    setShowModal(true)
  }

  async function handleAllowFromModal() {
    setShowModal(false)
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'denied') {
      localStorage.setItem('pf_notif_denied_at', String(Date.now()))
      return
    }
    if (result === 'granted') {
      const ok = await subscribe()
      if (ok) {
        setEnabled(true)
        await save({ notifications_enabled: true, timezone })
      }
    }
  }

  const masterOn = enabled && permission !== 'denied'

  // iOS not standalone: show install-first
  if (isIOS && !isStandalone) {
    return (
      <div className="px-5 pt-6 pb-8 space-y-6">
        <BackRow onBack={() => router.back()} />
        <div className="rounded-[24px] bg-white px-5 py-6 flex gap-4" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
          <BellOff size={20} className="text-[#A39B91] shrink-0 mt-0.5" />
          <p className="text-[14px] text-[#6B645C] leading-relaxed">{t('iosFirst')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-5 pt-6 pb-8 space-y-6">
        <BackRow onBack={() => router.back()} />

        {/* Master toggle */}
        <div
          className="rounded-[24px] bg-white"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <div className="flex items-center justify-between px-5 py-4 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Bell size={18} className="text-[#1F1B16] shrink-0" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[#1F1B16]">{t('masterToggle')}</p>
                {permission === 'denied' && (
                  <p className="text-[12px] text-red-500 mt-0.5">{t('permissionDenied')}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saving && <span className="text-[12px] text-[#A39B91]">…</span>}
              <Toggle checked={masterOn} onChange={handleMasterToggle} disabled={permission === 'denied'} />
            </div>
          </div>
        </div>

        {/* Sub-settings — only shown when enabled */}
        {masterOn && (
          <div
            className="rounded-[24px] bg-white divide-y divide-[#F4EFE8]"
            style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
          >
            <Row
              label={t('types.dailyReminder.label')}
              description={t('types.dailyReminder.description')}
              checked={dailyReminder}
              onChange={(v) => { setDailyReminder(v); save({ notif_daily_reminder: v }) }}
            />
            <Row
              label={t('types.streakRescue.label')}
              description={t('types.streakRescue.description')}
              checked={streakRescue}
              onChange={(v) => { setStreakRescue(v); save({ notif_streak_rescue: v }) }}
            />
            <Row
              label={t('types.weeklyNudge.label')}
              description={t('types.weeklyNudge.description')}
              checked={weeklyNudge}
              onChange={(v) => { setWeeklyNudge(v); save({ notif_weekly_nudge: v }) }}
            />
            <Row
              label={t('types.reengagement.label')}
              description={t('types.reengagement.description')}
              checked={reengagement}
              onChange={(v) => { setReengagement(v); save({ notif_reengagement: v }) }}
            />
          </div>
        )}
      </div>

      {showModal && (
        <NotificationPermissionModal
          onAllow={handleAllowFromModal}
          onDismiss={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function BackRow({ onBack }: { onBack: () => void }) {
  const t = useTranslations('notifications')
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1F1B16] -ml-1"
    >
      <ChevronLeft size={20} />
      {t('settingsTitle')}
    </button>
  )
}
