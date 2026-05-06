import Link from 'next/link'
import { User } from 'lucide-react'
import { BottomNav } from '@/components/bottom-nav'
import { SWRProvider } from '@/components/swr-provider'
import { Prefetcher } from '@/components/prefetcher'
import { OnboardingModal } from './OnboardingModal'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRProvider>
      <div className="flex flex-col min-h-screen bg-[#F4EFE8]">
        <header className="sticky top-0 z-10 bg-white px-5 h-14 flex items-center justify-between" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
          <span className="font-bold text-[#1F1B16]">Project Food</span>
          <Link href="/account" className="text-[#A39B91] hover:text-[#1F1B16] transition-colors p-1">
            <User className="size-5" />
          </Link>
        </header>

        <main className="flex-1 pb-16">{children}</main>

        <BottomNav />
        <OnboardingModal />
        <Prefetcher />
      </div>
    </SWRProvider>
  )
}
