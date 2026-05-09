'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

type View = 'signin' | 'signup' | 'forgot' | 'check-inbox' | 'reset-sent'

export default function LoginPage() {
  const t = useTranslations('login')
  const router = useRouter()

  const [view, setView] = useState<View>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function handleEmailAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    if (view === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (signInError) {
        setError(t('errorInvalidCredentials'))
        return
      }
      router.push('/home')
      return
    }

    if (view === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/confirm?type=signup&next=/home`,
        },
      })
      setLoading(false)
      if (signUpError) {
        setError(
          signUpError.message.toLowerCase().includes('already')
            ? t('errorEmailInUse')
            : t('errorGeneric')
        )
        return
      }
      setView('check-inbox')
      return
    }
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/confirm?type=recovery&next=/reset-password`,
    })
    setLoading(false)
    setView('reset-sent')
  }

  if (view === 'check-inbox') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-6xl">📬</div>
          <h2 className="text-2xl font-extrabold text-[#1F1B16]">{t('checkYourInbox')}</h2>
          <p className="text-sm text-[#6B645C]">{t('checkYourInboxBody', { email })}</p>
          <button
            onClick={() => { setView('signin'); setPassword('') }}
            className="text-sm text-[#6B645C] underline underline-offset-2"
          >
            {t('backToSignIn')}
          </button>
        </div>
      </div>
    )
  }

  if (view === 'reset-sent') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="text-6xl">📩</div>
          <h2 className="text-2xl font-extrabold text-[#1F1B16]">{t('resetLinkSent')}</h2>
          <p className="text-sm text-[#6B645C]">{t('resetLinkSentBody', { email })}</p>
          <button
            onClick={() => { setView('signin'); setPassword('') }}
            className="text-sm text-[#6B645C] underline underline-offset-2"
          >
            {t('backToSignIn')}
          </button>
        </div>
      </div>
    )
  }

  if (view === 'forgot') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-3">
            <div className="text-6xl">🥦</div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1F1B16]">Project Food</h1>
            <p className="text-sm font-medium text-[#6B645C]">{t('forgotPasswordTitle')}</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-2xl bg-white border-0 shadow-sm text-[#1F1B16] placeholder:text-[#A39B91]"
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-[#F5C518] text-[#1F1B16] hover:bg-[#F59A0E] border-0 rounded-full shadow-none"
            >
              {t('sendResetLink')}
            </Button>
          </form>
          <div className="text-center">
            <button
              onClick={() => { setView('signin'); setError(null) }}
              className="text-sm text-[#6B645C] underline underline-offset-2"
            >
              {t('backToSignIn')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1F1B16]">Project Food</h1>
          <p className="text-sm font-medium text-[#6B645C]">{t('tagline')}</p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full gap-3 h-12 text-base font-semibold bg-[#F5C518] text-[#1F1B16] hover:bg-[#F59A0E] border-0 rounded-full shadow-none"
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            {t('continueWithGoogle')}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E0D9D1]" />
            <span className="text-xs text-[#A39B91] font-medium">{t('orDivider')}</span>
            <div className="flex-1 h-px bg-[#E0D9D1]" />
          </div>

          <div className="flex rounded-full bg-[#E8E2DA] p-1">
            <button
              onClick={() => { setView('signin'); setError(null) }}
              className={`flex-1 h-9 text-sm font-semibold rounded-full transition-colors ${view === 'signin' ? 'bg-white text-[#1F1B16] shadow-sm' : 'text-[#6B645C]'}`}
            >
              {t('signIn')}
            </button>
            <button
              onClick={() => { setView('signup'); setError(null) }}
              className={`flex-1 h-9 text-sm font-semibold rounded-full transition-colors ${view === 'signup' ? 'bg-white text-[#1F1B16] shadow-sm' : 'text-[#6B645C]'}`}
            >
              {t('signUp')}
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-3">
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-2xl bg-white border-0 shadow-sm text-[#1F1B16] placeholder:text-[#A39B91]"
            />
            <Input
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-2xl bg-white border-0 shadow-sm text-[#1F1B16] placeholder:text-[#A39B91]"
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-[#1F1B16] text-white hover:bg-[#3a3530] border-0 rounded-full shadow-none"
            >
              {loading ? '…' : view === 'signin' ? t('signIn') : t('signUp')}
            </Button>
          </form>

          <div className="text-center">
              <button
                onClick={() => { setView('forgot'); setError(null) }}
                className={`text-sm text-[#6B645C] underline underline-offset-2 ${view !== 'signin' ? 'invisible' : ''}`}
              >
                {t('forgotPassword')}
              </button>
            </div>
        </div>
      </div>
    </div>
  )
}
