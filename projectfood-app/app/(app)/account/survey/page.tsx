'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronLeft } from 'lucide-react'
import { fetchSurvey, type SurveyQuestion } from '@/lib/fetchers'
import { QuestionField } from './QuestionField'
import { createClient } from '@/lib/supabase/client'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

const SECTION_ORDER = ['identity', 'why', 'ux', 'strategy', 'features', 'pricing', 'wrapup'] as const

export default function SurveyPage() {
  const t = useTranslations('survey')
  const locale = useLocale()
  const router = useRouter()

  const { data, isLoading, mutate } = useSWR(['survey', locale], fetchSurvey, { keepPreviousData: true })

  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    if (!data) return
    const initial: Record<string, unknown> = {}
    for (const r of data.responses) {
      initial[r.question_id] = r.answer
    }
    setAnswers(initial)

    const completedIds = new Set(data.responses.filter((r) => r.status === 'complete').map((r) => r.question_id))
    if (data.questions.length > 0 && data.questions.every((q) => completedIds.has(q.id))) {
      setSubmitted(true)
    }
  }, [data?.questions.length])

  const upsert = useCallback(async (questionId: string, answer: unknown) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('survey_responses').upsert(
      {
        user_id: user.id,
        question_id: questionId,
        answer,
        status: 'draft',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,question_id' }
    )
  }, [])

  const handleChange = useCallback((question: SurveyQuestion, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }))
    if (question.type === 'text') {
      clearTimeout(debounceTimers.current[question.id])
      debounceTimers.current[question.id] = setTimeout(() => upsert(question.id, value), 800)
    } else {
      upsert(question.id, value)
    }
  }, [upsert])

  const saveAndGoBack = async () => {
    // Flush any pending text debounces before navigating
    for (const [qId, timer] of Object.entries(debounceTimers.current)) {
      clearTimeout(timer)
      if (answers[qId] != null) await upsert(qId, answers[qId])
    }
    router.push('/account')
  }

  const handleSubmit = async () => {
    if (!data) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSubmitting(false); return }

    const rows = data.questions.map((q) => ({
      user_id: user.id,
      question_id: q.id,
      answer: answers[q.id] ?? null,
      status: 'complete' as const,
      answered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    await supabase.from('survey_responses').upsert(rows, { onConflict: 'user_id,question_id' })
    setSubmitted(true)
    setSubmitting(false)
    mutate()
  }

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-6 pb-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  const { questions, responses } = data
  const completedIds = new Set(responses.filter((r) => r.status === 'complete').map((r) => r.question_id))
  const answeredCount = questions.filter((q) => completedIds.has(q.id) || answers[q.id] != null).length
  const totalCount = questions.length

  const consentQ = questions.find((q) => q.key === 'consent')
  const consentGiven = consentQ
    ? completedIds.has(consentQ.id) || (answers[consentQ.id] as string[] | undefined)?.includes('agreed')
    : true

  const bySection = new Map<string, SurveyQuestion[]>()
  for (const sec of SECTION_ORDER) {
    const qs = questions.filter((q) => q.section === sec)
    if (qs.length) bySection.set(sec, qs)
  }

  const sectionLabel = (sec: string) => {
    try { return t(`section_${sec}` as any) } catch { return sec }
  }

  if (submitted) {
    return (
      <div className="px-5 pt-6 pb-8">
        <Link href="/account" className="flex items-center gap-1 text-[#A39B91] text-sm mb-6">
          <ChevronLeft size={16} /> {t('backToAccount')}
        </Link>
        <div
          className="rounded-[24px] bg-white p-8 text-center"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-[#1F1B16] mb-2">{t('submitted_title')}</h1>
          <p className="text-[14px] text-[#6B645C]">{t('submitted_body')}</p>
        </div>
      </div>
    )
  }

  if (!consentGiven && consentQ) {
    return (
      <div className="px-5 pt-6 pb-8">
        <Link href="/account" className="flex items-center gap-1 text-[#A39B91] text-sm mb-6">
          <ChevronLeft size={16} /> {t('backToAccount')}
        </Link>
        <div
          className="rounded-[24px] bg-white p-6"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <h1 className="text-lg font-bold text-[#1F1B16] mb-1">{t('consent_heading')}</h1>
          <p className="text-[13px] text-[#6B645C] mb-6">{t('consent_body')}</p>
          <label className="flex items-start gap-3 cursor-pointer">
            <span
              className={`mt-0.5 w-5 h-5 rounded-[5px] border-2 shrink-0 flex items-center justify-center ${
                (answers[consentQ.id] as string[] | undefined)?.includes('agreed')
                  ? 'border-[#F5C518] bg-[#F5C518]'
                  : 'border-[#A39B91]'
              }`}
            >
              {(answers[consentQ.id] as string[] | undefined)?.includes('agreed') && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#1F1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span
              className="text-[14px] text-[#1F1B16] leading-snug"
              onClick={() => {
                const current = (answers[consentQ.id] as string[] | undefined) ?? []
                const next = current.includes('agreed') ? [] : ['agreed']
                handleChange(consentQ, next)
              }}
            >
              {t('consent_label')}
            </span>
          </label>
          <button
            onClick={() => {
              if (!(answers[consentQ.id] as string[] | undefined)?.includes('agreed')) return
              upsert(consentQ.id, ['agreed'])
              setAnswers((prev) => ({ ...prev, [consentQ.id]: ['agreed'] }))
            }}
            disabled={!(answers[consentQ.id] as string[] | undefined)?.includes('agreed')}
            className="mt-6 w-full h-12 rounded-[14px] text-[15px] font-semibold transition-colors disabled:opacity-40"
            style={{ background: '#F5C518', color: '#1F1B16' }}
          >
            {t('consent_cta')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Scrollable content — pb-36 makes room for sticky button above bottom nav */}
      <div className="px-5 pt-6 pb-36 space-y-6">
        {/* Header */}
        <div>
          <Link href="/account" className="flex items-center gap-1 text-[#A39B91] text-sm mb-4">
            <ChevronLeft size={16} /> {t('backToAccount')}
          </Link>
          <h1 className="text-xl font-bold text-[#1F1B16]">{t('title')}</h1>
          <p className="text-[13px] text-[#6B645C] mt-1">{t('progress', { answered: answeredCount, total: totalCount })}</p>
          <div className="mt-3 h-1.5 rounded-full bg-[#F4EFE8] overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-[#F5C518] transition-all"
              style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Sections */}
        {Array.from(bySection.entries()).map(([sec, qs]) => {
          if (sec === 'identity') return null
          return (
            <div key={sec}>
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
                {sectionLabel(sec)}
              </p>
              <div className="space-y-4">
                {qs.map((q) => (
                  <div key={q.id}>
                    {q.key === 'sus-1' && (
                      <div className="rounded-[18px] bg-[#F4EFE8] px-4 py-3 mb-3">
                        <p className="text-[12px] text-[#6B645C]">{t('sus_intro')}</p>
                      </div>
                    )}
                    <div
                      className="rounded-[24px] bg-white p-5"
                      style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
                    >
                      <p className="text-[15px] font-semibold text-[#1F1B16] mb-1 leading-snug">{q.label}</p>
                      {q.help_text && q.type !== 'scale' && (
                        <p className="text-[12px] text-[#A39B91] mb-3">{q.help_text}</p>
                      )}
                      <QuestionField
                        question={q}
                        value={answers[q.id]}
                        onChange={(v) => handleChange(q, v)}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sticky footer — sits above bottom nav (bottom nav = pb-16 = 64px) */}
      <div
        className="fixed bottom-16 left-0 right-0 px-5 pb-4 pt-8 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgb(244,239,232) 55%, rgba(244,239,232,0) 100%)' }}
      >
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={saveAndGoBack}
            disabled={submitting}
            className="flex-1 h-12 rounded-[16px] text-[14px] font-semibold transition-colors disabled:opacity-50"
            style={{ background: '#FFFFFF', color: '#6B645C', boxShadow: '0 2px 6px rgba(31,27,22,0.08)' }}
          >
            {t('save_go_back')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 h-12 rounded-[16px] text-[14px] font-semibold transition-colors disabled:opacity-50"
            style={{ background: '#F5C518', color: '#1F1B16' }}
          >
            {submitting ? '…' : t('submit')}
          </button>
        </div>
      </div>
    </>
  )
}
