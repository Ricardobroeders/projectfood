'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@supabase/supabase-js'

type Step = 'email' | 'code' | 'confirm' | 'done'

/**
 * A session that lives in memory only: the marketing site must not sign the visitor into the PWA,
 * and the session is thrown away with the page. Implicit flow so the email carries a code, not a link.
 */
function memoryClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, flowType: 'implicit' },
  })
}

const input =
  'w-full h-12 px-4 rounded-2xl bg-white shadow-sm text-[#1F1B16] placeholder:text-[#D4CEC7] outline-none focus:ring-2 focus:ring-[#F5C518]'
const primary =
  'w-full h-12 rounded-full bg-[#F5C518] text-[#1F1B16] text-base font-semibold hover:bg-[#F59A0E] disabled:opacity-50 transition-colors'
const secondary = 'w-full h-12 rounded-full text-[#6B645C] text-base font-semibold hover:text-[#1F1B16] transition-colors'

export function DeleteAccountFlow() {
  const t = useTranslations('marketing.deleteAccount')
  const supabase = useMemo(memoryClient, [])
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
    setBusy(false)
    // an address without an account gets the same neutral message as one with an account
    if (error && !/signups not allowed/i.test(error.message)) {
      setError(t('errorDelete'))
      return
    }
    setCode('')
    setStep('code')
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' })
    setBusy(false)
    if (error) {
      setError(t('errorCode'))
      return
    }
    setStep('confirm')
  }

  async function remove() {
    setError(null)
    setBusy(true)
    const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' })
    if (error) {
      setError(t('errorDelete'))
      setBusy(false)
      return
    }
    await supabase.auth.signOut().catch(() => {})
    setBusy(false)
    setStep('done')
  }

  return (
    <div className="rounded-[24px] bg-[#F4EFE8] p-6">
      {step === 'email' && (
        <form onSubmit={sendCode} className="space-y-3">
          <label className="block text-sm font-semibold text-[#1F1B16]" htmlFor="delete-email">
            {t('emailLabel')}
          </label>
          <input
            id="delete-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || !email} className={primary}>
            {busy ? '…' : t('sendCode')}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm text-[#6B645C] leading-relaxed">{t('codeSent')}</p>
          <label className="block text-sm font-semibold text-[#1F1B16]" htmlFor="delete-code">
            {t('codeLabel')}
          </label>
          <input
            id="delete-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            className={`${input} text-center text-2xl font-bold tracking-[0.3em]`}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || code.length < 6} className={primary}>
            {busy ? '…' : t('verify')}
          </button>
          <button type="button" onClick={() => setStep('email')} className={secondary}>
            {t('cancel')}
          </button>
        </form>
      )}

      {step === 'confirm' && (
        <div className="space-y-3">
          <h3 className="text-lg font-extrabold text-[#1F1B16]">{t('confirmTitle')}</h3>
          <p className="text-[15px] text-[#6B645C] leading-relaxed">{t('confirmBody', { email })}</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="w-full h-12 rounded-full bg-[#D9503F] text-white text-base font-semibold hover:bg-[#C2402F] disabled:opacity-50 transition-colors"
          >
            {busy ? '…' : t('confirmButton')}
          </button>
          <button type="button" onClick={() => setStep('email')} disabled={busy} className={secondary}>
            {t('cancel')}
          </button>
        </div>
      )}

      {step === 'done' && (
        <div>
          <h3 className="text-lg font-extrabold text-[#1F1B16] mb-2">{t('doneTitle')}</h3>
          <p className="text-[15px] text-[#6B645C] leading-relaxed">{t('doneBody')}</p>
        </div>
      )}
    </div>
  )
}
