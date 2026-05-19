'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MarketingLanguageSwitcher } from '@/components/marketing-language-switcher'
import { getLocalizedHref } from '@/lib/marketing'

type Props = {
  locale: string
  labels: {
    home: string
    about: string
    recipes: string
    contact: string
    learn: string
    openApp: string
  }
}

export function MarketingHeader({ locale, labels }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm"
        style={{ boxShadow: '0 1px 0 rgba(31,27,22,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}/`}
            className="flex items-center gap-2 shrink-0"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt="Project Food"
              width={28}
              height={28}
              unoptimized
              className="shrink-0 rounded-xs"
            />
            <span className="font-bold text-[#1F1B16] text-[18px]">Project Food</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#6B645C]">
            <Link
              href={getLocalizedHref('/learn', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {labels.learn}
            </Link>
            <Link
              href={getLocalizedHref('/about', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {labels.about}
            </Link>
            <Link
              href={getLocalizedHref('/recipes', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {labels.recipes}
            </Link>
            <Link
              href={getLocalizedHref('/contact', locale)}
              className="hover:text-[#1F1B16] transition-colors"
            >
              {labels.contact}
            </Link>
          </nav>

          {/* Desktop: CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/login"
              className="bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] font-semibold text-sm px-4 py-2 rounded-full transition-colors whitespace-nowrap"
            >
              {labels.openApp}
            </Link>
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden p-2 -mr-2 text-[#1F1B16]"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 z-10 bg-white pt-16 flex flex-col md:hidden">
          <nav className="flex flex-col px-5">
            <Link
              href={`/${locale}/`}
              className="text-xl font-semibold text-[#1F1B16] py-4 border-b border-[#F4EFE8]"
              onClick={() => setOpen(false)}
            >
              {labels.home}
            </Link>
            <Link
              href={getLocalizedHref('/learn', locale)}
              className="text-xl font-semibold text-[#1F1B16] py-4 border-b border-[#F4EFE8]"
              onClick={() => setOpen(false)}
            >
              {labels.learn}
            </Link>
            <Link
              href={getLocalizedHref('/about', locale)}
              className="text-xl font-semibold text-[#1F1B16] py-4 border-b border-[#F4EFE8]"
              onClick={() => setOpen(false)}
            >
              {labels.about}
            </Link>
            <Link
              href={getLocalizedHref('/contact', locale)}
              className="text-xl font-semibold text-[#1F1B16] py-4 border-b border-[#F4EFE8]"
              onClick={() => setOpen(false)}
            >
              {labels.contact}
            </Link>
            <Link
              href={getLocalizedHref('/recipes', locale)}
              className="text-xl font-semibold text-[#1F1B16] py-4 border-b border-[#F4EFE8]"
              onClick={() => setOpen(false)}
            >
              {labels.recipes}
            </Link>
          </nav>

          <div className="px-5 mt-8 flex flex-col gap-5">
            <Link
              href="/login"
              className="bg-[#F5C518] hover:bg-[#F59A0E] text-[#1F1B16] font-bold text-base px-6 py-4 rounded-full text-center transition-colors"
              onClick={() => setOpen(false)}
            >
              {labels.openApp}
            </Link>
            <div className="flex justify-center">
              <MarketingLanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
