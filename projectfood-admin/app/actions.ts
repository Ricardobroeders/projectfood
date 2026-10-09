'use server';

import { revalidatePath } from 'next/cache';
import { db, enqueue } from '@/lib/pipeline.js';

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };

export async function addJob(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  try {
    const kind = String(form.get('kind') ?? '');
    const key = String(form.get('key') ?? '');
    const description = String(form.get('description') ?? '');
    const quality = String(form.get('quality') ?? '') || undefined;
    const { job, reason } = await enqueue({ kind, key, description, quality });
    revalidatePath('/');
    if (!job) return { ok: false, message: reason ?? 'Already queued' };
    return { ok: true, message: `Queued ${job.kind} ${job.key} → ${job.bucket}/${job.path}` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : String(err) };
  }
}

export async function retryJob(id: string) {
  await db().from('asset_jobs').update({ status: 'pending', error: null, started_at: null, done_at: null }).eq('id', id).eq('status', 'error');
  revalidatePath('/');
}

export async function requeueJob(id: string) {
  // A done job queued again: same kind, key and inputs; the new render overwrites the file.
  const { data } = await db().from('asset_jobs').select('kind, key, inputs, quality, bucket, path').eq('id', id).maybeSingle();
  if (data) await db().from('asset_jobs').insert(data);
  revalidatePath('/');
}

export async function deleteJob(id: string) {
  // Removes the row only; the file in Storage stays.
  await db().from('asset_jobs').delete().eq('id', id).neq('status', 'running');
  revalidatePath('/');
}
