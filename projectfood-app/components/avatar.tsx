import { BORDER_COLORS } from '@/lib/achievements'

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, { outer: string; text: string }> = {
  sm: { outer: 'size-9',  text: 'text-[14px]' },
  md: { outer: 'size-10', text: 'text-[15px]' },
  lg: { outer: 'size-20', text: 'text-3xl'    },
}

type Props = {
  username: string
  imageUrl?: string | null
  size?: Size
  border?: string
  className?: string
}

export function Avatar({ username, imageUrl, size = 'md', border = 'default', className = '' }: Props) {
  const { outer, text } = SIZES[size]
  const ringColor = border !== 'default' ? BORDER_COLORS[border] : undefined

  return (
    <div
      className={`${outer} rounded-full overflow-hidden flex items-center justify-center shrink-0 ${imageUrl ? '' : 'bg-[#F5C518]'} ${className}`}
      style={ringColor ? { outline: `3px solid ${ringColor}`, outlineOffset: '2px' } : undefined}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={username} className="w-full h-full object-cover" />
      ) : (
        <span className={`${text} font-bold text-[#1F1B16]`}>
          {username[0]?.toUpperCase() ?? '?'}
        </span>
      )}
    </div>
  )
}
