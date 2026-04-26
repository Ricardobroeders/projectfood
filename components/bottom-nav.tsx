'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home',  label: 'Home',  Icon: Home     },
  { href: '/log',   label: 'Log',   Icon: Plus      },
  { href: '/stats', label: 'Stats', Icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-zinc-200 flex items-center">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium transition-colors',
              active ? 'text-green-600' : 'text-zinc-400 hover:text-green-600'
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
