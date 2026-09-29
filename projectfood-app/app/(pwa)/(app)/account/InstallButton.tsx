'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Download, CheckCircle2, Monitor, Share, SquareArrowUp, Plus, X } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function IOSModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations('account')
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl pb-8 pt-6 px-6"
        style={{ background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-[17px] font-semibold text-[#1F1B16]">{t('iosModalTitle')}</p>
          <button onClick={onClose} className="text-[#A39B91]">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <IOSStep number={1} icon={<SquareArrowUp size={22} className="text-[#1F1B16]" />} label={t('iosStep1')} />
          <IOSStep number={2} icon={<Plus size={22} className="text-[#1F1B16]" />} label={t('iosStep2')} />
          <IOSStep number={3} icon={<CheckCircle2 size={22} className="text-green-600" />} label={t('iosStep3')} />
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full h-12 rounded-2xl text-[15px] font-semibold text-[#1F1B16]"
          style={{ background: '#F5C518' }}
        >
          {t('iosModalClose')}
        </button>
      </div>
    </div>
  )
}

function IOSStep({ number, icon, label }: { number: number; icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-[#1F1B16]"
        style={{ background: '#F4EFE8' }}
      >
        {number}
      </div>
      <div className="shrink-0 w-8 flex justify-center">{icon}</div>
      <p className="text-[14px] text-[#1F1B16] leading-snug">{label}</p>
    </div>
  )
}

export function InstallButton() {
  const t = useTranslations('account')
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    setIsStandalone(standalone)

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const mobile = ios || /android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1
    setIsIOS(ios)
    setIsMobile(mobile)

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsStandalone(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Allow forcing iOS modal open via ?iosDebug=1 for local testing
  const iosDebug = searchParams.get('iosDebug') === '1'

  async function install() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setIsStandalone(true)
      setPrompt(null)
    }
  }

  if (isStandalone) {
    return (
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-medium text-[#1F1B16]">{t('installApp')}</p>
          <p className="text-[12px] text-[#A39B91]">{t('runningFromHomeScreen')}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
          <CheckCircle2 size={16} />
          {t('installed')}
        </div>
      </div>
    )
  }

  if (prompt) {
    return (
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-medium text-[#1F1B16]">{t('installApp')}</p>
          <p className="text-[12px] text-[#A39B91]">{t('addToHomeScreen')}</p>
        </div>
        <button
          onClick={install}
          className="flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold"
          style={{ background: '#F5C518', color: '#1F1B16' }}
        >
          <Download size={14} />
          {t('install')}
        </button>
      </div>
    )
  }

  if (!isMobile && !iosDebug) {
    return (
      <div className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-medium text-[#1F1B16]">{t('installApp')}</p>
          <p className="text-[12px] text-[#A39B91]">{t('desktopHint')}</p>
        </div>
        <Monitor size={18} className="text-[#A39B91] shrink-0" />
      </div>
    )
  }

  if (isIOS || iosDebug) {
    return (
      <>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-[#1F1B16]">{t('installApp')}</p>
            <p className="text-[12px] text-[#A39B91]">{t('addToHomeScreen')}</p>
          </div>
          <button
            onClick={() => setShowIOSModal(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold"
            style={{ background: '#F5C518', color: '#1F1B16' }}
          >
            <Share size={14} />
            {t('install')}
          </button>
        </div>
        {showIOSModal && <IOSModal onClose={() => setShowIOSModal(false)} />}
      </>
    )
  }

  return null
}
