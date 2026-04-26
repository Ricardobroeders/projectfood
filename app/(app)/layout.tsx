import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 h-14 flex items-center">
        <span className="font-semibold text-zinc-900">Project Food</span>
      </header>

      <main className="flex-1 pb-16">{children}</main>

      <BottomNav />
    </div>
  )
}
