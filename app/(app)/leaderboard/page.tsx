export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'

type LeaderboardRow = {
  rank: number
  username: string
  unique_plants: number
  is_me: boolean
}

const MEDALS = ['🥇', '🥈', '🥉']

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const t = await getTranslations('leaderboard')
  const { data } = await supabase.rpc('leaderboard', { p_limit: 15 })
  const rows = (data as LeaderboardRow[]) ?? []

  return (
    <div className="px-5 pt-4 pb-8 space-y-4">
      <h2 className="text-xl font-extrabold text-[#1F1B16]">{t('title')}</h2>
      <p className="text-[13px] text-[#A39B91] -mt-2">{t('subtitle')}</p>

      <div className="space-y-2">
        {rows.map((row) => {
          const medal = MEDALS[row.rank - 1]
          return (
            <div
              key={row.rank}
              className="flex items-center gap-4 px-4 py-3 rounded-[18px]"
              style={{
                background: row.is_me ? '#FBEDB5' : '#FFFFFF',
                boxShadow: '0 2px 6px rgba(31,27,22,0.04)',
              }}
            >
              <div className="w-9 text-center shrink-0">
                {medal ? (
                  <span className="text-xl">{medal}</span>
                ) : (
                  <span className="text-[14px] font-mono text-[#A39B91]">{row.rank}</span>
                )}
              </div>
              <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">
                {row.username}
                {row.is_me && (
                  <span className="ml-2 text-[11px] font-mono uppercase tracking-widest text-[#A39B91]">
                    {t('you')}
                  </span>
                )}
              </p>
              <span className="font-mono text-[14px] text-[#1F1B16] shrink-0">
                {row.unique_plants}
                <span className="text-[#A39B91] text-[12px]"> {t('plants')}</span>
              </span>
            </div>
          )
        })}

        {rows.length === 0 && (
          <div className="text-center py-16 text-[#A39B91]">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm">{t('noEntries')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
