'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { CATS, CAT_ORDER, type Category } from '@/lib/cats'
import { Search, Check, Send } from 'lucide-react'
import Image from 'next/image'

type Plant = { id: string; name: string; category: Category; image_url: string | null }
type Toast = { id: string; name: string }

function currentWeekStart(): string {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toLocaleDateString('en-CA')
}

function getLocaleFromCookie(): string {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/pf_locale=([^;]+)/)
  return match?.[1] ?? 'en'
}

export default function LogPage() {
  const router = useRouter()
  const t = useTranslations('log')
  const tCat = useTranslations('categories')
  const [plants, setPlants] = useState<Plant[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const [adviceToast, setAdviceToast] = useState(false)
  const adviceToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [loggedToday, setLoggedToday] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const locale = getLocaleFromCookie()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })

    Promise.all([
      supabase
        .from('plant_translations')
        .select('plant_id, name, plants!inner(id, category, is_active, image_url)')
        .eq('locale', locale)
        .eq('plants.is_active', true)
        .order('name'),
      supabase
        .from('plant_logs')
        .select('plant_id')
        .eq('logged_on', new Date().toLocaleDateString('en-CA')),
    ]).then(([{ data: translationRows }, { data: logs }]) => {
      const plantList: Plant[] = ((translationRows ?? []) as any[]).map((row) => ({
        id: row.plants.id,
        name: row.name,
        category: row.plants.category as Category,
        image_url: row.plants.image_url ?? null,
      }))
      plantList.sort((a, b) => a.name.localeCompare(b.name))
      setPlants(plantList)
      if (logs) setLoggedToday(new Set(logs.map((r) => r.plant_id)))
    })
  }, [])

  // Reset submission state when query changes
  useEffect(() => {
    setSubmitStatus('idle')
  }, [query])

  const filtered = plants.filter((p) => {
    const matchesCat = activeCategory ? p.category === activeCategory : true
    const matchesQuery = query.trim()
      ? p.name.toLowerCase().includes(query.toLowerCase())
      : true
    return matchesCat && matchesQuery
  })

  async function logPlant(plant: Plant) {
    if (!userId) return
    const supabase = createClient()
    const today = new Date().toLocaleDateString('en-CA')

    startTransition(async () => {
      const { error } = await supabase
        .from('plant_logs')
        .insert({ plant_id: plant.id, logged_on: today, user_id: userId })
      if (error) return

      setLoggedToday((prev) => new Set(prev).add(plant.id))
      router.refresh()

      if (toastTimer.current) clearTimeout(toastTimer.current)
      setToast({ id: plant.id, name: plant.name })
      toastTimer.current = setTimeout(() => setToast(null), 2500)

      // Check if user just hit 30 unique plants — trigger advice generation
      const { data: variety } = await supabase.rpc('weekly_variety')
      if ((variety as number) >= 30) {
        const ws = currentWeekStart()
        const { data: existingAdvice } = await supabase
          .from('weekly_advice')
          .select('id')
          .eq('week_start', ws)
          .maybeSingle()
        if (!existingAdvice) {
          fetch('/api/advice', { method: 'POST' })
          if (adviceToastTimer.current) clearTimeout(adviceToastTimer.current)
          setAdviceToast(true)
          adviceToastTimer.current = setTimeout(() => setAdviceToast(false), 5000)
        }
      }
    })
  }

  async function unlogPlant(plant: Plant) {
    const supabase = createClient()
    const today = new Date().toLocaleDateString('en-CA')

    startTransition(async () => {
      const { error } = await supabase
        .from('plant_logs')
        .delete()
        .eq('plant_id', plant.id)
        .eq('logged_on', today)
      if (error) return

      setLoggedToday((prev) => {
        const next = new Set(prev)
        next.delete(plant.id)
        return next
      })
      router.refresh()
    })
  }

  async function submitSuggestion() {
    if (!userId || !query.trim()) return
    setSubmitStatus('sending')
    const supabase = createClient()
    await supabase.from('plant_submissions').insert({
      submitted_by: userId,
      proposed_name: query.trim(),
    })
    setSubmitStatus('done')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="px-5 pt-4 pb-3">
        <div
          className="flex items-center gap-3 h-14 px-5 rounded-full bg-white"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.06)' }}
        >
          <Search size={18} className="text-[#A39B91] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] bg-transparent outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(''); inputRef.current?.focus() }} className="text-[#A39B91] text-sm">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveCategory(null)}
          className="shrink-0 inline-flex items-center h-9 px-4 rounded-full text-[13px] font-medium transition-colors"
          style={
            activeCategory === null
              ? { background: '#1F1B16', color: '#FFFFFF' }
              : { background: '#F4EFE8', color: '#6B645C' }
          }
        >
          {t('all')}
        </button>
        {CAT_ORDER.map((cat) => {
          const c = CATS[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] font-medium transition-colors"
              style={
                isActive
                  ? { background: c.dot, color: '#FFFFFF' }
                  : { background: c.bg, color: c.fg }
              }
            >
              {c.emoji} {tCat(cat)}
            </button>
          )
        })}
      </div>

      {/* Plant list */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2">
        {filtered.length === 0 && query.trim() && (
          <div className="pt-6">
            <div className="text-center mb-6 text-[#A39B91]">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">{t('noResults', { query })}</p>
            </div>

            {submitStatus === 'done' ? (
              <div
                className="rounded-[18px] p-5 text-center"
                style={{ background: '#DDEACB' }}
              >
                <div className="text-2xl mb-2">🌱</div>
                <p className="text-[15px] font-semibold text-[#2D4A22]">{t('suggestionSent')}</p>
                <p className="text-[13px] text-[#4F7A3D] mt-1">{t('suggestionSentSub')}</p>
              </div>
            ) : (
              <div
                className="rounded-[18px] p-5"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
              >
                <p className="text-[16px] font-semibold text-[#1F1B16] mb-1">
                  {t('missingTitle')}
                </p>
                <p className="text-[15px] text-[#6B645C] mb-4">
                  {t('missingBody', { query })}
                </p>

                <button
                  onClick={submitSuggestion}
                  disabled={submitStatus === 'sending'}
                  className="w-full h-11 rounded-full flex items-center justify-center gap-2 text-[14px] font-semibold transition-opacity"
                  style={{ background: '#F5C518', color: '#1F1B16', opacity: submitStatus === 'sending' ? 0.6 : 1 }}
                >
                  <Send size={15} />
                  {submitStatus === 'sending' ? t('sending') : t('submitSuggestion')}
                </button>
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 && !query.trim() && (
          <div className="text-center py-16 text-[#A39B91]">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">{t('noResultsEmpty')}</p>
          </div>
        )}

        {filtered.map((plant) => {
          const c = CATS[plant.category]
          const logged = loggedToday.has(plant.id)
          return (
            <button
              key={plant.id}
              onClick={() => logged ? unlogPlant(plant) : logPlant(plant)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-[18px] text-left transition-all"
              style={{
                background: logged ? 'rgb(224 215 203)' : '#FFFFFF',
                boxShadow: logged ? 'none' : '0 2px 6px rgba(31,27,22,0.04)',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl grid place-items-center text-lg shrink-0"
                style={{ background: c.bg }}
              >
                {plant.image_url ? (
                  <Image src={plant.image_url} alt={plant.name} width={32} height={32} className="object-contain" />
                ) : (
                  c.emoji
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-[#1F1B16] truncate">{plant.name}</p>
                <p className="text-[12px] text-[#A39B91]">{tCat(plant.category)}</p>
              </div>
              <div
                className="w-10 h-10 rounded-full grid place-items-center shrink-0 transition-colors"
                style={
                  logged
                    ? { background: '#F5C518', color: '#1F1B16' }
                    : { background: '#F4EFE8', color: '#A39B91' }
                }
              >
                <Check size={16} strokeWidth={2.5} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Advice generating toast */}
      {adviceToast && (
        <div className="fixed bottom-36 left-4 right-4 z-50 pointer-events-none">
          <div
            className="flex items-center gap-3 px-5 py-3.5 rounded-[18px] text-[#2D4A22] text-[14px] font-medium"
            style={{ background: '#DDEACB', boxShadow: '0 8px 24px rgba(31,27,22,0.12)' }}
          >
            <span className="text-xl">🛒</span>
            {t('adviceGenerating')}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-full text-white text-[14px] font-medium"
            style={{ background: '#1F1B16', boxShadow: '0 8px 24px rgba(31,27,22,0.18)' }}
          >
            <div className="w-8 h-8 rounded-full grid place-items-center bg-[#F5C518] text-[#1F1B16]">
              <Check size={14} strokeWidth={3} />
            </div>
            {t('logged', { name: toast.name })}
          </div>
        </div>
      )}
    </div>
  )
}
