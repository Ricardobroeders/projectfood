'use client'

import { useTranslations } from 'next-intl'
import { ShoppingCart, Star } from 'lucide-react'

type Suggestion = { plant: string; reason: string; featured?: boolean }
export type Advice = { summary: string; suggestions: Suggestion[] }

export function AdviceCard({ advice }: { advice: Advice }) {
  const t = useTranslations('advice')

  const featured = advice.suggestions.filter((s) => s.featured)
  const rest = advice.suggestions.filter((s) => !s.featured)

  return (
    <div className="rounded-[18px] p-5" style={{ background: '#DDEACB' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full grid place-items-center bg-white/60">
          <ShoppingCart size={15} className="text-[#4F7A3D]" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#4F7A3D]">{t('title')}</p>
          <p className="text-[11px] text-[#4F7A3D]/70">{t('subtitle')}</p>
        </div>
      </div>

      <p className="text-[14px] text-[#2D4A22] mb-3 leading-relaxed">{advice.summary}</p>

      <div className="space-y-2">
        {featured.map((s, i) => (
          <div key={`f-${i}`} className="rounded-[10px] p-3" style={{ background: 'rgba(79,122,61,0.18)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Star size={12} className="text-[#4F7A3D] shrink-0" fill="currentColor" />
              <p className="text-[11px] font-semibold text-[#4F7A3D] uppercase tracking-wide">{t('topPick')}</p>
            </div>
            <p className="text-[14px] font-semibold text-[#1F1B16] mb-0.5">{s.plant}</p>
            <p className="text-[13px] text-[#4F7A3D] leading-snug">{s.reason}</p>
          </div>
        ))}
        {rest.map((s, i) => (
          <div key={`r-${i}`} className="rounded-[10px] p-3 bg-white/50">
            <p className="text-[14px] font-semibold text-[#1F1B16] mb-0.5">{s.plant}</p>
            <p className="text-[13px] text-[#4F7A3D] leading-snug">{s.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
