'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface Props {
  open: boolean
  onClose: () => void
}

export function GoalModal({ open, onClose }: Props) {
  const t = useTranslations('advice')
  const router = useRouter()

  if (!open) return null

  function goToList() {
    onClose()
    router.push('/advice?new=1')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(31,27,22,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[28px] bg-white p-6 space-y-5"
        style={{ boxShadow: '0 24px 48px rgba(31,27,22,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <Image
            src="/images/shopping-cart.png"
            alt="Shopping cart"
            width={120}
            height={120}
            unoptimized
            className="object-contain"
          />
        </div>

        <div className="text-center">
          <h2 className="text-[20px] font-extrabold text-[#1F1B16]">{t('goalModalTitle')}</h2>
          <p className="text-[14px] text-[#6B645C] mt-2">{t('goalModalSub')}</p>
        </div>

        <button
          onClick={goToList}
          className="w-full h-12 rounded-full text-[15px] font-semibold"
          style={{ background: '#F5C518', color: '#1F1B16' }}
        >
          {t('goToList')}
        </button>

        <button
          onClick={onClose}
          className="w-full text-center text-[13px] text-[#A39B91]"
        >
          {t('close')}
        </button>
      </div>
    </div>
  )
}
