'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Advice } from './AdviceCard'

interface Props {
  advice: Advice | null
  weekCount: number
}

const CART_IMAGE = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/images/app-ui-images/shopping-cart.png'

export function AdviceBanner({ advice }: Props) {
  const t = useTranslations('advice')

  if (!advice) {
    return (
      <div
        className="rounded-[24px] px-5 py-4 flex items-center gap-3"
        style={{ background: '#EDE8E1' }}
      >
        <div className="w-11 h-11 shrink-0 grid place-items-center">
          <Image src={CART_IMAGE} alt="Grocery advice" width={44} height={44} className="object-contain opacity-50" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#6B645C]">{t('title')}</p>
          <p className="text-[12px] text-[#A39B91] leading-snug mt-0.5">{t('bannerLockedSub')}</p>
        </div>
      </div>
    )
  }

  const preview = advice.suggestions
    .slice(0, 5)
    .map((s) => s.plant)
    .join(', ')

  return (
    <Link
      href="/advice"
      className="rounded-[24px] px-5 py-4 flex items-center gap-3 active:opacity-80 transition-opacity"
      style={{ background: '#DDEACB' }}
    >
      <div className="w-11 h-11 shrink-0 grid place-items-center">
        <Image src={CART_IMAGE} alt="Grocery advice" width={44} height={44} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#2D4A22]">{t('title')}</p>
        <p className="text-[12px] text-[#4F7A3D] truncate">{preview}</p>
      </div>
      <ChevronRight size={16} className="text-[#4F7A3D] shrink-0" />
    </Link>
  )
}
