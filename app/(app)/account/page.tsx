import { createClient } from '@/lib/supabase/server'
import { UsernameForm } from './UsernameForm'
import { InstallButton } from './InstallButton'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null
  const email = user?.email ?? null
  const avatar = user?.user_metadata?.avatar_url ?? null

  const { data: settings } = await supabase
    .from('user_settings')
    .select('username')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="px-5 pt-6 pb-8 space-y-6">
      {/* Profile card */}
      <div
        className="rounded-[24px] bg-white p-6 flex items-center gap-4"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-[#FBEDB5] flex items-center justify-center text-2xl">
            🥦
          </div>
        )}
        <div className="min-w-0">
          {name && <p className="text-base font-bold text-[#1F1B16] truncate">{name}</p>}
          {email && <p className="text-sm text-[#6B645C] truncate">{email}</p>}
        </div>
      </div>

      {/* Settings */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-2 px-1">
          Settings
        </p>
        <div
          className="rounded-[24px] bg-white divide-y divide-[#F4EFE8]"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <UsernameForm userId={user!.id} initial={settings?.username ?? null} />
          {[
            { label: 'Weekly goal', value: '30 plants' },
            { label: 'Notifications', value: 'Coming soon' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-4">
              <span className="text-[15px] font-medium text-[#1F1B16]">{label}</span>
              <span className="text-[14px] text-[#A39B91]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Install app */}
      <div
        className="rounded-[24px] bg-white"
        style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
      >
        <InstallButton />
      </div>

      {/* Sign out */}
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-[#A39B91] mb-2 px-1">
          Account
        </p>
        <div
          className="rounded-[24px] bg-white"
          style={{ boxShadow: '0 2px 6px rgba(31,27,22,0.04)' }}
        >
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-left px-5 py-4 text-[15px] font-medium text-red-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
