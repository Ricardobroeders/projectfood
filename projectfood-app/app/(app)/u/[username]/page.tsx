'use client'

import { use } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { fetchUserProfile } from '@/lib/fetchers'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#F4EFE8] rounded-[18px] ${className ?? ''}`} />
}

function StatCard({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="flex-1 rounded-[18px] bg-white p-4 text-center" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
      <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-[#1F1B16] leading-none">{value}</p>
      {unit && <p className="text-[11px] text-[#A39B91] mt-0.5">{unit}</p>}
    </div>
  )
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params)
  const t = useTranslations('profile')

  const { data, isLoading } = useSWR(['profile', username], () => fetchUserProfile(username))

  return (
    <div className="px-5 pt-4 pb-8 space-y-5">
      {/* Back */}
      <Link href="/home" className="inline-flex items-center gap-1.5 text-[13px] text-[#A39B91]">
        <ArrowLeft className="size-4" />
        {t('back')}
      </Link>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-24" />
            <Skeleton className="flex-1 h-24" />
            <Skeleton className="flex-1 h-24" />
          </div>
        </div>
      )}

      {!isLoading && !data && (
        <div className="text-center py-16 text-[#A39B91]">
          <div className="text-3xl mb-2">👤</div>
          <p className="text-sm">{t('notFound')}</p>
        </div>
      )}

      {!isLoading && data && (
        <>
          {/* Avatar + username */}
          <div className="flex flex-col items-center py-4">
            <div className="size-20 rounded-full bg-[#F5C518] flex items-center justify-center mb-3">
              <span className="text-3xl font-extrabold text-[#1F1B16]">
                {data.username[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#1F1B16]">{data.username}</h2>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <StatCard label={t('totalPlants')} value={data.total_plants} />
            <StatCard label={t('thisWeek')} value={data.week_count} unit="/30" />
            <StatCard label={t('streak')} value={data.streak} unit={t('days')} />
          </div>

          {/* Week progress bar */}
          <div className="rounded-[18px] bg-white p-4" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-semibold text-[#1F1B16]">{t('weekProgress')}</p>
              <p className="text-[13px] font-mono text-[#A39B91]">{data.week_count}/30</p>
            </div>
            <div className="h-2.5 rounded-full bg-[#F4EFE8] overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-[#F5C518] transition-all"
                style={{ width: `${Math.min(100, (data.week_count / 30) * 100)}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
