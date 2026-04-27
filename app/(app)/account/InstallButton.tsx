'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Download, CheckCircle2 } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallButton() {
  const t = useTranslations('account')
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
    setIsStandalone(standalone)

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsStandalone(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

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

  if (!prompt) return null

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
