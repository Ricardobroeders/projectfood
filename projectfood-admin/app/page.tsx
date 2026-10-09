import { db, previewUrl, PRICE } from '@/lib/pipeline.js';
import { AddForm } from '@/components/AddForm';
import { RunButton } from '@/components/RunButton';
import { deleteJob, requeueJob, retryJob } from './actions';

export const dynamic = 'force-dynamic';

type Job = {
  id: string; kind: string; key: string; quality: 'low' | 'medium' | 'high'; status: 'pending' | 'running' | 'done' | 'error';
  bucket: string; path: string; error: string | null; public_url: string | null; created_at: string; done_at: string | null; inputs: Record<string, string>;
};

export default async function AssetsPage() {
  const { data, error } = await db().from('asset_jobs').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) return <p className="text-[var(--bad)]">{error.message}</p>;
  const jobs = (data ?? []) as Job[];
  const open = jobs.filter((j) => j.status !== 'done').sort((a, b) => a.created_at.localeCompare(b.created_at));
  const done = jobs.filter((j) => j.status === 'done');
  const pending = open.filter((j) => j.status === 'pending');
  const cost = pending.reduce((s, j) => s + PRICE[j.quality], 0);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Asset queue</h1>
        <p className="text-sm text-[var(--ink-2)]">
          One row per render. Plants and gold read their inputs from the plants table; achievements and UI images take a description.
          New plant and gold renders reach the app on the next build or OTA (build-assets in projectfood-mobile).
        </p>
        <AddForm />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Queue <span className="pill">{open.length}</span></h2>
          <RunButton pending={pending.length} cost={cost} />
        </div>
        {open.length === 0 ? (
          <p className="surface p-4 text-sm text-[var(--ink-2)]">Nothing waiting.</p>
        ) : (
          <ul className="surface divide-y divide-[var(--line)]">
            {open.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className={`pill pill-${j.status}`}>{j.status}</span>
                <span className="font-medium">{j.kind}</span>
                <span>{j.key}</span>
                <span className="text-[var(--ink-2)]">{j.bucket}/{j.path} · {j.quality}</span>
                {j.inputs?.description && <span className="basis-full text-[var(--ink-2)]">“{j.inputs.description}”</span>}
                {j.error && <span className="basis-full text-[var(--bad)]">{j.error}</span>}
                <span className="ml-auto flex gap-2">
                  {j.status === 'error' && (
                    <form action={retryJob.bind(null, j.id)}><button className="btn btn-ghost h-8 px-3 text-xs">Retry</button></form>
                  )}
                  {j.status !== 'running' && (
                    <form action={deleteJob.bind(null, j.id)}><button className="btn btn-ghost h-8 px-3 text-xs">Remove</button></form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium">Done <span className="pill">{done.length}</span></h2>
        {done.length === 0 ? (
          <p className="surface p-4 text-sm text-[var(--ink-2)]">No renders yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {done.map((j) => (
              <li key={j.id} className="surface flex flex-col gap-2 p-3 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${previewUrl(j)}?v=${encodeURIComponent(j.done_at ?? '')}`} alt={j.key} className="aspect-square w-full rounded-lg bg-[var(--surface-2)] object-contain" />
                <div className="flex items-center gap-2">
                  <span className="pill">{j.kind}</span>
                  <span className="truncate font-medium">{j.key}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--ink-2)]">
                  <span>{j.quality} · {j.done_at?.slice(0, 10)}</span>
                  <span className="flex gap-1">
                    <form action={requeueJob.bind(null, j.id)}><button className="btn btn-ghost h-7 px-2 text-xs">Again</button></form>
                    <form action={deleteJob.bind(null, j.id)}><button className="btn btn-ghost h-7 px-2 text-xs">Hide</button></form>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
