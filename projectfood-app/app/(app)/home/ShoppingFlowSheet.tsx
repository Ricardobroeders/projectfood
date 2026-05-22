'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { X, Star } from 'lucide-react'
import Image from 'next/image'
import { mutate } from 'swr'
import { useTranslations } from 'next-intl'
import { CATS } from '@/lib/cats'
import { supabaseImageUrl } from '@/lib/supabase-image'
import type { EnrichedSuggestion } from '@/lib/fetchers'

// ─── Stub fallback (shown when advice not yet generated) ──────────────────────

const STUB_SUGGESTIONS: EnrichedSuggestion[] = [
  { plant: 'Chickpeas', category: 'legume', meal_context: 'For Thursday dinner', reason: 'Fills your legume gap', why: 'Prebiotic fiber your gut bacteria love', featured: true, image_url: null },
  { plant: 'Oats', category: 'whole_grain', meal_context: 'Easy weekday breakfast', reason: 'No whole grains yet this week', featured: false, image_url: null },
  { plant: 'Basil', category: 'herb', meal_context: "Throw on tonight's pasta", reason: 'Herbs are your biggest gap', featured: false, image_url: null },
  { plant: 'Edamame', category: 'legume', meal_context: 'Quick afternoon snack', reason: 'Adds another legume variety', featured: false, image_url: null },
  { plant: 'Flaxseed', category: 'nut_seed', meal_context: 'Stir into yogurt or smoothie', reason: 'Rich in omega-3 and fiber', featured: false, image_url: null },
  { plant: 'Kimchi', category: 'ferment', meal_context: 'Side with any Asian dish', reason: 'Live cultures for gut diversity', why: 'Live cultures for gut diversity', featured: true, image_url: null },
]

// ─── Full-page shell ──────────────────────────────────────────────────────────

interface Props {
  suggestions: EnrichedSuggestion[]
  onClose: () => void
}

type Step = 0 | 1

export function ShoppingFlowSheet({ suggestions, onClose }: Props) {
  const t = useTranslations('groceryFlow')
  const [step, setStep] = useState<Step>(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [show, setShow] = useState(false)

  const validSuggestions = suggestions.filter(s => s.category && CATS[s.category])
  const activeSuggestions = validSuggestions.length > 0 ? validSuggestions : STUB_SUGGESTIONS

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(id)
  }, [])

  const animStyle: CSSProperties = {
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(48px)',
    transition: show
      ? 'opacity 260ms ease-out, transform 260ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'opacity 200ms ease-in, transform 200ms ease-in',
  }

  function handleClose() {
    setShow(false)
    setTimeout(() => {
      setStep(0)
      setSelected(new Set())
      onClose()
    }, 220)
  }

  function toggleSelect(plant: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(plant) ? next.delete(plant) : next.add(plant)
      return next
    })
  }

  async function handleFind() {
    setStep(1)
    window.dispatchEvent(new CustomEvent('pf:recipes-generating'))
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_plants: [...selected] }),
      })
      if (res.ok) {
        await mutate('recipe_state')
        window.dispatchEvent(new CustomEvent('pf:recipes-ready'))
      }
    } catch {
      // silent — user can still close and come back
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#F4EFE8', ...animStyle }}>
      {/* Header */}
      <div
        className="shrink-0 h-14 bg-white flex items-center px-4 gap-2"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <div className="w-8" />
        <p className="flex-1 text-center text-[15px] font-bold text-[#1F1B16]">
          {step === 0 ? t('picksHeader') : t('findingHeader')}
        </p>
        <button
          className="w-8 h-8 grid place-items-center text-[#A39B91]"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      {step === 0 ? (
        <PicksScreen
          suggestions={activeSuggestions}
          selected={selected}
          onToggle={toggleSelect}
          onFind={handleFind}
          t={t}
        />
      ) : (
        <FindingScreen onClose={handleClose} t={t} />
      )}
    </div>
  )
}

