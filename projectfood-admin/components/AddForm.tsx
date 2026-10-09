'use client';

import { useActionState, useState } from 'react';
import { addJob, type ActionResult } from '@/app/actions';

export type KindOption = { id: string; label: string; source: string; quality: string; path_template: string };

export function AddForm({ kinds }: { kinds: KindOption[] }) {
  const [kind, setKind] = useState<KindOption>(kinds[0]);
  const [state, action, busy] = useActionState<ActionResult | null, FormData>(addJob, null);
  if (!kind) return <p className="surface meta p-5">No kinds yet. Create one on the Kinds page.</p>;
  const isPlant = kind.source === 'plant';

  return (
    <form action={action} className="surface flex flex-col gap-4 p-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_150px]">
        <label className="flex flex-col gap-1.5">
          <span className="label">Kind</span>
          <select name="kind" className="field" value={kind.id} onChange={(e) => setKind(kinds.find((k) => k.id === e.target.value)!)}>
            {kinds.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">{isPlant ? 'Plant slug (must exist in plants)' : `Key → ${kind.path_template}`}</span>
          <input name="key" className="field" required autoComplete="off" placeholder={isPlant ? 'kohlrabi' : 'streak-flame'} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="label">Quality</span>
          <select name="quality" className="field" defaultValue="" key={kind.id}>
            <option value="">{kind.quality} (default)</option>
            <option value="low">low · test only</option>
            <option value="medium">medium · $0.04</option>
            <option value="high">high · $0.17</option>
          </select>
        </label>
      </div>
      {!isPlant && (
        <label className="flex flex-col gap-1.5">
          <span className="label">What the image shows (fills the kind’s prompt)</span>
          <textarea name="description" className="field" required placeholder="a bronze trophy cup shaped like a carrot" rows={2} />
        </label>
      )}
      <div className="flex items-center gap-4">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Adding…' : 'Add to queue'}</button>
        {state && <span className={`text-sm font-semibold ${state.ok ? 'text-[var(--success)]' : 'text-[var(--bad)]'}`}>{state.message}</span>}
      </div>
    </form>
  );
}
