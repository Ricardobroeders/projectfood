// The asset pipeline, shared by scripts/assets.mjs (terminal) and the admin app (browser).
// A job row in public.asset_jobs → gpt-image-1 → PNG → Supabase Storage → (plants.image_url).
// Prompts are the n8n ones verbatim (2026-10-09), so new renders match the existing family.

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const STYLE =
  'in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from above, very soft shadows, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end illustrated product render — NOT photorealistic, NOT a photograph. No text, no props, no extra elements, no background details.';

const words = (s) => String(s ?? '').split('_').join(' ');

/** @type {Record<string, {label: string, quality: string, bucket: string, needsPlant?: boolean, needsDescription?: boolean, path: (key: string) => string, prompt: (i: any) => string, after?: (db: any, job: any) => Promise<void>}>} */
export const KINDS = {
  plant: {
    label: 'Plant render',
    quality: 'medium',
    bucket: 'food-images',
    needsPlant: true,
    path: (key) => `${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration of a ${i.name} (from the ${i.subcategory}, ${i.category}, from the ${i.botanical_family}), ${STYLE}`,
    after: async (db, job) => {
      const { error } = await db.from('plants').update({ image_url: job.public_url }).eq('slug', job.key);
      if (error) throw new Error(`plants.image_url update failed: ${error.message}`);
    },
  },
  gold: {
    label: 'Gold plant render',
    quality: 'medium',
    bucket: 'food-images',
    needsPlant: true,
    path: (key) => `gold/${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration of ${i.name} (category: ${words(i.category)}, type: ${words(i.subcategory)}), cast entirely in solid gold. Identical form language to a soft clay-render or Pixar-like style: smooth surface with soft rounded edges and uniform, slightly chunky geometry, clean and friendly look. The whole subject is one single gold material, top to bottom, every part of it including any leaves, stem, skin or bowl, with no other colors anywhere. Warm yellow gold with a satin, lightly brushed finish: broad soft highlights along the upper edges, warm amber-to-bronze tones deep in the crevices, a subtle gradient from pale gold at the top to deeper gold underneath. Diffused studio lighting from above, very soft shadows, no harsh contrast, no mirror reflections, no reflected environment or horizon line. Keep the subject instantly recognizable by its silhouette and surface detail: slightly emphasize veins, ribs, seeds, folds and edges so the shape reads clearly without color. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end collectible figurine render, NOT photorealistic, NOT a photograph, NOT jewelry. No text, no props, no pedestal, no base, no plinth, no coin, no sparkles, no glitter, no light rays, no extra elements, no background details.`,
  },
  achievement: {
    label: 'Achievement render',
    quality: 'high',
    bucket: 'achievements',
    needsDescription: true,
    path: (key) => `achievement-${key}.png`,
    prompt: (i) => `A stylized 3D illustration for an achievement thumbnail. The image shows a ${i.description}, ${STYLE}`,
  },
  ui: {
    label: 'UI image',
    quality: 'high',
    bucket: 'images',
    needsDescription: true,
    path: (key) => `app-ui-images/${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration for an achievement thumbnail. The image shows ${i.description}, in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from the top left, a small soft contact shadow under the object, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, symmetrical where natural. Minimalist, cute, high-end illustrated product render, NOT photorealistic, NOT a photograph. No text, no numbers, no extra elements, no background details.`,
  },
};

// OpenAI list price per 1024×1024 gpt-image-1 image, for estimates only.
export const PRICE = { low: 0.011, medium: 0.042, high: 0.167 };

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

export function publicUrl(job) {
  // Same URL shape as the existing plants.image_url values (public buckets, so no /public/ needed).
  return `${env().url}/storage/v1/object/${job.bucket}/${job.path}`;
}

export function previewUrl(job) {
  return `${env().url}/storage/v1/object/public/${job.bucket}/${job.path}`;
}

export function slugify(s) {
  return String(s).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Validates and inserts one job. Returns { job } or { job: null, reason } when already queued. */
export async function enqueue({ kind, key, description, quality }) {
  const spec = KINDS[kind];
  if (!spec) throw new Error(`Unknown kind "${kind}"`);
  if (!key) throw new Error('A key is needed: the plant slug, the achievement id or the file name');
  const q = quality || spec.quality;
  if (!PRICE[q]) throw new Error('Quality must be low, medium or high');
  const client = db();
  let inputs = {};
  let theKey = key.trim();
  if (spec.needsPlant) {
    const { data: plant, error } = await client
      .from('plants')
      .select('slug, name, category, subcategory, botanical_family')
      .eq('slug', theKey)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!plant) throw new Error(`No plant with slug "${theKey}" in public.plants; insert the plant first (run-plant-submissions).`);
    inputs = plant;
  } else {
    theKey = slugify(theKey);
    if (!description?.trim()) throw new Error(`${spec.label}: a description is needed, it feeds the prompt`);
    inputs = { description: description.trim() };
  }
  const row = { kind, key: theKey, inputs, quality: q, bucket: spec.bucket, path: spec.path(theKey) };
  const { data, error } = await client.from('asset_jobs').insert(row).select().single();
  if (error) {
    if (error.code === '23505') return { job: null, reason: `already queued: ${kind} ${theKey}` };
    throw new Error(error.message);
  }
  return { job: data };
}

export function promptFor(job) {
  return KINDS[job.kind].prompt(job.inputs);
}

async function generate(prompt, quality) {
  const openai = new OpenAI({ apiKey: env().openaiKey });
  const res = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    size: '1024x1024',
    quality,
    background: 'transparent',
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

  const spec = KINDS[job.kind];
  const prompt = spec.prompt(job.inputs);
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
    const png = await generate(prompt, job.quality);
    const { error: upErr } = await client.storage.from(job.bucket).upload(job.path, png, { contentType: 'image/png', upsert: true });
    if (upErr) throw new Error(`upload failed: ${upErr.message}`);
    const public_url = publicUrl(job);
    const finished = { ...claimed, public_url };
    if (spec.after) await spec.after(client, finished);
    await client.from('asset_jobs').update({ status: 'done', public_url, done_at: new Date().toISOString() }).eq('id', job.id);
    return { job: finished, ok: true, seconds: Math.round((Date.now() - t0) / 1000) };
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
