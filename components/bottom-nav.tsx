'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/home',    label: 'Home',    Icon: Home     },
  { href: '/log',     label: 'Log',     Icon: Plus      },
  { href: '/stats',   label: 'Stats',   Icon: BarChart2 },
  { href: '/account', label: 'Account', Icon: User      },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 bg-white flex items-center" style={{ boxShadow: '0 -2px 6px rgba(31,27,22,0.04)' }}>
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium transition-colors',
              active ? 'text-[#F5C518]' : 'text-[#A39B91] hover:text-[#F5C518]'
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
