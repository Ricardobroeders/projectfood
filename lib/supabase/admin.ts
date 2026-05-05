import { createClient } from '@supabase/supabase-js'

// Bypasses RLS — only use server-side in trusted contexts (cron, webhooks)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
