import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Project Food admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-5">
          <Link href="/" className="font-semibold tracking-tight">Project Food admin</Link>
          <nav className="flex gap-4 text-sm text-[var(--ink-2)]">
            <Link href="/" className="text-[var(--ink)]">Assets</Link>
            <span title="Item 29c">SEO backlog</span>
            <span title="Item 29d">Journey map</span>
          </nav>
          <span className="ml-auto pill">local</span>
        </header>
        <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
      </body>
    </html>
  );
}
