#!/usr/bin/env node
// Project Food asset pipeline. Replaces the n8n "Content creation workflow" (2026-10-09):
// a job row in public.asset_jobs → gpt-image-1 → PNG → Supabase Storage → (plants.image_url).
//
//   npm run assets -- add plant <slug>                      plant render, food-images/<slug>.png
//   npm run assets -- add gold <slug>                       gold render, food-images/gold/<slug>.png
//   npm run assets -- add achievement <id> "<description>"  achievements/achievement-<id>.png
//   npm run assets -- add ui <file-name> "<description>"    images/app-ui-images/<file-name>.png
//   npm run assets -- scan-plants                           queue every active plant without image_url
//   npm run assets -- list [--status pending|running|done|error]
//   npm run assets -- run [--limit N] [--dry]               drain pending jobs (oldest first)
//   npm run assets -- retry <job-id>                        error → pending
//
// Options for add: --quality low|medium|high (defaults per kind below). Each kind's prompt is the
// n8n one, verbatim, so renders stay in the same family as the 230 that exist.

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(HERE, '../.env'), quiet: true });
loadEnv({ path: resolve(HERE, '../../projectfood-app/.env.local'), quiet: true });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
for (const [name, value] of Object.entries({ SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, OPENAI_API_KEY: OPENAI_KEY })) {
  if (!value) fail(`Missing ${name}: put it in projectfood-admin/.env or projectfood-app/.env.local`);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const openai = new OpenAI({ apiKey: OPENAI_KEY });

// ---------------------------------------------------------------------------------------------
// Kinds. `prompt` receives the job's inputs; `after` runs once the file is in Storage.

const STYLE =
  'in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from above, very soft shadows, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end illustrated product render — NOT photorealistic, NOT a photograph. No text, no props, no extra elements, no background details.';

const words = (s) => String(s ?? '').split('_').join(' ');

const KINDS = {
  plant: {
    quality: 'medium',
    bucket: 'food-images',
    path: (key) => `${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration of a ${i.name} (from the ${i.subcategory}, ${i.category}, from the ${i.botanical_family}), ${STYLE}`,
    after: async (job) => {
      const { error } = await db.from('plants').update({ image_url: job.public_url }).eq('slug', job.key);
      if (error) throw new Error(`plants.image_url update failed: ${error.message}`);
    },
  },
  gold: {
    quality: 'medium',
    bucket: 'food-images',
    path: (key) => `gold/${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration of ${i.name} (category: ${words(i.category)}, type: ${words(i.subcategory)}), cast entirely in solid gold. Identical form language to a soft clay-render or Pixar-like style: smooth surface with soft rounded edges and uniform, slightly chunky geometry, clean and friendly look. The whole subject is one single gold material, top to bottom, every part of it including any leaves, stem, skin or bowl, with no other colors anywhere. Warm yellow gold with a satin, lightly brushed finish: broad soft highlights along the upper edges, warm amber-to-bronze tones deep in the crevices, a subtle gradient from pale gold at the top to deeper gold underneath. Diffused studio lighting from above, very soft shadows, no harsh contrast, no mirror reflections, no reflected environment or horizon line. Keep the subject instantly recognizable by its silhouette and surface detail: slightly emphasize veins, ribs, seeds, folds and edges so the shape reads clearly without color. The object is centered, straight-on angle, fills 70-80% of the frame, perfectly symmetrical where natural. Minimalist, cute, high-end collectible figurine render, NOT photorealistic, NOT a photograph, NOT jewelry. No text, no props, no pedestal, no base, no plinth, no coin, no sparkles, no glitter, no light rays, no extra elements, no background details.`,
  },
  achievement: {
    quality: 'high',
    bucket: 'achievements',
    path: (key) => `achievement-${key}.png`,
    prompt: (i) => `A stylized 3D illustration for an achievement thumbnail. The image shows a ${i.description}, ${STYLE}`,
  },
  ui: {
    quality: 'high',
    bucket: 'images',
    path: (key) => `app-ui-images/${key}.png`,
    prompt: (i) =>
      `A stylized 3D illustration for an achievement thumbnail. The image shows ${i.description}, in a soft clay-render or Pixar-like style. Smooth, matte-to-slightly-glossy surface with soft rounded edges and uniform, slightly chunky geometry. Gentle subsurface-light feel, diffused studio lighting from the top left, a small soft contact shadow under the object, no harsh contrast. Vibrant but slightly muted natural colors, smooth color gradients, clean and friendly look. The object is centered, straight-on angle, fills 70-80% of the frame, symmetrical where natural. Minimalist, cute, high-end illustrated product render, NOT photorealistic, NOT a photograph. No text, no numbers, no extra elements, no background details.`,
  },
};

// OpenAI list price per 1024×1024 gpt-image-1 image, for the estimate line only.
const PRICE = { low: 0.011, medium: 0.042, high: 0.167 };

// ---------------------------------------------------------------------------------------------
// CLI

const [, , command, ...rest] = process.argv;
const args = [];
const flags = {};
for (let i = 0; i < rest.length; i++) {
  const a = rest[i];
  if (!a.startsWith('--')) { args.push(a); continue; }
  const [k, v] = a.slice(2).split('=');
  if (v !== undefined) flags[k] = v;
  else if (rest[i + 1] !== undefined && !rest[i + 1].startsWith('--') && k !== 'dry') flags[k] = rest[++i];
  else flags[k] = true;
}

const commands = { add, 'scan-plants': scanPlants, list, run, retry };
if (!commands[command]) {
  console.log(`usage: assets <add|scan-plants|list|run|retry> ...  (see the header of scripts/assets.mjs)`);
  process.exit(command ? 1 : 0);
}
await commands[command]();

// ---------------------------------------------------------------------------------------------

async function add() {
  const [kind, key, description] = args;
  const spec = KINDS[kind];
  if (!spec || !key) fail(`add <plant|gold|achievement|ui> <key> ["description"]`);
  const slug = kind === 'plant' || kind === 'gold' ? key : key.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  let inputs = {};
  if (kind === 'plant' || kind === 'gold') {
    const { data: plant, error } = await db
      .from('plants')
      .select('slug, name, category, subcategory, botanical_family')
      .eq('slug', slug)
      .maybeSingle();
    if (error) fail(error.message);
    if (!plant) fail(`No plant with slug "${slug}" in public.plants; insert the plant first (run-plant-submissions).`);
    inputs = plant;
  } else {
    if (!description) fail(`add ${kind} <key> "<description>": the description feeds the prompt`);
    inputs = { description };
  }
  const job = await enqueue(kind, slug, inputs, flags.quality);
  if (!job) return;
  console.log(`queued ${job.kind} ${job.key} → ${job.bucket}/${job.path} (${job.quality}, ~$${PRICE[job.quality]})  id ${job.id}`);
}

async function scanPlants() {
  const { data, error } = await db
    .from('plants')
    .select('slug, name, category, subcategory, botanical_family')
    .eq('is_active', true)
    .is('image_url', null)
    .order('slug');
  if (error) fail(error.message);
  if (!data.length) return console.log('Every active plant has an image_url; nothing to queue.');
  let n = 0;
  for (const plant of data) {
    const job = await enqueue('plant', plant.slug, plant, flags.quality, { quiet: true });
    if (job) n++;
  }
  console.log(`queued ${n} of ${data.length} plants without an image (the rest were already queued).`);
}

async function enqueue(kind, key, inputs, quality, { quiet } = {}) {
  const spec = KINDS[kind];
  const q = quality ?? spec.quality;
  if (!PRICE[q]) fail(`--quality must be low, medium or high`);
  const row = { kind, key, inputs, quality: q, bucket: spec.bucket, path: spec.path(key) };
  const { data, error } = await db.from('asset_jobs').insert(row).select().single();
  if (error) {
    if (error.code === '23505') {
      if (!quiet) console.log(`already queued: ${kind} ${key}`);
      return null;
    }
    fail(error.message);
  }
  return data;
}

async function list() {
  let q = db.from('asset_jobs').select('id, kind, key, quality, status, error, public_url, created_at, done_at').order('created_at');
  if (flags.status) q = q.eq('status', flags.status);
  const { data, error } = await q;
  if (error) fail(error.message);
  if (!data.length) return console.log('No jobs.');
  for (const j of data) {
    const when = (j.done_at ?? j.created_at).slice(0, 16).replace('T', ' ');
    console.log(`${j.status.padEnd(7)} ${j.kind.padEnd(11)} ${j.key.padEnd(28)} ${j.quality.padEnd(6)} ${when}  ${j.id}${j.error ? `\n        ${j.error}` : ''}`);
  }
  const pending = data.filter((j) => j.status === 'pending');
  if (pending.length) {
    const cost = pending.reduce((s, j) => s + PRICE[j.quality], 0);
    console.log(`\n${pending.length} pending, about $${cost.toFixed(2)} to run.`);
  }
}

async function retry() {
  const [id] = args;
  if (!id) fail('retry <job-id>');
  const { data, error } = await db
    .from('asset_jobs')
    .update({ status: 'pending', error: null, started_at: null, done_at: null })
    .eq('id', id)
    .eq('status', 'error')
    .select()
    .maybeSingle();
  if (error) fail(error.message);
  console.log(data ? `back in the queue: ${data.kind} ${data.key}` : 'No job in error state with that id.');
}

async function run() {
  const limit = Number(flags.limit ?? 50);
  const dry = Boolean(flags.dry);
  const { data: jobs, error } = await db.from('asset_jobs').select('*').eq('status', 'pending').order('created_at').limit(limit);
  if (error) fail(error.message);
  if (!jobs.length) return console.log('Queue empty.');
  const cost = jobs.reduce((s, j) => s + PRICE[j.quality], 0);
  console.log(`${jobs.length} job(s), about $${cost.toFixed(2)}${dry ? ' (dry run: prompts only, no API calls)' : ''}\n`);

  let done = 0;
  let failed = 0;
  for (const job of jobs) {
    const spec = KINDS[job.kind];
    const prompt = spec.prompt(job.inputs);
    const label = `${job.kind} ${job.key}`;
    if (dry) {
      console.log(`${label} → ${job.bucket}/${job.path} (${job.quality})\n  ${prompt}\n`);
      continue;
    }
    // Claim the row; a second runner on the same queue skips what this one took.
    const { data: claimed } = await db
      .from('asset_jobs')
      .update({ status: 'running', started_at: new Date().toISOString(), prompt })
      .eq('id', job.id)
      .eq('status', 'pending')
      .select()
      .maybeSingle();
    if (!claimed) continue;

    process.stdout.write(`${label} … `);
    const t0 = Date.now();
    try {
      const png = await generate(prompt, job.quality);
      const { error: upErr } = await db.storage.from(job.bucket).upload(job.path, png, { contentType: 'image/png', upsert: true });
      if (upErr) throw new Error(`upload failed: ${upErr.message}`);
      // Same URL shape as the existing plants.image_url values (public bucket, so no /public/ needed).
      const public_url = `${SUPABASE_URL}/storage/v1/object/${job.bucket}/${job.path}`;
      const finished = { ...claimed, public_url };
      if (spec.after) await spec.after(finished);
      await db.from('asset_jobs').update({ status: 'done', public_url, done_at: new Date().toISOString() }).eq('id', job.id);
      console.log(`done in ${Math.round((Date.now() - t0) / 1000)}s  ${public_url}`);
      done++;
    } catch (err) {
      const message = err?.message ?? String(err);
      await db.from('asset_jobs').update({ status: 'error', error: message.slice(0, 2000) }).eq('id', job.id);
      console.log(`ERROR  ${message}`);
      failed++;
    }
  }
  if (!dry) {
    console.log(`\n${done} done, ${failed} failed.`);
    if (done) console.log('Mobile picks new renders up on the next build or OTA: cd projectfood-mobile && node scripts/build-assets.mjs');
  }
}

async function generate(prompt, quality) {
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

function fail(message) {
  console.error(message);
  process.exit(1);
}
