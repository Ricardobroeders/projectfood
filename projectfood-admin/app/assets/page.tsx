import { db, listKinds, previewUrl, PRICE } from '@/lib/pipeline.js';
import { AddForm } from '@/components/AddForm';
import { RunButton } from '@/components/RunButton';
import { deleteJob, requeueJob, retryJob, updateJobPrompt } from '@/app/actions';
import type { Kind } from '@/components/KindEditor';

export const dynamic = 'force-dynamic';

type Job = {
  id: string; kind: string; key: string; quality: 'low' | 'medium' | 'high'; status: 'pending' | 'running' | 'done' | 'error';
  bucket: string; path: string; prompt: string | null; error: string | null; public_url: string | null; created_at: string; done_at: string | null;
  inputs: Record<string, string>;
};

export default async function AssetsPage() {
  const [kindRows, { data, error }] = await Promise.all([
    listKinds(),
    db().from('asset_jobs').select('*').order('created_at', { ascending: false }).limit(200),
  ]);
  if (error) return <p className="text-[var(--bad)]">{error.message}</p>;
  const kinds = kindRows as Kind[];
  const jobs = (data ?? []) as Job[];
  const open = jobs.filter((j) => j.status !== 'done').sort((a, b) => a.created_at.localeCompare(b.created_at));
  const done = jobs.filter((j) => j.status === 'done');
  const pending = open.filter((j) => j.status === 'pending');
  const cost = pending.reduce((s, j) => s + PRICE[j.quality], 0);
  const label = (id: string) => kinds.find((k) => k.id === id)?.label ?? id;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div>
          <h1>Assets</h1>
          <p className="meta mt-1">
            One row per render. The prompt is filled from the kind when a job is queued and can be edited while it waits.
            New plant and gold renders reach the app on the next build or OTA.
          </p>
        </div>
        <AddForm kinds={kinds.map((k) => ({ id: k.id, label: k.label, source: k.source, quality: k.quality, path_template: k.path_template }))} />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2>Queue <span className="pill ml-1">{open.length}</span></h2>
          <RunButton pending={pending.length} cost={cost} />
        </div>
        {open.length === 0 ? (
          <p className="surface meta p-5">Nothing waiting.</p>
        ) : (
          <ul className="surface divide-y divide-[var(--hairline)]">
            {open.map((j) => (
              <li key={j.id} className="flex flex-col gap-2 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`pill pill-${j.status}`}>{j.status}</span>
                  <span className="font-bold">{j.key}</span>
                  <span className="meta">{label(j.kind)} · {j.bucket}/{j.path} · {j.quality}</span>
                  <span className="ml-auto flex gap-2">
                    {j.status === 'error' && (
                      <form action={retryJob.bind(null, j.id)}><button className="btn btn-ghost btn-sm">Retry</button></form>
                    )}
                    {j.status !== 'running' && (
                      <form action={deleteJob.bind(null, j.id)}><button className="btn btn-ghost btn-sm">Remove</button></form>
                    )}
                  </span>
                </div>
                {j.error && <p className="text-sm text-[var(--bad)]">{j.error}</p>}
                {j.status === 'pending' && (
                  <details className="group">
                    <summary className="meta cursor-pointer select-none">Prompt · edit before running</summary>
                    <form action={updateJobPrompt.bind(null, j.id)} className="mt-2 flex flex-col gap-2">
                      <textarea name="prompt" className="field text-sm" defaultValue={j.prompt ?? ''} rows={5} />
                      <div><button className="btn btn-ghost btn-sm">Save prompt</button></div>
                    </form>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2>Done <span className="pill ml-1">{done.length}</span></h2>
        {done.length === 0 ? (
          <p className="surface meta p-5">No renders yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {done.map((j) => (
              <li key={j.id} className="surface flex flex-col gap-2 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${previewUrl(j)}?v=${encodeURIComponent(j.done_at ?? '')}`}
                  alt={j.key}
                  className={`aspect-square w-full rounded-[18px] object-contain ${j.kind === 'gold' ? 'bg-[var(--gold-soft)]' : 'bg-[var(--bg)]'}`}
                />
                <div className="flex items-center gap-2">
                  <span className="pill">{label(j.kind)}</span>
                  <span className="truncate font-bold">{j.key}</span>
                </div>
                <div className="meta flex items-center justify-between">
                  <span>{j.quality} · {j.done_at?.slice(0, 10)}</span>
                  <span className="flex gap-1">
                    <form action={requeueJob.bind(null, j.id)}><button className="btn btn-ghost btn-sm">Again</button></form>
                    <form action={deleteJob.bind(null, j.id)}><button className="btn btn-ghost btn-sm">Hide</button></form>
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
