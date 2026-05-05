import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { endpoint } = body ?? {}

  if (endpoint) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint)
  } else {
    // Delete all subscriptions for this user
    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
  }

  // Mark notifications disabled
  await supabase
    .from('user_settings')
    .update({ notifications_enabled: false })
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
