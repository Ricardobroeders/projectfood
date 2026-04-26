import Link from 'next/link'
import { Home, Plus, BarChart2 } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 h-14 flex items-center">
        <span className="font-semibold text-zinc-900">Project Food</span>
      </header>

      <main className="flex-1 pb-16">{children}</main>

      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-zinc-200 flex items-center">
        {[
          { href: '/home',  label: 'Home',  Icon: Home      },
          { href: '/log',   label: 'Log',   Icon: Plus       },
          { href: '/stats', label: 'Stats', Icon: BarChart2  },
        ].map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium text-zinc-400 hover:text-green-600 transition-colors"
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
