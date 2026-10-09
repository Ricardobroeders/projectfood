// The asset pipeline, shared by scripts/assets.mjs (terminal) and the admin app (browser).
// A job row in public.asset_jobs → image model → PNG → Supabase Storage → (plants.image_url).
// The steps are fixed here; what varies per kind (inputs, prompt, bucket, file name, quality,
// model) is a row in public.asset_kinds, editable on the Kinds page (2026-10-09).

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export { PRICE, PLACEHOLDERS, SAMPLE_INPUTS, slugify, fill } from './template.js';
import { PRICE, slugify, fill } from './template.js';

export function env() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const missing = Object.entries({ SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: serviceKey, OPENAI_API_KEY: openaiKey })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) throw new Error(`Missing ${missing.join(', ')}: put them in projectfood-admin/.env or projectfood-app/.env.local`);
  return { url, serviceKey, openaiKey };
}

let _db;
export function db() {
  if (!_db) {
    const { url, serviceKey } = env();
    _db = createClient(url, serviceKey, { auth: { persistSession: false } });
  }
  return _db;
}

export async function listKinds() {
  const { data, error } = await db().from('asset_kinds').select('*').order('sort_order').order('id');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getKind(id) {
  const { data, error } = await db().from('asset_kinds').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Unknown kind "${id}"`);
  return data;
}

export function publicUrl(job) {
  // Same URL shape as the existing plants.image_url values (public buckets, so no /public/ needed).
  return `${env().url}/storage/v1/object/${job.bucket}/${job.path}`;
}

export function previewUrl(job) {
  return `${env().url}/storage/v1/object/public/${job.bucket}/${job.path}`;
}

/** Resolves inputs for a kind: the plant row for plant kinds, the description for manual ones. */
export async function inputsFor(kind, key, description) {
  if (kind.source === 'plant') {
    const { data: plant, error } = await db()
      .from('plants')
      .select('slug, name, category, subcategory, botanical_family')
      .eq('slug', key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!plant) throw new Error(`No plant with slug "${key}" in public.plants; insert the plant first (run-plant-submissions).`);
    return { ...plant, key };
  }
  if (!description?.trim()) throw new Error(`${kind.label}: a description is needed, it feeds the prompt`);
  return { description: description.trim(), key };
}

/** Validates and inserts one job. Returns { job } or { job: null, reason } when already queued. */
export async function enqueue({ kind: kindId, key, description, quality }) {
  const kind = await getKind(kindId);
  if (!key?.trim()) throw new Error('A key is needed: the plant slug, the achievement id or the file name');
  const q = quality || kind.quality;
  if (!PRICE[q]) throw new Error('Quality must be low, medium or high');
  const theKey = kind.source === 'plant' ? key.trim() : slugify(key);
  const inputs = await inputsFor(kind, theKey, description);
  const row = {
    kind: kind.id,
    key: theKey,
    inputs,
    quality: q,
    bucket: kind.bucket,
    path: fill(kind.path_template, inputs),
    prompt: fill(kind.prompt_template, inputs),
  };
  const { data, error } = await db().from('asset_jobs').insert(row).select().single();
  if (error) {
    if (error.code === '23505') return { job: null, reason: `already queued: ${kind.id} ${theKey}` };
    throw new Error(error.message);
  }
  return { job: data };
}

/** The prompt a job will send: its own (set at queue time, maybe edited) or the kind's template. */
export async function promptFor(job) {
  if (job.prompt) return job.prompt;
  const kind = await getKind(job.kind);
  return fill(kind.prompt_template, job.inputs);
}

async function generate({ prompt, quality, model, background }) {
  const openai = new OpenAI({ apiKey: env().openaiKey });
  const res = await openai.images.generate({
    model: model || 'gpt-image-1',
    prompt,
    size: '1024x1024',
    quality,
    background: background || 'transparent',
    n: 1,
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI returned no image data');
  return Buffer.from(b64, 'base64');
}

/**
 * Claims the oldest pending job (or the given one) and runs it to done or error.
 * Returns { job, ok, error, seconds } or null when the queue is empty.
 */
export async function processNext({ jobId } = {}) {
  const client = db();
  let q = client.from('asset_jobs').select('*').eq('status', 'pending').order('created_at').limit(1);
  if (jobId) q = q.eq('id', jobId);
  const { data: rows, error } = await q;
  if (error) throw new Error(error.message);
  const job = rows?.[0];
  if (!job) return null;

  const kind = await getKind(job.kind);
  const prompt = await promptFor(job);
  // Claim the row; a second runner on the same queue skips what this one took.
  const { data: claimed } = await client
    .from('asset_jobs')
    .update({ status: 'running', started_at: new Date().toISOString(), prompt })
    .eq('id', job.id)
    .eq('status', 'pending')
    .select()
    .maybeSingle();
  if (!claimed) return { job, ok: false, error: 'claimed by another runner', seconds: 0 };

  const t0 = Date.now();
  try {
    const png = await generate({ prompt, quality: job.quality, model: kind.model, background: kind.background });
    const { error: upErr } = await client.storage.from(job.bucket).upload(job.path, png, { contentType: 'image/png', upsert: true });
    if (upErr) throw new Error(`upload failed: ${upErr.message}`);
    const public_url = publicUrl(job);
    if (kind.writes_plant_image) {
      const { error: plantErr } = await client.from('plants').update({ image_url: public_url }).eq('slug', job.key);
      if (plantErr) throw new Error(`plants.image_url update failed: ${plantErr.message}`);
    }
    await client.from('asset_jobs').update({ status: 'done', public_url, done_at: new Date().toISOString() }).eq('id', job.id);
    return { job: { ...claimed, public_url }, ok: true, seconds: Math.round((Date.now() - t0) / 1000) };
  } catch (err) {
    const message = err?.message ?? String(err);
    await client.from('asset_jobs').update({ status: 'error', error: message.slice(0, 2000) }).eq('id', job.id);
    return { job, ok: false, error: message, seconds: Math.round((Date.now() - t0) / 1000) };
  }
}

export async function pendingCount() {
  const { count, error } = await db().from('asset_jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending');
  if (error) throw new Error(error.message);
  return count ?? 0;
}
