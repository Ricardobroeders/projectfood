'use client'

import Link from 'next/link'
import { ShoppingCart, ChevronRight, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Advice } from './AdviceCard'

interface Props {
  advice: Advice | null
  weekCount: number
}

export function AdviceBanner({ advice, weekCount }: Props) {
  const t = useTranslations('advice')

  if (!advice) {
    return (
      <div
        className="rounded-[24px] px-5 py-4 flex items-center gap-3"
        style={{ background: '#EDE8E1' }}
      >
        <div
          className="w-9 h-9 rounded-full grid place-items-center shrink-0"
          style={{ background: '#D9D2C8' }}
        >
          <ShoppingCart size={16} className="text-[#A39B91]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#6B645C]">{t('title')}</p>
          <p className="text-[12px] text-[#A39B91]">{t('bannerLocked', { count: weekCount })}</p>
        </div>
        <Lock size={15} className="text-[#A39B91] shrink-0" />
      </div>
    )
  }

  const preview = advice.suggestions
    .slice(0, 2)
    .map((s) => s.plant)
    .join(', ')

  return (
    <Link
      href="/advice"
      className="rounded-[24px] px-5 py-4 flex items-center gap-3 active:opacity-80 transition-opacity"
      style={{ background: '#DDEACB' }}
    >
      <div className="w-9 h-9 rounded-full grid place-items-center shrink-0 bg-white/60">
        <ShoppingCart size={16} className="text-[#4F7A3D]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#2D4A22]">{t('title')}</p>
        <p className="text-[12px] text-[#4F7A3D] truncate">+ {preview}</p>
      </div>
      <ChevronRight size={16} className="text-[#4F7A3D] shrink-0" />
    </Link>
  )
}
