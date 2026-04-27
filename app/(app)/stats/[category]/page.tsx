export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CATS, CAT_ORDER, type Category } from '@/lib/cats'

type Plant = { id: string; name: string }

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: raw } = await params
  const category = raw as Category
  if (!CAT_ORDER.includes(category)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: plants }, { data: logs }] = await Promise.all([
    supabase
      .from('plants')
      .select('id, name')
      .eq('category', category)
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('plant_logs')
      .select('plant_id')
      .eq('user_id', user!.id),
  ])

  const triedSet = new Set((logs ?? []).map((r) => r.plant_id))
  const allPlants = (plants ?? []) as Plant[]
  const tried = allPlants.filter((p) => triedSet.has(p.id))
  const untried = allPlants.filter((p) => !triedSet.has(p.id))
  const c = CATS[category]

  return (
    <div className="px-5 pt-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/stats"
          className="w-10 h-10 rounded-full bg-white grid place-items-center shrink-0"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.06)' }}
        >
          <ArrowLeft size={18} className="text-[#1F1B16]" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{c.emoji}</span>
          <h1 className="text-xl font-extrabold text-[#1F1B16]">{c.label}</h1>
        </div>
        <span className="ml-auto text-sm font-mono text-[#A39B91]">
          {tried.length}<span className="text-[#F4EFE8]">/</span>{allPlants.length}
        </span>
      </div>

      {/* Tried */}
      {tried.length > 0 && (
        <div className="mb-5">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
            Tried
          </p>
          <div className="space-y-2">
            {tried.map((plant) => (
              <div
                key={plant.id}
                className="flex items-center gap-4 px-4 py-3 rounded-[18px]"
                style={{ background: 'rgb(224 215 203)' }}
              >
                <div
                  className="w-11 h-11 rounded-2xl grid place-items-center text-lg shrink-0"
                  style={{ background: c.bg }}
                >
                  {c.emoji}
                </div>
                <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{plant.name}</p>
                <div className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-[#F5C518]">
                  <Check size={16} strokeWidth={2.5} className="text-[#1F1B16]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not yet tried */}
      {untried.length > 0 && (
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3 px-1">
            Not yet tried
          </p>
          <div className="space-y-2">
            {untried.map((plant) => (
              <div
                key={plant.id}
                className="flex items-center gap-4 px-4 py-3 rounded-[18px] bg-white"
                style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
              >
                <div
                  className="w-11 h-11 rounded-2xl grid place-items-center text-lg shrink-0"
                  style={{ background: c.bg }}
                >
                  {c.emoji}
                </div>
                <p className="flex-1 text-[15px] font-medium text-[#1F1B16] truncate">{plant.name}</p>
                <div className="w-10 h-10 rounded-full grid place-items-center shrink-0 bg-[#F4EFE8]">
                  <Check size={16} strokeWidth={2.5} className="text-[#A39B91]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
