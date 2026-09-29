'use client'

import { useRef } from 'react'
import { type SurveyQuestion, type SurveyOption } from '@/lib/fetchers'

interface Props {
  question: SurveyQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
}

type OtherAnswer = { value: 'other'; text: string }
function isOtherAnswer(v: unknown): v is OtherAnswer {
  return typeof v === 'object' && v !== null && (v as any).value === 'other'
}

// Parses "1 = Very hard · 5 = Very easy" → { low: "Very hard", high: "Very easy" }
function parseScaleLabels(helpText: string | null): { low: string; high: string } | null {
  if (!helpText) return null
  const parts = helpText.split('·')
  if (parts.length < 2) return null
  const low = parts[0].replace(/^\s*\d+\s*=\s*/, '').trim()
  const high = parts[parts.length - 1].replace(/^\s*\d+\s*=\s*/, '').trim()
  return low && high ? { low, high } : null
}

export function QuestionField({ question, value, onChange, disabled }: Props) {
  const { type, options, key } = question
  const otherTextRef = useRef<HTMLTextAreaElement>(null)

  if (type === 'radio') {
    const selected = isOtherAnswer(value) ? 'other' : (value as string | undefined)
    const otherText = isOtherAnswer(value) ? value.text : ''

    return (
      <fieldset className="space-y-2">
        {(options ?? []).map((opt: SurveyOption) => (
          <div key={opt.value}>
            <label
              className={`flex items-center gap-3 rounded-[14px] px-4 py-3 cursor-pointer transition-colors ${
                selected === opt.value
                  ? 'bg-[#F5C518]/20 ring-1 ring-[#F5C518]'
                  : 'bg-[#F4EFE8]'
              }`}
            >
              <input
                type="radio"
                name={key}
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => {
                  if (opt.value === 'other') {
                    onChange({ value: 'other', text: '' })
                    setTimeout(() => otherTextRef.current?.focus(), 50)
                  } else {
                    onChange(opt.value)
                  }
                }}
                disabled={disabled}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  selected === opt.value ? 'border-[#F5C518]' : 'border-[#A39B91]'
                }`}
              >
                {selected === opt.value && (
                  <span className="w-2 h-2 rounded-full bg-[#F5C518]" />
                )}
              </span>
              <span className="text-[14px] text-[#1F1B16] leading-snug">{opt.label}</span>
            </label>
            {opt.value === 'other' && selected === 'other' && (
              <textarea
                ref={otherTextRef}
                defaultValue={otherText}
                onBlur={(e) => onChange({ value: 'other', text: e.target.value })}
                disabled={disabled}
                rows={2}
                className="mt-2 w-full rounded-[12px] bg-[#F4EFE8] px-4 py-3 text-[14px] text-[#1F1B16] placeholder-[#A39B91] outline-none focus:ring-1 focus:ring-[#F5C518] resize-none"
                placeholder="Describe…"
              />
            )}
          </div>
        ))}
      </fieldset>
    )
  }

  if (type === 'checkbox') {
    const selected = (value as string[] | undefined) ?? []
    const toggle = (v: string) => {
      const next = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]
      onChange(next)
    }
    return (
      <div className="space-y-2">
        {(options ?? []).map((opt: SurveyOption) => {
          const checked = selected.includes(opt.value)
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-3 rounded-[14px] px-4 py-3 cursor-pointer transition-colors ${
                checked ? 'bg-[#F5C518]/20 ring-1 ring-[#F5C518]' : 'bg-[#F4EFE8]'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt.value)}
                disabled={disabled}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-[4px] border-2 shrink-0 flex items-center justify-center ${
                  checked ? 'border-[#F5C518] bg-[#F5C518]' : 'border-[#A39B91]'
                }`}
              >
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#1F1B16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-[14px] text-[#1F1B16] leading-snug">{opt.label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  if (type === 'scale') {
    const selected = value as number | undefined
    const hasValue = selected != null
    const displayValue = hasValue ? selected : 3
    const pct = hasValue ? ((selected - 1) / 4) * 100 : 50
    const labels = parseScaleLabels(question.help_text)

    return (
      <div>
        <div className="py-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={displayValue}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className={[
              'w-full h-2 rounded-full appearance-none cursor-pointer outline-none',
              // webkit thumb
              '[&::-webkit-slider-thumb]:appearance-none',
              '[&::-webkit-slider-thumb]:w-6',
              '[&::-webkit-slider-thumb]:h-6',
              '[&::-webkit-slider-thumb]:rounded-full',
              '[&::-webkit-slider-thumb]:cursor-pointer',
              '[&::-webkit-slider-thumb]:transition-transform',
              '[&::-webkit-slider-thumb]:active:scale-110',
              hasValue
                ? '[&::-webkit-slider-thumb]:bg-[#F5C518] [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(31,27,22,0.25)]'
                : '[&::-webkit-slider-thumb]:bg-[#A39B91]',
              // moz thumb
              '[&::-moz-range-thumb]:w-6',
              '[&::-moz-range-thumb]:h-6',
              '[&::-moz-range-thumb]:rounded-full',
              '[&::-moz-range-thumb]:border-0',
              '[&::-moz-range-thumb]:cursor-pointer',
              hasValue ? '[&::-moz-range-thumb]:bg-[#F5C518]' : '[&::-moz-range-thumb]:bg-[#A39B91]',
            ].join(' ')}
            style={{
              background: hasValue
                ? `linear-gradient(to right, #F5C518 ${pct}%, #D6D0C8 ${pct}%)`
                : '#D6D0C8',
            }}
          />
        </div>
        {labels && (
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-[#A39B91] leading-tight max-w-[45%]">{labels.low}</span>
            <span className="text-[11px] text-[#A39B91] leading-tight max-w-[45%] text-right">{labels.high}</span>
          </div>
        )}
      </div>
    )
  }

  if (type === 'number') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[15px] text-[#6B645C]">€</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={(value as number) ?? ''}
          onChange={(e) => onChange(e.target.valueAsNumber || null)}
          onBlur={(e) => onChange(e.target.valueAsNumber || null)}
          disabled={disabled}
          className="w-32 h-12 rounded-[12px] bg-[#F4EFE8] px-4 text-[15px] text-[#1F1B16] outline-none focus:ring-1 focus:ring-[#F5C518]"
          placeholder="0.00"
        />
      </div>
    )
  }

  // text
  return (
    <textarea
      value={(value as string) ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onChange(e.target.value)}
      disabled={disabled}
      rows={3}
      className="w-full rounded-[14px] bg-[#F4EFE8] px-4 py-3 text-[14px] text-[#1F1B16] placeholder-[#A39B91] outline-none focus:ring-1 focus:ring-[#F5C518] resize-none"
      placeholder="Your answer…"
    />
  )
}
