'use client'

import { useState } from 'react'
import { BORDER_IMAGES } from '@/lib/achievements'

type Size = 'sm' | 'md' | 'lg'

// Outer wrapper — always the bordered size so layout never shifts when border toggles
const OUTER: Record<Size, string> = {
  sm: 'size-10',      // 40px
  md: 'size-11',      // 44px
  lg: 'size-[88px]',  // 88px
}

// Inner avatar circle
const INNER: Record<Size, { cls: string; text: string }> = {
  sm: { cls: 'size-9',  text: 'text-[14px]' },
  md: { cls: 'size-10', text: 'text-[15px]' },
  lg: { cls: 'size-20', text: 'text-3xl'    },
}

type Props = {
  username: string
  imageUrl?: string | null
  size?: Size
  border?: string
  bgColor?: string
  className?: string
}

export function Avatar({ username, imageUrl, size = 'md', border = 'default', bgColor, className = '' }: Props) {
  const [imgError, setImgError] = useState(false)
  const { cls, text } = INNER[size]
  const borderImageUrl = border !== 'default' ? BORDER_IMAGES[border] : undefined
  const showImage = imageUrl && !imgError

  return (
    <div className={`relative ${OUTER[size]} shrink-0 flex items-center justify-center ${className}`}>
      {borderImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={borderImageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ zIndex: 1 }}
        />
      )}
      <div
        className={`${cls} rounded-full overflow-hidden flex items-center justify-center ${!showImage && !bgColor ? 'bg-[#F5C518]' : ''}`}
        style={bgColor ? { background: bgColor } : undefined}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={username}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={`${text} font-bold text-[#1F1B16]`}>
            {username[0]?.toUpperCase() ?? '?'}
          </span>
        )}
      </div>
    </div>
  )
}
