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

export function AdviceBanner({ }: Props) {
  const t = useTranslations('advice')

  return (
    <Link
      href="/advice"
      className="rounded-[24px] px-5 py-4 flex items-center gap-3 overflow-hidden active:opacity-80 transition-opacity"
      style={{ background: 'rgb(224 215 203)' }}
    >
      <div className="shrink-0 self-stretch flex items-end" style={{ margin: '-16px 0 -16px -4px' }}>
        <Image src={CART_IMAGE} alt="Grocery advice" width={84} height={84} style={{ width: 84, height: 84 }} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1F1B16]">{t('title')}</p>
        <p className="text-[12px] text-[#6B645C] leading-snug mt-0.5">{t('bannerLockedSub')}</p>
      </div>
      <ChevronRight size={16} className="text-[#A39B91] shrink-0" />
    </Link>
  )
}
