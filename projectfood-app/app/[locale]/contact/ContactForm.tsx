'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('marketing.contact.form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-[17px] font-semibold text-green-600 text-center py-4">
        {t('success')}
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('namePlaceholder')}
        required
        className="w-full h-12 px-4 rounded-2xl bg-white shadow-sm text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] outline-none focus:ring-2 focus:ring-[#F5C518]/50"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('emailPlaceholder')}
        required
        className="w-full h-12 px-4 rounded-2xl bg-white shadow-sm text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] outline-none focus:ring-2 focus:ring-[#F5C518]/50"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('messagePlaceholder')}
        required
        rows={5}
        className="w-full px-4 py-3 rounded-2xl bg-white shadow-sm text-[15px] text-[#1F1B16] placeholder:text-[#A39B91] outline-none focus:ring-2 focus:ring-[#F5C518]/50 resize-none"
      />
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center">{t('error')}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full h-12 text-base font-semibold bg-[#F5C518] hover:bg-[#F59A0E] active:bg-[#F59A0E] text-[#1F1B16] rounded-full transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  )
}
