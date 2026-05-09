'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const t = useTranslations('login')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError(t('errorPasswordMismatch'))
      return
    }
    if (password.length < 6) {
      setError(t('errorPasswordTooShort'))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(t('errorGeneric'))
      return
    }

    router.push('/home')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4EFE8] px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="text-6xl">🥦</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1F1B16]">Project Food</h1>
          <p className="text-sm font-medium text-[#6B645C]">{t('resetPasswordTitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="password"
            placeholder={t('newPasswordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 rounded-2xl bg-white border-0 shadow-sm text-[#1F1B16] placeholder:text-[#A39B91]"
          />
          <Input
            type="password"
            placeholder={t('confirmPasswordPlaceholder')}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="h-12 rounded-2xl bg-white border-0 shadow-sm text-[#1F1B16] placeholder:text-[#A39B91]"
          />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold bg-[#F5C518] text-[#1F1B16] hover:bg-[#F59A0E] border-0 rounded-full shadow-none"
          >
            {loading ? t('saving') : t('setNewPassword')}
          </Button>
        </form>
      </div>
    </div>
  )
}
