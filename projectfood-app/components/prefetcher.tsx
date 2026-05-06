'use client'

import { useEffect } from 'react'
import { preload } from 'swr'
import { useLocale } from 'next-intl'
import { fetchHome, fetchStats, fetchAccount, fetchLeaderboard, fetchAdvice } from '@/lib/fetchers'

export function Prefetcher() {
  const locale = useLocale()

  useEffect(() => {
    preload(['home', locale] as [string, string], fetchHome)
    preload('stats', fetchStats)
    preload(['account', locale] as [string, string], fetchAccount)
    preload('leaderboard', fetchLeaderboard)
    preload('advice-all', fetchAdvice)
  }, [locale])

  return null
}
