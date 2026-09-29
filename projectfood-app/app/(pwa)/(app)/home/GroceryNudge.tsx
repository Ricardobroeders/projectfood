'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
  weekCount: number
  onOpen: () => void
}

const THRESHOLD = 7

export function GroceryNudge({ weekCount, onOpen }: Props) {
  const t = useTranslations('groceryFlow')

  if (weekCount < THRESHOLD) {
    return (
      <div
        className="rounded-[24px] px-5 py-4 flex items-center gap-3 overflow-hidden"
        style={{ background: 'rgb(224 215 203)' }}
      >
        <div className="shrink-0 flex items-center" style={{ marginLeft: '-4px' }}>
          <Image
            src="/images/shopping-cart.png"
            alt={t('nudgeTitle')}
            width={84}
            height={84}
            unoptimized
            className="object-contain opacity-40"
            style={{ width: 84, height: 84 }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#1F1B16]">{t('nudgeTitle')}</p>
          <p className="text-[12px] text-[#6B645C] leading-snug mt-0.5">
            {t('nudgeLocked', { n: THRESHOLD - weekCount })}
          </p>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onOpen}
      className="w-full rounded-[24px] px-5 py-4 flex items-center gap-3 overflow-hidden active:opacity-80 transition-opacity text-left"
      style={{ background: 'rgb(224 215 203)' }}
    >
      <div className="shrink-0 flex items-center" style={{ marginLeft: '-4px' }}>
        <Image
          src="/images/shopping-cart.png"
          alt={t('nudgeTitle')}
          width={84}
          height={84}
          unoptimized
          className="object-contain"
          style={{ width: 84, height: 84 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#1F1B16]">
          {weekCount >= 30 ? t('nudgeGoal') : t('nudgeCount', { count: weekCount })}
        </p>
        <p className="text-[12px] text-[#6B645C] leading-snug mt-0.5">{t('nudgeSub')}</p>
      </div>
      <span
        className="shrink-0 inline-flex items-center h-8 px-3 rounded-full text-[12px] font-semibold"
        style={{ background: '#F5C518', color: '#1F1B16' }}
      >
        {t('nudgeCta')}
      </span>
    </button>
  )
}
