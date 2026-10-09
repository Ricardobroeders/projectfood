'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Images, SlidersHorizontal, Search, Route, Leaf } from 'lucide-react';

const ITEMS = [
  { href: '/assets', label: 'Assets', icon: Images },
  { href: '/asset-settings', label: 'Asset settings', icon: SlidersHorizontal },
  { href: '/seo', label: 'SEO backlog', icon: Search, soon: true },
  { href: '/journey', label: 'Journey map', icon: Route, soon: true },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-6 bg-[var(--bg-soft)] px-4 py-6">
      <div className="flex items-center gap-3 px-2">
        <span className="flex size-9 items-center justify-center rounded-[12px] bg-[var(--accent)] text-[var(--on-accent)]">
          <Leaf size={18} strokeWidth={2.4} />
        </span>
        <div className="leading-tight">
          <div className="font-extrabold">Project Food</div>
          <div className="meta">admin · local</div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {ITEMS.map(({ href, label, icon: Icon, soon }) =>
          soon ? (
            <span key={href} className="nav-item" data-soon="true" title="Not built yet">
              <Icon size={18} /> {label}
            </span>
          ) : (
            <Link key={href} href={href} className="nav-item" data-active={pathname.startsWith(href)}>
              <Icon size={18} /> {label}
            </Link>
          ),
        )}
      </nav>
      <p className="meta mt-auto px-2">Runs on 127.0.0.1 only. Keys come from the site’s env file.</p>
    </aside>
  );
}
