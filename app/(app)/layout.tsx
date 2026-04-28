import Image from 'next/image'
import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4EFE8]">
      <header className="sticky top-0 z-10 bg-white px-5 h-14 flex items-center gap-2" style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}>
        <Image src="/icons/logo.svg" alt="ProjectFood logo" width={32} height={32} />
        <span className="font-bold text-[#1F1B16]">Project Food</span>
      </header>

      <main className="flex-1 pb-16">{children}</main>

      <BottomNav />
    </div>
  )
}
