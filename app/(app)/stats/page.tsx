export default function StatsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
      <div className="text-4xl">📊</div>
      <h2 className="text-lg font-semibold text-zinc-800">Stats</h2>
      <p className="text-sm text-zinc-400">Your all-time plant stats will live here.</p>
      <form action="/auth/signout" method="post" className="mt-6">
        <button type="submit" className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600">
          Sign out
        </button>
      </form>
    </div>
  )
}
