'use client'

import { useTranslations } from 'next-intl'
import { Bell, X } from 'lucide-react'

type Props = {
  onAllow: () => void
  onDismiss: () => void
}

export function NotificationPermissionModal({ onAllow, onDismiss }: Props) {
  const t = useTranslations('notifications.permissionPrompt')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-md rounded-t-3xl pb-8 pt-6 px-6"
        style={{ background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: '#F4EFE8' }}
            >
              <Bell size={20} className="text-[#1F1B16]" />
            </div>
            <p className="text-[17px] font-semibold text-[#1F1B16]">{t('title')}</p>
          </div>
          <button onClick={onDismiss} className="text-[#A39B91]">
            <X size={20} />
          </button>
        </div>

        <p className="text-[14px] text-[#6B645C] leading-relaxed mb-6">{t('body')}</p>

        <button
          onClick={onAllow}
          className="w-full h-12 rounded-2xl text-[15px] font-semibold text-[#1F1B16] mb-3"
          style={{ background: '#F5C518' }}
        >
          {t('allow')}
        </button>
        <button
          onClick={onDismiss}
          className="w-full h-12 rounded-2xl text-[15px] font-medium text-[#A39B91]"
        >
          {t('notNow')}
        </button>
      </div>
    </div>
  )
}
