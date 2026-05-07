export type UserStats = {
  totalUniquePlants: number
  longestStreakDays: number
  challengesCompleted: number
}

export type Achievement = {
  id: string
  label: string
  description: string
  icon: string
  image?: string       // optional generated image URL — slot in when ready
  borderColor?: string // badge background tint + border ring color
  border?: string      // border ID unlocked by this achievement
  check: (stats: UserStats) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_plant',
    label: 'First plant',
    description: 'Logged your very first plant',
    icon: '🌱',
    check: s => s.totalUniquePlants >= 1,
  },
  {
    id: 'plants_30',
    label: '30 plants',
    description: 'Ate 30 unique plants all time',
    icon: '🥗',
    borderColor: '#4CAF50',
    border: 'green',
    check: s => s.totalUniquePlants >= 30,
  },
  {
    id: 'plants_100',
    label: '100 plants',
    description: 'Ate 100 unique plants all time',
    icon: '🌿',
    borderColor: '#F5C518',
    border: 'gold',
    check: s => s.totalUniquePlants >= 100,
  },
  {
    id: 'plants_500',
    label: '500 plants',
    description: 'Ate 500 unique plants all time',
    icon: '🌳',
    borderColor: '#94A3B8',
    border: 'diamond',
    check: s => s.totalUniquePlants >= 500,
  },
  {
    id: 'streak_4w',
    label: '4-week streak',
    description: 'Logged plants for 28 consecutive days',
    icon: '🔥',
    check: s => s.longestStreakDays >= 28,
  },
  {
    id: 'streak_10w',
    label: '10-week streak',
    description: 'Logged plants for 70 consecutive days',
    icon: '⚡',
    borderColor: '#FF6B35',
    border: 'flame',
    check: s => s.longestStreakDays >= 70,
  },
]

// CSS color per border ID — used for avatar ring and badge background tint
export const BORDER_COLORS: Record<string, string> = {
  green:   '#4CAF50',
  gold:    '#F5C518',
  flame:   '#FF6B35',
  diamond: '#94A3B8',
}

export function getUnlockedBorders(stats: UserStats): string[] {
  return ACHIEVEMENTS
    .filter(a => a.border && a.check(stats))
    .map(a => a.border!)
}
