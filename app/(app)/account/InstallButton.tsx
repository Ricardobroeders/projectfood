'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!prompt || installed) return null

  async function install() {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setPrompt(null)
  }

  return (
    <div className="px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-[15px] font-medium text-[#1F1B16]">Install app</p>
        <p className="text-[12px] text-[#A39B91]">Add to your home screen</p>
      </div>
      <button
        onClick={install}
        className="flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold"
        style={{ background: '#F5C518', color: '#1F1B16' }}
      >
        <Download size={14} />
        Install
      </button>
    </div>
  )
}
