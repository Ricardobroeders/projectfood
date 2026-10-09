'use server';

import { revalidatePath } from 'next/cache';
import { db, enqueue, slugify } from '@/lib/pipeline.js';

export type ActionResult = { ok: true; message: string } | { ok: false; message: string };

function fail(err: unknown): ActionResult {
  return { ok: false, message: err instanceof Error ? err.message : String(err) };
}

// ---- jobs ------------------------------------------------------------------------------------

export async function addJob(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  try {
    const kind = String(form.get('kind') ?? '');
    const key = String(form.get('key') ?? '');
    const description = String(form.get('description') ?? '');
    const quality = String(form.get('quality') ?? '') || undefined;
    const { job, reason } = await enqueue({ kind, key, description, quality });
    revalidatePath('/assets');
    if (!job) return { ok: false, message: reason ?? 'Already queued' };
    return { ok: true, message: `Queued ${job.kind} ${job.key} → ${job.bucket}/${job.path}` };
  } catch (err) {
    return fail(err);
  }
}

export async function updateJobPrompt(id: string, form: FormData) {
  const prompt = String(form.get('prompt') ?? '').trim();
  if (prompt) await db().from('asset_jobs').update({ prompt }).eq('id', id).eq('status', 'pending');
  revalidatePath('/assets');
}

export async function retryJob(id: string) {
  await db().from('asset_jobs').update({ status: 'pending', error: null, started_at: null, done_at: null }).eq('id', id).eq('status', 'error');
  revalidatePath('/assets');
}

export async function requeueJob(id: string) {
  // A done job queued again with the same inputs; the prompt is resolved afresh from the kind,
  // so an edited template applies. The new render overwrites the file.
  const { data } = await db().from('asset_jobs').select('kind, key, inputs, quality, bucket, path').eq('id', id).maybeSingle();
  if (data) await db().from('asset_jobs').insert(data);
  revalidatePath('/assets');
}

export async function deleteJob(id: string) {
  // Removes the row only; the file in Storage stays.
  await db().from('asset_jobs').delete().eq('id', id).neq('status', 'running');
  revalidatePath('/assets');
}

// ---- kinds -----------------------------------------------------------------------------------

function kindFromForm(form: FormData) {
  return {
    label: String(form.get('label') ?? '').trim(),
    source: String(form.get('source') ?? 'manual'),
    prompt_template: String(form.get('prompt_template') ?? '').trim(),
    bucket: String(form.get('bucket') ?? '').trim(),
    path_template: String(form.get('path_template') ?? '').trim(),
    quality: String(form.get('quality') ?? 'medium'),
    model: String(form.get('model') ?? 'gpt-image-1').trim() || 'gpt-image-1',
    background: String(form.get('background') ?? 'transparent'),
    writes_plant_image: form.get('writes_plant_image') === 'on',
    sort_order: Number(form.get('sort_order') ?? 100) || 100,
  };
}

export async function saveKind(id: string, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  try {
    const row = kindFromForm(form);
    if (!row.label || !row.prompt_template || !row.bucket || !row.path_template) throw new Error('Label, prompt, bucket and file name are needed');
    if (!row.path_template.includes('{{key}}')) throw new Error('The file name needs {{key}} so every job gets its own file');
    const { error } = await db().from('asset_kinds').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/kinds');
    revalidatePath('/assets');
    return { ok: true, message: 'Saved' };
  } catch (err) {
    return fail(err);
  }
}

export async function createKind(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  try {
    const id = slugify(String(form.get('id') ?? ''));
    if (!id) throw new Error('An id is needed, lowercase letters and hyphens');
    const copyFrom = String(form.get('copy_from') ?? '');
    const { data: base } = copyFrom ? await db().from('asset_kinds').select('*').eq('id', copyFrom).maybeSingle() : { data: null };
    const row = base
      ? { ...base, id, label: String(form.get('label') ?? '').trim() || `${base.label} copy`, sort_order: (base.sort_order ?? 100) + 1 }
      : {
          id,
          label: String(form.get('label') ?? '').trim() || id,
          source: 'manual',
          prompt_template: 'A stylized 3D illustration of {{description}}, in a soft clay-render style. No text, no props, no background details.',
          bucket: 'images',
          path_template: `${id}/{{key}}.png`,
          quality: 'medium',
        };
    delete (row as { created_at?: string }).created_at;
    delete (row as { updated_at?: string }).updated_at;
    const { error } = await db().from('asset_kinds').insert(row);
    if (error) throw new Error(error.code === '23505' ? `A kind "${id}" exists already` : error.message);
    revalidatePath('/kinds');
    revalidatePath('/assets');
    return { ok: true, message: `Kind "${id}" created` };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteKind(id: string): Promise<void> {
  // Blocked by the foreign key while jobs reference it; the page shows the job count.
  await db().from('asset_kinds').delete().eq('id', id);
  revalidatePath('/kinds');
  revalidatePath('/assets');
}
