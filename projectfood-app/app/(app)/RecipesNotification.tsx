'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, Utensils } from 'lucide-react'
import useSWR from 'swr'
import { fetchRecipeState, type RecipeBatch } from '@/lib/fetchers'
import { RecipesSheet } from './home/RecipesSheet'

export function RecipesNotification() {
  const [generating, setGenerating] = useState(false)
  const [viewed, setViewed] = useState(false)
  const [open, setOpen] = useState(false)

  const { data: batches } = useSWR('recipe_state', fetchRecipeState)

  // Track batch count at the moment generation started, so we only clear
  // the spinner when a genuinely NEW batch arrives (not from pre-existing ones).
  const batchesRef = useRef<RecipeBatch[]>([])
  batchesRef.current = batches ?? []
  const batchCountOnStart = useRef<number>(0)

  useEffect(() => {
    const onGenerating = () => {
      batchCountOnStart.current = batchesRef.current.length
      setGenerating(true)
    }
    window.addEventListener('pf:recipes-generating', onGenerating)
    return () => window.removeEventListener('pf:recipes-generating', onGenerating)
  }, [])

  // Clear generating only when batch count increases past what it was when we started
  useEffect(() => {
    if (generating && (batches?.length ?? 0) > batchCountOnStart.current) {
      setGenerating(false)
      setViewed(false)
    }
  }, [batches?.length, generating])

  // Immediate signal from ShoppingFlowSheet when POST completes
  useEffect(() => {
    const onReady = () => setGenerating(false)
    window.addEventListener('pf:recipes-ready', onReady)
    return () => window.removeEventListener('pf:recipes-ready', onReady)
  }, [])

  const hasBatches = (batches?.length ?? 0) > 0

  if (!generating && !hasBatches) return null

  if (generating && !hasBatches) {
    return (
      <div className="w-8 h-8 grid place-items-center text-[#A39B91]">
        <Loader2 size={18} className="animate-spin" />
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-8 h-8 grid place-items-center text-[#A39B91] hover:text-[#1F1B16] transition-colors"
        aria-label="View your recipes"
      >
        <Utensils size={18} />
        {!viewed && !open && (
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: '#4F7A3D' }}
          />
        )}
      </button>

      {open && (
        <RecipesSheet
          batches={batches ?? []}
          generating={generating}
          onClose={() => {
            setOpen(false)
            setViewed(true)
          }}
        />
      )}
    </>
  )
}
