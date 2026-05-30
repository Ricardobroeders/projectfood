'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  onDismiss: () => void
}

export function SurveyPromptBanner({ userId, onDismiss }: Props) {
  const t = useTranslations('survey')

  const dismiss = async () => {
    onDismiss()
    await createClient()
      .from('user_settings')
      .update({ survey_dismissed_at: new Date().toISOString() })
      .eq('user_id', userId)
  }

  return (
    <div
      className="rounded-[24px] px-5 py-4 flex items-center gap-3"
      style={{ background: 'rgb(224 215 203)' }}
    >
      <span className="text-2xl shrink-0">📋</span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1F1B16] leading-tight">{t('prompt_banner')}</p>
        <Link
          href="/account/survey"
          className="inline-flex items-center h-7 px-3 mt-2 rounded-full text-[12px] font-semibold"
          style={{ background: '#F5C518', color: '#1F1B16' }}
        >
          {t('prompt_cta')}
        </Link>
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#6B645C] active:opacity-60 transition-opacity"
        aria-label={t('prompt_dismiss')}
      >
        <X size={16} />
      </button>
    </div>
  )
}
