'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'

type Locale = 'en' | 'nl' | 'it'

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'English',    flag: '/flags/en.svg' },
  { code: 'nl', label: 'Nederlands', flag: '/flags/nl.svg' },
  { code: 'it', label: 'Italiano',   flag: '/flags/it.svg' },
]

export function OnboardingModal() {
  const t = useTranslations('onboarding')
  const router = useRouter()

  const [visible, setVisible] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [locale, setLocale] = useState<Locale>('en')
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: settings } = await supabase
        .from('user_settings')
        .select('username, locale')
        .eq('user_id', user.id)
        .single()

      if (!settings?.username) {
        setUserId(user.id)
        setLocale((settings?.locale as Locale) ?? 'en')
        setVisible(true)
      }
    })
  }, [])

  async function save() {
    if (!userId || !username.trim()) return
    setStatus('saving')
    const supabase = createClient()
    const { error } = await supabase
      .from('user_settings')
      .update({ username: username.trim(), locale })
      .eq('user_id', userId)

    if (error) {
      setErrorMsg(error.code === '23505' ? t('usernameTaken') : t('saveError'))
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    document.cookie = `pf_locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
    setVisible(false)
    mutate((key) => Array.isArray(key) && key[0] === 'account')
    router.refresh()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(31,27,22,0.45)' }}>
      <div className="w-full max-w-sm rounded-[28px] bg-white p-6 space-y-5" style={{ boxShadow: '0 24px 48px rgba(31,27,22,0.18)' }}>
        {/* Header */}
        <div>
          <h2 className="text-[20px] font-extrabold text-[#1F1B16]">{t('title')}</h2>
          <p className="text-[13px] text-[#6B645C] mt-1">{t('subtitle')}</p>
        </div>

        {/* Username */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] block mb-2">
            {t('usernameLabel')}
          </label>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); setStatus('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            maxLength={30}
            placeholder={t('usernamePlaceholder')}
            autoFocus
            className="w-full h-12 px-4 rounded-[14px] text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] outline-none"
            style={{ background: '#F4EFE8' }}
          />
          {status === 'error' && (
            <p className="text-[12px] text-red-500 mt-1.5">{errorMsg}</p>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] block mb-2">
            {t('languageLabel')}
          </label>
          <div className="flex gap-3">
            {LOCALES.map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                title={label}
                className="relative w-10 h-10 rounded-full overflow-hidden transition-all"
                style={{
                  outline: locale === code ? '2.5px solid #F5C518' : '2.5px solid transparent',
                  outlineOffset: '2px',
                  opacity: locale === code ? 1 : 0.4,
                }}
              >
                <Image src={flag} alt={label} fill unoptimized className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={save}
          disabled={!username.trim() || status === 'saving'}
          className="w-full h-12 rounded-full text-[15px] font-semibold transition-opacity"
          style={{
            background: '#F5C518',
            color: '#1F1B16',
            opacity: !username.trim() || status === 'saving' ? 0.5 : 1,
          }}
        >
          {status === 'saving' ? t('saving') : t('save')}
        </button>

      </div>
    </div>
  )
}
