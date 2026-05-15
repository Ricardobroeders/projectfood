'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { Search, Check, X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks'
import { createClient } from '@/lib/supabase/client'
import { searchUsers, fetchPendingRequests, fetchSocialFriends } from '@/lib/fetchers'
import Link from 'next/link'
import { Avatar } from '@/components/avatar'

type SearchResult = { user_id: string; username: string; total_plants: number; avatar_url?: string | null; avatar_bg?: string | null }
type PendingRequest = { id: string; type: 'incoming' | 'outgoing'; other_user_id: string; username: string; avatar_url?: string | null; active_border?: string | null; avatar_bg?: string | null }
type FriendStats = { user_id: string; username: string; week_count: number; day_streak: number; avatar_url?: string | null; active_border?: string | null; avatar_bg?: string | null }

type Tab = 'friends' | 'find'

export default function SocialPage() {
  const t = useTranslations('social')
  const [tab, setTab] = useState<Tab>('friends')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query.trim(), 350)
  const [busy, setBusy] = useState<Set<string>>(new Set())
  const [requested, setRequested] = useState<Set<string>>(new Set())

  const { data: pending, mutate: mutatePending } = useSWR('pending_requests', fetchPendingRequests)
  const { data: friends, mutate: mutateFriends } = useSWR('social_friends', fetchSocialFriends)
  const { data: results, isLoading: searching } = useSWR(
    debouncedQuery.length >= 2 ? ['search_users', debouncedQuery] : null,
    ([, q]: [string, string]) => searchUsers(q),
    { keepPreviousData: false }
  )

  const refresh = () => { mutatePending(); mutateFriends() }

  const act = async (key: string, fn: () => Promise<void>) => {
    setBusy(s => new Set(s).add(key))
    try { await fn() } finally {
      setBusy(s => { const n = new Set(s); n.delete(key); return n })
      refresh()
    }
  }

  const sendRequest = (addresseeId: string) =>
    act(addresseeId, async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('friendships').insert({ requester: user.id, addressee: addresseeId, status: 'pending' })
      setRequested(s => new Set(s).add(addresseeId))
    })

  const acceptRequest = (id: string) =>
    act(id, async () => {
      await createClient().from('friendships').update({ status: 'accepted' }).eq('id', id)
    })

  const removeRequest = (id: string) =>
    act(id, async () => {
      await createClient().from('friendships').delete().eq('id', id)
    })

  const incoming = (pending ?? []).filter((r: PendingRequest) => r.type === 'incoming')
  const outgoing = (pending ?? []).filter((r: PendingRequest) => r.type === 'outgoing')
  const hasPending = incoming.length > 0 || outgoing.length > 0
  const incomingCount = incoming.length

  const tabs: { key: Tab; label: string }[] = [
    { key: 'friends', label: t('tabFriends') },
    { key: 'find',    label: t('tabFind')    },
  ]

  return (
    <div className="px-5 pt-4 pb-8 space-y-5">
      {/* Header + tabs */}
      <h2 className="text-xl font-extrabold text-[#1F1B16]">{t('title')}</h2>

      <div className="flex gap-2 bg-[var(--color-selected)] rounded-full p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="relative flex-1 h-9 rounded-full text-[13px] font-semibold transition-colors"
            style={tab === key
              ? { background: '#F5C518', color: '#1F1B16' }
              : { background: 'transparent', color: '#A39B91' }}
          >
            {label}
            {key === 'friends' && incomingCount > 0 && (
              <span className="absolute top-1 right-2 size-4 rounded-full bg-[#1F1B16] text-white text-[10px] font-bold flex items-center justify-center">
                {incomingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Friends tab */}
      {tab === 'friends' && (
        <div className="space-y-5">
          {/* Pending requests */}
          {hasPending && (
            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-[#6B645C] uppercase tracking-wider">{t('requests')}</p>

              {incoming.map((r: PendingRequest) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3"
                  style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
                >
                  <Avatar username={r.username} imageUrl={r.avatar_url} border={r.active_border ?? 'default'} bgColor={r.avatar_bg ?? undefined} />
                  <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{r.username}</p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => acceptRequest(r.id)}
                      disabled={busy.has(r.id)}
                      className="size-8 rounded-xl bg-[#F5C518] flex items-center justify-center disabled:opacity-40"
                    >
                      <Check className="size-4 text-[#1F1B16]" />
                    </button>
                    <button
                      onClick={() => removeRequest(r.id)}
                      disabled={busy.has(r.id)}
                      className="size-8 rounded-xl bg-[#F4EFE8] flex items-center justify-center disabled:opacity-40"
                    >
                      <X className="size-4 text-[#6B645C]" />
                    </button>
                  </div>
                </div>
              ))}

              {outgoing.map((r: PendingRequest) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3 opacity-70"
                  style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
                >
                  <Avatar username={r.username} imageUrl={r.avatar_url} border={r.active_border ?? 'default'} bgColor={r.avatar_bg ?? undefined} />
                  <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{r.username}</p>
                  <button
                    onClick={() => removeRequest(r.id)}
                    disabled={busy.has(r.id)}
                    className="h-8 px-4 rounded-xl text-[13px] font-semibold bg-[#F4EFE8] text-[#6B645C] disabled:opacity-40 shrink-0"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Friends list */}
          <div className="space-y-2">
            {hasPending && <p className="text-[13px] font-semibold text-[#6B645C] uppercase tracking-wider">{t('friends')}</p>}

            {(friends ?? []).length === 0 ? (
              <div className="text-center py-10 text-[#A39B91]">
                <div className="text-3xl mb-2">👋</div>
                <p className="text-sm">{t('emptyFriends')}</p>
                <button
                  onClick={() => setTab('find')}
                  className="mt-4 h-9 px-5 rounded-xl text-[13px] font-semibold bg-[#F5C518] text-[#1F1B16]"
                >
                  {t('tabFind')}
                </button>
              </div>
            ) : (
              (friends ?? []).map((f: FriendStats) => (
                <Link
                  key={f.user_id}
                  href={`/u/${f.username}`}
                  className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3"
                  style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
                >
                  <Avatar username={f.username} imageUrl={f.avatar_url} border={f.active_border ?? 'default'} bgColor={f.avatar_bg ?? undefined} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-[#1F1B16] truncate">{f.username}</p>
                    <p className="text-[12px] text-[#A39B91]">{f.week_count} {t('plantsThisWeek')}</p>
                  </div>
                  <span className="text-[13px] font-mono text-[#A39B91] shrink-0">
                    {f.day_streak}d
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Find tab */}
      {tab === 'find' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A39B91] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus
              className="w-full h-11 pl-9 pr-4 rounded-2xl bg-white text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] outline-none"
              style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.06)' }}
            />
          </div>

          {debouncedQuery.length < 2 && (
            <p className="text-sm text-[#A39B91] text-center py-6">{t('searchPrompt')}</p>
          )}
          {debouncedQuery.length >= 2 && searching && (
            <p className="text-sm text-[#A39B91] text-center py-6">{t('searching')}</p>
          )}
          {debouncedQuery.length >= 2 && !searching && results?.length === 0 && (
            <p className="text-sm text-[#A39B91] text-center py-6">{t('noResults')}</p>
          )}
          {debouncedQuery.length >= 2 && !searching && (results ?? []).map((r: SearchResult) => (
            <div
              key={r.user_id}
              className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3"
              style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
            >
              <Avatar username={r.username} imageUrl={r.avatar_url} bgColor={r.avatar_bg ?? undefined} />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-[#1F1B16] truncate">{r.username}</p>
                <p className="text-[12px] text-[#A39B91]">{r.total_plants} {t('totalPlants')}</p>
              </div>
              <button
                onClick={() => sendRequest(r.user_id)}
                disabled={busy.has(r.user_id) || requested.has(r.user_id)}
                className="h-8 px-4 rounded-xl text-[13px] font-semibold shrink-0 transition-colors disabled:opacity-60"
                style={requested.has(r.user_id)
                  ? { background: '#F4EFE8', color: '#A39B91' }
                  : { background: '#F5C518', color: '#1F1B16' }}
              >
                {requested.has(r.user_id) ? t('sent') : t('add')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
