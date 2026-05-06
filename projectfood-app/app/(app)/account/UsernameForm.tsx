'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export function UsernameForm({ userId, initial }: { userId: string; initial: string | null }) {
  const t = useTranslations('account')
  const [value, setValue] = useState(initial ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const dirty = value.trim() !== (initial ?? '')

  async function save() {
    if (!value.trim()) return
    setStatus('saving')
    const supabase = createClient()
    const { error } = await supabase
      .from('user_settings')
      .update({ username: value.trim() })
      .eq('user_id', userId)

    if (error) {
      setStatus('error')
      setErrorMsg(error.code === '23505' ? t('usernameTaken') : t('saveError'))
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-[15px] font-medium text-[#1F1B16]">{t('username')}</span>
      <div className="flex items-center gap-3">
        {status === 'error' && (
          <span className="text-[12px] text-red-500">{errorMsg}</span>
        )}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={30}
          placeholder={t('chooseName')}
          className="text-[14px] text-right text-[#1F1B16] bg-transparent outline-none w-32 placeholder:text-[#A39B91]"
        />
        {dirty && status !== 'error' && (
          <button
            onClick={save}
            disabled={status === 'saving'}
            className="text-[13px] font-semibold text-[#F5C518] shrink-0"
          >
            {status === 'saving' ? t('saving') : t('save')}
          </button>
        )}
        {status === 'saved' && (
          <span className="text-[13px] font-semibold text-green-600 shrink-0">{t('saved')}</span>
        )}
      </div>
    </div>
  )
}
