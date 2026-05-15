'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { fetchAccount } from '@/lib/fetchers'
import { Avatar } from '@/components/avatar'
import { CATS } from '@/lib/cats'

const BG_OPTIONS = [
  CATS.vegetable.bg,
  CATS.fruit.bg,
  CATS.herb.bg,
  CATS.nut_seed.bg,
  CATS.legume.bg,
  CATS.whole_grain.bg,
  CATS.ferment.bg,
]

const AVATAR_IMAGES = [
  'Amara', 'Anton', 'Camila', 'Diego', 'Elena', 'Erik', 'Freya',
  'Hiroshi', 'Isabella', 'Jamal', 'Kai', 'Liam', 'Marcus',
  'Ngozi', 'Priya', 'Rashid', 'Sophia', 'Tobias', 'Yuki', 'Zara',
]

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[24px] ${className ?? ''}`} />
}

export default function AvatarPage() {
  const router = useRouter()
  const t = useTranslations('avatar')
  const tA = useTranslations('account')
  const locale = useLocale()

  const { data, isLoading, mutate } = useSWR(['account', locale], fetchAccount, { keepPreviousData: true })

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedBg, setSelectedBg] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    if (!data) return
    setSelectedImage(data.customAvatarImage ?? null)
    setSelectedBg(data.avatarBg ?? null)
  }, [data])

  if (isLoading || !data) {
    return (
      <div className="px-5 pt-6 pb-8 space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-32" />
        <Skeleton className="h-16" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  const { userId, username, name, activeBorder } = data
  const displayName = username ?? name ?? '?'

  const previewImageUrl = selectedImage
    ? `/images/avatars/${selectedImage}.png`
    : data.avatar

  async function save() {
    if (!selectedImage) return
    setStatus('saving')
    await createClient()
      .from('user_settings')
      .update({
        custom_avatar_image: selectedImage,
        custom_avatar_bg: selectedBg,
        avatar_url: `/images/avatars/${selectedImage}.png`,
      })
      .eq('user_id', userId)
    await mutate()
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 1500)
  }

  async function reset() {
    const { data: { user } } = await createClient().auth.getUser()
    const googleAvatar = user?.user_metadata?.avatar_url ?? null
    await createClient()
      .from('user_settings')
      .update({ custom_avatar_image: null, custom_avatar_bg: null, avatar_url: googleAvatar })
      .eq('user_id', userId)
    setSelectedImage(null)
    setSelectedBg(null)
    await mutate()
  }

  const hasCustomAvatar = !!data.customAvatarImage
  const canSave = !!selectedImage && status === 'idle'

  return (
    <div className="px-5 pt-6 pb-8 space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1F1B16] -ml-1"
      >
        <ChevronLeft size={20} />
        {tA('settingsSection')}
      </button>

      {/* Preview */}
      <div
        className="rounded-[24px] bg-white p-6 flex flex-col items-center gap-3"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <Avatar
          username={displayName}
          imageUrl={previewImageUrl}
          size="lg"
          border={activeBorder}
          bgColor={selectedBg ?? undefined}
        />
        <p className="text-[13px] text-[#A39B91]">{t('title')}</p>
      </div>

      {/* Background color */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
          {t('bgSection')}
        </p>
        <div
          className="rounded-[24px] bg-white p-5"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            {BG_OPTIONS.map((color) => {
              const isSelected = selectedBg === color
              return (
                <button
                  key={color}
                  onClick={() => setSelectedBg(color)}
                  className="relative w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: color }}
                  aria-label={color}
                >
                  {isSelected && (
                    <Check size={16} className="text-[#1F1B16]" strokeWidth={2.5} />
                  )}
                </button>
              )
            })}
            {/* No color / transparent option */}
            <button
              onClick={() => setSelectedBg(null)}
              className="relative w-10 h-10 rounded-full border-2 border-dashed border-[#D1C9C0] flex items-center justify-center shrink-0"
              aria-label="No background"
            >
              {selectedBg === null && (
                <Check size={16} className="text-[#A39B91]" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar images */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
          {t('imageSection')}
        </p>
        <div
          className="rounded-[24px] bg-white p-4"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_IMAGES.map((name) => {
              const isSelected = selectedImage === name
              return (
                <button
                  key={name}
                  onClick={() => setSelectedImage(name)}
                  className={`relative rounded-[16px] aspect-square overflow-hidden flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-[#1F1B16]' : ''
                  }`}
                  style={{ background: selectedBg ?? '#F4EFE8' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/avatars/${name}.png`}
                    alt={name}
                    className="w-full h-full object-contain"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#1F1B16] flex items-center justify-center">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={save}
        disabled={!canSave}
        className="w-full py-4 rounded-[18px] text-[15px] font-bold text-[#1F1B16] transition-opacity disabled:opacity-40"
        style={{ background: '#F5C518' }}
      >
        {status === 'saved' ? t('saved') : status === 'saving' ? '…' : t('save')}
      </button>

      {/* Reset */}
      {hasCustomAvatar && (
        <button
          onClick={reset}
          className="w-full text-center text-[14px] text-[#A39B91] py-2"
        >
          {t('reset')}
        </button>
      )}
    </div>
  )
}
