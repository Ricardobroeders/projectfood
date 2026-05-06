import { redirect } from 'next/navigation'

// Middleware redirects / → /{locale}/ before this page is ever reached.
// This is a safety fallback only.
export default function RootPage() {
  redirect('/en/')
}
