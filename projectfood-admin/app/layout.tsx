import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-sans' });

export const metadata: Metadata = { title: 'Project Food admin' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 px-5 py-8 md:px-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
