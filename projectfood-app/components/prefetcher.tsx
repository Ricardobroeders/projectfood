'use client'

import { useEffect } from 'react'
import { preload } from 'swr'
import { useLocale } from 'next-intl'
import { fetchHome, fetchStats } from '@/lib/fetchers'

export function Prefetcher() {
  const locale = useLocale()

  useEffect(() => {
    preload(['home', locale] as [string, string], fetchHome)
    preload('stats', fetchStats)
  }, [locale])

  return null
}
