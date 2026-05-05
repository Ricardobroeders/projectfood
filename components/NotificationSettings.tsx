'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { NotificationPermissionModal } from './NotificationPermissionModal'
import { Bell, BellOff } from 'lucide-react'

type NotifSettings = {
  notificationsEnabled: boolean
  notifDailyReminder: boolean
  notifStreakRescue: boolean
  notifGoalReached: boolean
  notifWeeklyNudge: boolean
  notifReengagement: boolean
  reminderTime: string
  timezone: string
}

type Props = {
  userId: string
  initial: NotifSettings
  isStandalone: boolean
  isIOS: boolean
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
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

function SettingsRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
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

export function NotificationSettings({ userId, initial, isStandalone, isIOS }: Props) {
  const t = useTranslations('notifications')
  const tAccount = useTranslations('account')

  const [settings, setSettings] = useState<NotifSettings>(initial)
  const [showModal, setShowModal] = useState(false)
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default')
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(initial.notificationsEnabled)

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionState(Notification.permission)
    }
  }, [])

  async function persistSettings(patch: Partial<NotifSettings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    setSaving(true)
    const supabase = createClient()
    await supabase.from('user_settings').update({
      notifications_enabled: next.notificationsEnabled,
      notif_daily_reminder: next.notifDailyReminder,
      notif_streak_rescue: next.notifStreakRescue,
      notif_goal_reached: next.notifGoalReached,
      notif_weekly_nudge: next.notifWeeklyNudge,
      notif_reengagement: next.notifReengagement,
      reminder_time: next.reminderTime,
      timezone: next.timezone,
    }).eq('user_id', userId)
    setSaving(false)
  }

  async function subscribe(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    })
    const json = sub.toJSON()
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json),
    })
    return res.ok
  }

  async function unsubscribe() {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      const endpoint = sub.endpoint
      await sub.unsubscribe()
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      })
    } else {
      await fetch('/api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    }
  }

  async function handleMasterToggle(enabled: boolean) {
    if (!enabled) {
      await unsubscribe()
      await persistSettings({ notificationsEnabled: false })
      setExpanded(false)
      return
    }

    // iOS not in standalone → show install hint instead
    if (isIOS && !isStandalone) return

    // Permission already denied
    if (permissionState === 'denied') return

    // Permission already granted → subscribe directly
    if (permissionState === 'granted') {
      const ok = await subscribe()
      if (ok) {
        // Detect and persist timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        await persistSettings({ notificationsEnabled: true, timezone: tz })
        setExpanded(true)
      }
      return
    }

    // Default → show custom prompt first
    setShowModal(true)
  }

  async function handleAllowFromModal() {
    setShowModal(false)
    const result = await Notification.requestPermission()
    setPermissionState(result)

    // Store denial time to avoid re-prompting for 30 days
    if (result === 'denied') {
      localStorage.setItem('pf_notif_denied_at', String(Date.now()))
      return
    }

    if (result === 'granted') {
      const ok = await subscribe()
      if (ok) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        await persistSettings({ notificationsEnabled: true, timezone: tz })
        setExpanded(true)
      }
    }
  }

  // Determine what to show for the master toggle row
  const masterValue = settings.notificationsEnabled && permissionState !== 'denied'

  // iOS not standalone: show install-first message
  if (isIOS && !isStandalone) {
    return (
      <div className="divide-y divide-[#F4EFE8]">
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-[15px] font-medium text-[#1F1B16]">{t('settingsTitle')}</span>
          <BellOff size={18} className="text-[#A39B91]" />
        </div>
        <div className="px-5 py-3">
          <p className="text-[13px] text-[#A39B91] leading-snug">{t('iosFirst')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-[#F4EFE8]">
        {/* Master toggle row */}
        <div className="flex items-center justify-between px-5 py-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Bell size={18} className="text-[#1F1B16] shrink-0" />
            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[#1F1B16]">{t('settingsTitle')}</p>
              {permissionState === 'denied' && (
                <p className="text-[12px] text-red-500 mt-0.5">{t('permissionDenied')}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saving && <span className="text-[12px] text-[#A39B91]">…</span>}
            <Toggle
              checked={masterValue}
              onChange={handleMasterToggle}
              disabled={permissionState === 'denied'}
            />
          </div>
        </div>

        {/* Expanded sub-settings */}
        {expanded && masterValue && (
          <>
            {/* Reminder time */}
            <div className="flex items-center justify-between px-5 py-4 gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[#1F1B16]">{t('reminderTime')}</p>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => persistSettings({ reminderTime: e.target.value })}
                className="text-[14px] text-[#1F1B16] font-medium bg-[#F4EFE8] rounded-xl px-3 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Per-type toggles */}
            <SettingsRow
              label={t('types.dailyReminder.label')}
              description={t('types.dailyReminder.description')}
              checked={settings.notifDailyReminder}
              onChange={(v) => persistSettings({ notifDailyReminder: v })}
            />
            <SettingsRow
              label={t('types.streakRescue.label')}
              description={t('types.streakRescue.description')}
              checked={settings.notifStreakRescue}
              onChange={(v) => persistSettings({ notifStreakRescue: v })}
            />
            <SettingsRow
              label={t('types.goalReached.label')}
              description={t('types.goalReached.description')}
              checked={settings.notifGoalReached}
              onChange={(v) => persistSettings({ notifGoalReached: v })}
            />
            <SettingsRow
              label={t('types.weeklyNudge.label')}
              description={t('types.weeklyNudge.description')}
              checked={settings.notifWeeklyNudge}
              onChange={(v) => persistSettings({ notifWeeklyNudge: v })}
            />
            <SettingsRow
              label={t('types.reengagement.label')}
              description={t('types.reengagement.description')}
              checked={settings.notifReengagement}
              onChange={(v) => persistSettings({ notifReengagement: v })}
            />
          </>
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
