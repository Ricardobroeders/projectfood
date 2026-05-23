'use client'

import { useState, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { X, ChevronDown, ChevronUp, Clock, Users, Loader2, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CATS, type Category } from '@/lib/cats'
import type { Recipe, RecipeBatch } from '@/lib/fetchers'

// ─── Stub fallback recipes ────────────────────────────────────────────────────

const STUB_RECIPES: Recipe[] = [
  {
    title: 'Chickpea & Kale Bowl',
    time_minutes: 25,
    serves: 2,
    gut_note: 'Chickpeas are rich in prebiotic fiber that feeds beneficial gut bacteria and supports microbiome diversity.',
    ingredients: [
      { name: 'Chickpeas', amount: '1 can (400g)', category: 'legume', need_to_buy: true },
      { name: 'Kale', amount: '2 large handfuls', category: 'vegetable', need_to_buy: false },
      { name: 'Cherry tomato', amount: '150g', category: 'vegetable', need_to_buy: false },
      { name: 'Garlic', amount: '2 cloves', category: 'vegetable', need_to_buy: true },
      { name: 'Lemon', amount: '½', category: 'fruit', need_to_buy: true },
      { name: 'Olive oil', amount: '2 tbsp', category: null, need_to_buy: false },
    ],
    steps: [
      'Drain and rinse a tin of chickpeas. Pat them dry with kitchen paper — this helps them crisp up.',
      'Heat 2 tbsp olive oil in a wide pan over medium-high heat.',
      'Add chickpeas in a single layer. Cook 8–10 min, shaking occasionally, until golden and crispy.',
      'While the chickpeas cook, finely slice the kale and halve the cherry tomatoes.',
      'Push chickpeas to one side. Add minced garlic to the pan and cook 1 minute until fragrant.',
      'Add kale and tomatoes, stir everything together. Cook 3 min until the kale just wilts.',
      'Squeeze half a lemon over everything. Season generously with salt and pepper.',
      'Serve warm — great with brown rice, farro, or just as it is.',
    ],
  },
  {
    title: 'Oat & Berry Breakfast Bowl',
    time_minutes: 10,
    serves: 1,
    gut_note: 'Oats contain beta-glucan, a soluble fiber shown to increase microbiome diversity. Blueberries add polyphenols that act as fuel for beneficial bacteria.',
    ingredients: [
      { name: 'Oats', amount: '80g', category: 'whole_grain', need_to_buy: true },
      { name: 'Blueberries', amount: 'handful', category: 'fruit', need_to_buy: true },
      { name: 'Banana', amount: '½', category: 'fruit', need_to_buy: false },
      { name: 'Chia seeds', amount: '1 tbsp', category: 'nut_seed', need_to_buy: true },
      { name: 'Almond milk', amount: '250ml', category: null, need_to_buy: false },
      { name: 'Honey', amount: '1 tsp', category: null, need_to_buy: false },
    ],
    steps: [
      'Add 80g oats to a small saucepan with 250ml almond milk.',
      'Cook over medium heat, stirring regularly, for 4–5 min until creamy and thick.',
      'Stir in 1 tbsp chia seeds and remove from heat — they thicken as they sit.',
      'Pour into a bowl. Slice half a banana over the top.',
      'Add a handful of blueberries.',
      'Finish with a small drizzle of honey and a pinch of cinnamon if you have it.',
    ],
  },
  {
    title: 'Basil & Tomato Pasta',
    time_minutes: 20,
    serves: 2,
    gut_note: 'Fresh basil contains polyphenols and essential oils that act as prebiotics, helping beneficial gut bacteria thrive alongside the fiber from whole-grain pasta.',
    ingredients: [
      { name: 'Basil', amount: 'large handful', category: 'herb', need_to_buy: true },
      { name: 'Cherry tomato', amount: '200g', category: 'vegetable', need_to_buy: false },
      { name: 'Garlic', amount: '2 cloves', category: 'vegetable', need_to_buy: true },
      { name: 'Pasta', amount: '160g', category: null, need_to_buy: false },
      { name: 'Olive oil', amount: '3 tbsp', category: null, need_to_buy: false },
      { name: 'Parmesan', amount: '30g', category: null, need_to_buy: false },
    ],
    steps: [
      'Bring a large pot of well-salted water to a boil. Cook pasta according to package directions.',
      'Halve the cherry tomatoes. Finely mince 2 cloves of garlic.',
      "Heat 3 tbsp olive oil in a wide pan over medium heat. Add garlic, cook 1 min until fragrant — don't let it brown.",
      'Add tomatoes and season generously. Cook 7–8 min until they soften and release their juice.',
      'Before draining the pasta, scoop out a full mug of pasta water and set aside.',
      'Add drained pasta to the pan. Toss well. Add pasta water a splash at a time until the sauce coats the pasta.',
      'Remove from heat. Tear in a large handful of fresh basil and stir gently.',
      'Plate and finish with grated parmesan and a drizzle of your best olive oil.',
    ],
  },
]

const STUB_OLDER_RECIPES: Recipe[] = [
  {
    title: 'Garlic & Spinach Stir-fry',
    time_minutes: 12,
    serves: 2,
    gut_note: 'Spinach contains folate and magnesium that support beneficial gut bacteria growth.',
    ingredients: [
      { name: 'Spinach', amount: '200g', category: 'vegetable', need_to_buy: false },
      { name: 'Garlic', amount: '3 cloves', category: 'vegetable', need_to_buy: false },
      { name: 'Soy sauce', amount: '1 tbsp', category: null, need_to_buy: false },
      { name: 'Sesame oil', amount: '1 tbsp', category: null, need_to_buy: false },
    ],
    steps: [
      'Heat sesame oil in a wok or wide pan over high heat.',
      'Add minced garlic, stir for 30 seconds until fragrant.',
      'Add spinach in batches, tossing quickly between each addition.',
      'Splash in soy sauce and cook 1 more minute.',
      'Serve immediately as a side or over rice.',
    ],
  },
  {
    title: 'Walnut & Banana Oat Bars',
    time_minutes: 30,
    serves: 8,
    gut_note: 'Walnuts are rich in polyphenols linked to increased gut bacteria diversity.',
    ingredients: [
      { name: 'Oats', amount: '200g', category: 'whole_grain', need_to_buy: false },
      { name: 'Banana', amount: '2 ripe', category: 'fruit', need_to_buy: false },
      { name: 'Walnuts', amount: '60g', category: 'nut_seed', need_to_buy: false },
      { name: 'Honey', amount: '2 tbsp', category: null, need_to_buy: false },
    ],
    steps: [
      'Preheat oven to 180°C. Line a small baking tin with paper.',
      'Mash 2 ripe bananas in a bowl until smooth.',
      'Stir in 200g oats, roughly chopped walnuts, and 2 tbsp honey.',
      'Press into the tin in an even layer.',
      'Bake 20–25 min until the top is golden.',
      'Cool completely before slicing into bars.',
    ],
  },
]

// ─── Full-page sheet ──────────────────────────────────────────────────────────

interface Props {
  batches: RecipeBatch[]
  generating?: boolean
  onClose: () => void
}

export function RecipesSheet({ batches, generating, onClose }: Props) {
  const t = useTranslations('groceryFlow')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [expandedOld, setExpandedOld] = useState<number | null>(null)
  const [show, setShow] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const prevGeneratingRef = useRef(generating)

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(id)
  }, [])

  // When generating ends and we have batches, trigger slide-in animation
  useEffect(() => {
    if (prevGeneratingRef.current && !generating && batches.length > 0) {
      setAnimateIn(true)
      const timer = setTimeout(() => setAnimateIn(false), 600)
      prevGeneratingRef.current = generating
      return () => clearTimeout(timer)
    }
    prevGeneratingRef.current = generating
  }, [generating, batches.length])

  const animStyle: CSSProperties = {
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(48px)',
    transition: show
      ? 'opacity 260ms ease-out, transform 260ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'opacity 200ms ease-in, transform 200ms ease-in',
  }

  function handleClose() {
    setShow(false)
    setTimeout(onClose, 220)
  }

  // Derive current and older recipes from batches
  const currentRecipes: Recipe[] = batches.length > 0 ? batches[0].recipes : STUB_RECIPES
  const olderRecipes: Recipe[] = batches.length > 1
    ? batches.slice(1).flatMap(b => b.recipes)
    : (batches.length === 0 ? STUB_OLDER_RECIPES : [])

  const recipeCount = currentRecipes.length

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#F4EFE8', ...animStyle }}>
      {/* Header */}
      <div
        className="shrink-0 h-14 bg-white flex items-center px-4 gap-2"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <div className="w-8" />
        <p className="flex-1 text-center text-[15px] font-bold text-[#1F1B16]">{t('recipesHeader')}</p>
        <button
          className="w-8 h-8 grid place-items-center text-[#A39B91]"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Recipes list */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
        {/* Subheader — inside scroll so it never overlaps cards */}
        <p className="text-[13px] text-[#6B645C] leading-relaxed pt-3 pb-2">
          {t('recipesSub', { count: recipeCount })}
        </p>

        {/* Generating new batch banner — fades out smoothly when done */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: generating ? '64px' : '0px',
            opacity: generating ? 1 : 0,
            marginBottom: generating ? '4px' : '-12px',
            transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out, margin-bottom 0.4s ease-out',
          }}
        >
          <div
            className="rounded-[16px] px-4 py-3 flex items-center gap-3"
            style={{ background: '#DDEACB' }}
          >
            <Loader2 size={16} className="animate-spin shrink-0" style={{ color: '#4F7A3D' }} />
            <p className="text-[13px] font-medium" style={{ color: '#2D4A22' }}>
              {t('recipesGenerating')}
            </p>
          </div>
        </div>

        {/* Current recipes — semi-transparent while generating, slide in when done */}
        <div
          style={{
            opacity: generating ? 0.45 : 1,
            transition: 'opacity 0.4s ease-out',
            animation: animateIn ? 'pfRecipesIn 0.5s ease-out' : undefined,
          }}
        >
          {currentRecipes.map((recipe, i) => (
            <div key={i} className={i > 0 ? 'mt-3' : ''}>
              <RecipeCard
                recipe={recipe}
                index={i}
                isOpen={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
                t={t}
              />
            </div>
          ))}
        </div>

        {/* Earlier recipes */}
        {olderRecipes.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-[#D8D0C8]" />
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91]">
                {t('recipesEarlier')}
              </p>
              <div className="flex-1 h-px bg-[#D8D0C8]" />
            </div>
            <div
              className="space-y-2"
              style={{ opacity: generating ? 0.25 : 0.5, transition: 'opacity 0.4s ease-out' }}
            >
              {olderRecipes.map((recipe, i) => (
                <RecipeCard
                  key={i}
                  recipe={recipe}
                  index={i}
                  isOpen={expandedOld === i}
                  onToggle={() => setExpandedOld(expandedOld === i ? null : i)}
                  t={t}
                />
              ))}
            </div>
          </div>
        )}

        <style>{`
          @keyframes pfRecipesIn {
            from { transform: translateY(10px); }
            to   { transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  )
}

// ─── Recipe card ──────────────────────────────────────────────────────────────

function RecipeCard({
  recipe,
  index,
  isOpen,
  onToggle,
  t,
}: {
  recipe: Recipe
  index: number
  isOpen: boolean
  onToggle: () => void
  t: ReturnType<typeof useTranslations<'groceryFlow'>>
}) {
  const [copied, setCopied] = useState(false)
  const newPlants = recipe.ingredients.filter(i => i.need_to_buy && i.category !== null).length

  function handleShare() {
    const ingredientLines = recipe.ingredients.map(i => `• ${i.name}`).join('\n')
    const stepLines = recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
    const text = [
      recipe.title,
      `⏱ ${recipe.time_minutes} min · ${recipe.serves} servings`,
      '',
      'Ingredients:',
      ingredientLines,
      '',
      'How to make it:',
      stepLines,
      '',
      `${recipe.gut_note}`,
      '',
      t('shareFooter'),
    ].join('\n')

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: recipe.title, text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="rounded-[20px] overflow-hidden bg-white">
      {/* Collapsed header */}
      <button
        className="w-full flex items-start gap-3 p-4 text-left active:opacity-80 transition-opacity"
        onClick={onToggle}
      >
        <span
          className="shrink-0 w-7 h-7 rounded-full text-[13px] font-bold grid place-items-center mt-0.5"
          style={{ background: '#DDEACB', color: '#4F7A3D' }}
        >
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-extrabold text-[#1F1B16] leading-tight">{recipe.title}</p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[12px] text-[#6B645C]">
              <Clock size={11} />
              {recipe.time_minutes} min
            </span>
            <span className="flex items-center gap-1 text-[12px] text-[#6B645C]">
              <Users size={11} />
              {recipe.serves} servings
            </span>
            {newPlants > 0 && (
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#DDEACB', color: '#4F7A3D' }}
              >
                {t('newPlant', { n: newPlants })}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 text-[#A39B91] mt-1">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded */}
      {isOpen && (
        <div className="px-4 pb-5 space-y-5 border-t border-[#F4EFE8]">
          {/* Ingredients */}
          <div className="pt-4">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-2.5">
              {t('ingredients')}
            </p>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, i) => {
                if (!ing.need_to_buy && ing.category) {
                  const c = CATS[ing.category as Category]
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-[13px] font-medium"
                      style={{ background: c.bg, color: c.fg }}
                    >
                      {ing.amount && <span className="font-normal opacity-70">{ing.amount}</span>} {ing.name}
                    </span>
                  )
                }
                const isNewPlant = ing.need_to_buy && ing.category !== null
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-[13px] font-medium"
                    style={{
                      background: isNewPlant ? '#FBEDB5' : '#F4EFE8',
                      color: isNewPlant ? '#7A5C00' : '#6B645C',
                    }}
                  >
                    {ing.amount && <span className="font-normal opacity-70">{ing.amount}</span>} {ing.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-3">
              {t('steps')}
            </p>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full text-[12px] font-bold text-[#6B645C] grid place-items-center"
                    style={{ background: '#F4EFE8' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[14px] text-[#1F1B16] leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Gut note */}
          <div
            className="rounded-[14px] px-4 py-3 flex gap-3 items-start"
            style={{ background: '#DDEACB' }}
          >
            <p className="text-[13px] leading-relaxed" style={{ color: '#2D4A22' }}>
              {recipe.gut_note}
            </p>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full h-10 rounded-full flex items-center justify-center gap-2 text-[13px] font-medium border transition-colors"
            style={{
              borderColor: '#D8D0C8',
              color: copied ? '#4F7A3D' : '#6B645C',
              background: copied ? '#DDEACB' : 'transparent',
            }}
          >
            <Share2 size={14} />
            {copied ? t('recipeCopied') : t('shareRecipe')}
          </button>
        </div>
      )}
    </div>
  )
}
