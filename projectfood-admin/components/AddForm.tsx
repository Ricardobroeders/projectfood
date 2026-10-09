'use client';

import { useActionState, useState } from 'react';
import { addJob, type ActionResult } from '@/app/actions';

const KIND_OPTIONS = [
  { value: 'plant', label: 'Plant render', key: 'Plant slug (must exist in plants)', description: false, quality: 'medium' },
  { value: 'gold', label: 'Gold plant render', key: 'Plant slug', description: false, quality: 'medium' },
  { value: 'achievement', label: 'Achievement render', key: 'Achievement id (file: achievement-<id>.png)', description: true, quality: 'high' },
  { value: 'ui', label: 'UI image', key: 'File name (file: app-ui-images/<name>.png)', description: true, quality: 'high' },
];

export function AddForm() {
  const [kind, setKind] = useState(KIND_OPTIONS[0]);
  const [state, action, busy] = useActionState<ActionResult | null, FormData>(addJob, null);

  return (
    <form action={action} className="surface flex flex-col gap-3 p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px]">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--ink-2)]">Kind</span>
          <select name="kind" className="field" value={kind.value} onChange={(e) => setKind(KIND_OPTIONS.find((k) => k.value === e.target.value)!)}>
            {KIND_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--ink-2)]">{kind.key}</span>
          <input name="key" className="field" required autoComplete="off" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--ink-2)]">Quality</span>
          <select name="quality" className="field" defaultValue="" key={kind.value}>
            <option value="">{kind.quality} (default)</option>
            <option value="low">low · test only</option>
            <option value="medium">medium · $0.04</option>
            <option value="high">high · $0.17</option>
          </select>
        </label>
      </div>
      {kind.description && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--ink-2)]">What the image shows (one noun phrase; the style is added by the prompt)</span>
          <textarea name="description" className="field" required placeholder="a bronze trophy cup shaped like a carrot" />
        </label>
      )}
      <div className="flex items-center gap-3">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add to queue'}</button>
        {state && <span className={`text-sm ${state.ok ? 'text-[var(--ok)]' : 'text-[var(--bad)]'}`}>{state.message}</span>}
      </div>
    </form>
  );
}
