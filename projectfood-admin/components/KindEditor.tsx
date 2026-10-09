'use client';

import { useActionState, useState } from 'react';
import { createKind, deleteKind, saveKind, type ActionResult } from '@/app/actions';
import { fill, PLACEHOLDERS, SAMPLE_INPUTS } from '@/lib/template.js';

export type Kind = {
  id: string; label: string; source: 'plant' | 'manual'; prompt_template: string; bucket: string; path_template: string;
  quality: 'low' | 'medium' | 'high'; model: string; background: 'transparent' | 'opaque' | 'auto'; writes_plant_image: boolean; sort_order: number;
};

const BUCKETS = ['food-images', 'achievements', 'images', 'avatars'];

export function KindEditor({ kind, jobs }: { kind: Kind; jobs: number }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<Kind['source']>(kind.source);
  const [prompt, setPrompt] = useState(kind.prompt_template);
  const [path, setPath] = useState(kind.path_template);
  const [state, action, busy] = useActionState<ActionResult | null, FormData>(saveKind.bind(null, kind.id), null);
  const sample = SAMPLE_INPUTS[source] as Record<string, string>;

  return (
    <section className="surface">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left">
        <span className="font-bold">{kind.label}</span>
        <span className="pill">{kind.id}</span>
        <span className="meta">{kind.source === 'plant' ? 'from the plants table' : 'from a description'} · {kind.bucket}/{kind.path_template} · {kind.quality}</span>
        <span className="meta ml-auto">{jobs} job{jobs === 1 ? '' : 's'} · {open ? 'close' : 'edit'}</span>
      </button>
      {open && (
        <form action={action} className="flex flex-col gap-4 border-t border-[var(--hairline)] px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="label">Label</span>
              <input name="label" className="field" defaultValue={kind.label} required />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label">Inputs come from</span>
              <select name="source" className="field" value={source} onChange={(e) => setSource(e.target.value as Kind['source'])}>
                <option value="plant">the plants table (key = plant slug)</option>
                <option value="manual">a description typed per job</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label">Default quality</span>
              <select name="quality" className="field" defaultValue={kind.quality}>
                <option value="low">low · $0.01, tests only</option>
                <option value="medium">medium · $0.04</option>
                <option value="high">high · $0.17</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="label">Prompt · placeholders: {PLACEHOLDERS[source].map((p) => `{{${p}}}`).join(' ')}</span>
            <textarea name="prompt_template" className="field" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={7} required />
          </label>
          <div className="card p-4">
            <div className="label mb-1">Preview with {source === 'plant' ? `${sample.name} (${sample.category}, ${sample.botanical_family})` : `“${sample.description}”`}</div>
            <p className="text-sm text-[var(--ink-2)]">{fill(prompt, sample)}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="label">Bucket</span>
              <select name="bucket" className="field" defaultValue={kind.bucket}>
                {BUCKETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label">File name · must contain {'{{key}}'}</span>
              <input name="path_template" className="field" value={path} onChange={(e) => setPath(e.target.value)} required />
              <span className="meta">→ {fill(path, sample)}</span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label">Model</span>
              <input name="model" className="field" defaultValue={kind.model} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="label">Background</span>
              <select name="background" className="field" defaultValue={kind.background}>
                <option value="transparent">transparent</option>
                <option value="opaque">opaque</option>
                <option value="auto">auto</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label">Order in lists</span>
              <input name="sort_order" type="number" className="field" defaultValue={kind.sort_order} />
            </label>
            <label className="flex items-center gap-3 pt-6">
              <input name="writes_plant_image" type="checkbox" defaultChecked={kind.writes_plant_image} className="size-5 accent-[var(--accent)]" />
              <span className="label">Set plants.image_url when done</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save kind'}</button>
            {jobs === 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => { if (confirm(`Delete kind "${kind.id}"?`)) deleteKind(kind.id); }}>
                Delete
              </button>
            )}
            {state && <span className={`text-sm font-semibold ${state.ok ? 'text-[var(--success)]' : 'text-[var(--bad)]'}`}>{state.message}</span>}
          </div>
        </form>
      )}
    </section>
  );
}

export function NewKindForm({ kinds }: { kinds: { id: string; label: string }[] }) {
  const [state, action, busy] = useActionState<ActionResult | null, FormData>(createKind, null);
  return (
    <form action={action} className="surface flex flex-col gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="label">Id (lowercase, hyphens)</span>
          <input name="id" className="field" required placeholder="cup" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">Label</span>
          <input name="label" className="field" placeholder="Cup render" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">Start from</span>
          <select name="copy_from" className="field" defaultValue={kinds[0]?.id ?? ''}>
            {kinds.map((k) => <option key={k.id} value={k.id}>copy of {k.label}</option>)}
            <option value="">a blank kind</option>
          </select>
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create kind'}</button>
        {state && <span className={`text-sm font-semibold ${state.ok ? 'text-[var(--success)]' : 'text-[var(--bad)]'}`}>{state.message}</span>}
      </div>
    </form>
  );
}
