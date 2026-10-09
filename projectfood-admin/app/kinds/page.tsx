import { db, listKinds } from '@/lib/pipeline.js';
import { KindEditor, NewKindForm, type Kind } from '@/components/KindEditor';

export const dynamic = 'force-dynamic';

export default async function KindsPage() {
  const [kindRows, { data: counts }] = await Promise.all([
    listKinds(),
    db().from('asset_jobs').select('kind'),
  ]);
  const kinds = kindRows as Kind[];
  const jobCount = (id: string) => ((counts ?? []) as { kind: string }[]).filter((r) => r.kind === id).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1>Kinds</h1>
        <p className="meta mt-1">
          A kind is one flow: where the inputs come from, the prompt, where the file goes. The steps themselves never change
          (inputs → prompt → image → upload → done), so a new image type is a new row here, not new code.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {kinds.map((k) => <KindEditor key={k.id} kind={k} jobs={jobCount(k.id)} />)}
      </div>
      <section className="flex flex-col gap-3">
        <h2>New kind</h2>
        <NewKindForm kinds={kinds.map((k) => ({ id: k.id, label: k.label }))} />
      </section>
    </div>
  );
}
