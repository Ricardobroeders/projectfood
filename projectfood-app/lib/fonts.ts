import localFont from 'next/font/local'

// Plus Jakarta Sans, self-hosted. The file is Google's latin build of the variable font
// (weights 200 to 800, SIL Open Font License, licence next to it). Both root layouts use it.
// It used to come from next/font/google, which fetches the font from Google on every build;
// a Google response in an unexpected shape broke a Vercel build on 2026-10-10, and that
// dependency is gone now.
export const jakarta = localFont({
  src: '../app/fonts/PlusJakartaSans-latin.woff2',
  variable: '--font-sans',
  weight: '200 800',
  display: 'swap',
})