// ─── Picks screen ─────────────────────────────────────────────────────────────

function PicksScreen({
  suggestions,
  selected,
  onToggle,
  onFind,
  t,
}: {
  suggestions: EnrichedSuggestion[]
  selected: Set<string>
  onToggle: (plant: string) => void
  onFind: () => void
  t: ReturnType<typeof useTranslations<'groceryFlow'>>
}) {
  const canFind = selected.size > 0

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        <p className="text-[13px] text-[#6B645C] mb-3">
          {t('picksSubtitle')}
        </p>

        {suggestions.map(s => {
          const c = CATS[s.category]
          const isSelected = selected.has(s.plant)

          return (
            <button
              key={s.plant}
              onClick={() => onToggle(s.plant)}
              className="w-full flex items-center gap-3 rounded-[16px] p-3 text-left active:scale-[0.98] transition-transform"
              style={{
                background: '#FFFFFF',
                outline: isSelected ? `2px solid ${c.dot}` : '2px solid transparent',
              }}
            >
              {/* Plant image / emoji */}
              <div
                className="relative shrink-0 w-11 h-11 rounded-[12px] grid place-items-center text-[22px] overflow-hidden"
                style={{ background: c.bg }}
              >
                {s.image_url ? (
                  <Image
                    src={supabaseImageUrl(s.image_url, 44, 44)}
                    alt={s.plant}
                    width={44}
                    height={44}
                    sizes="44px"
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  c.emoji
                )}
                {s.featured && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full grid place-items-center"
                    style={{ background: c.fg }}>
                    <Star size={8} fill="#fff" color="#fff" />
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[#1F1B16] leading-tight">{s.plant}</p>
                <p className="text-[12px] text-[#A39B91] mt-0.5">{s.meal_context}</p>
                {s.why && (
                  <p className="text-[11px] mt-0.5 font-medium" style={{ color: c.fg }}>
                    {s.why}
                  </p>
                )}
              </div>

              {/* Selection ring */}
              <div
                className="shrink-0 w-6 h-6 rounded-full border-2 grid place-items-center transition-colors"
                style={{
                  borderColor: isSelected ? c.dot : '#C0B7A8',
                  background: isSelected ? c.dot : 'transparent',
                }}
              >
                {isSelected && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 px-5 pb-8 pt-3 bg-[#F4EFE8]">
        <button
          onClick={onFind}
          disabled={!canFind}
          className="w-full h-12 rounded-full text-[15px] font-semibold transition-colors"
          style={{
            background: canFind ? '#F5C518' : '#E0D7CB',
            color: canFind ? '#1F1B16' : '#A39B91',
          }}
        >
          {canFind ? t('picksCta', { count: selected.size }) : t('picksCtaDisabled')}
        </button>
      </div>
    </div>
  )
}

// ─── Finding screen ───────────────────────────────────────────────────────────

function FindingScreen({ onClose, t }: { onClose: () => void; t: ReturnType<typeof useTranslations<'groceryFlow'>> }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center space-y-6">
      {/* Bouncing dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: '#4F7A3D',
              animation: `pfBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <div>
        <h2 className="text-[22px] font-extrabold text-[#1F1B16] leading-tight">
          {t('findingTitle')}
        </h2>
        <p className="text-[14px] text-[#6B645C] mt-2 leading-relaxed">
          {t('findingSub')}
        </p>
      </div>

      <div className="w-full rounded-[16px] px-4 py-3 text-left" style={{ background: '#FFFFFF' }}>
        <p className="text-[13px] font-semibold text-[#1F1B16] mb-1">{t('findingCardTitle')}</p>
        <p className="text-[13px] text-[#6B645C] leading-relaxed">
          {t('findingCardBody')}
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full h-12 rounded-full text-[15px] font-semibold"
        style={{ background: '#F5C518', color: '#1F1B16' }}
      >
        {t('findingCta')}
      </button>

      <style>{`
        @keyframes pfBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
