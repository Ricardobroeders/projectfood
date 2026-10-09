#!/usr/bin/env node
// Terminal front for the asset pipeline (lib/pipeline.js). The admin app is the browser front.
//
//   npm run assets -- add <kind> <key> ["description"]      kinds live in public.asset_kinds (Kinds page)
//   npm run assets -- add plant <slug>                      plant render, food-images/<slug>.png
//   npm run assets -- add gold <slug>                       gold render, food-images/gold/<slug>.png
//   npm run assets -- add achievement <id> "<description>"  achievements/achievement-<id>.png
//   npm run assets -- add ui <file-name> "<description>"    images/app-ui-images/<file-name>.png
//   npm run assets -- scan-plants                           queue every active plant without image_url
//   npm run assets -- list [--status pending|running|done|error]
//   npm run assets -- run [--limit N] [--dry]               drain pending jobs (oldest first)
//   npm run assets -- retry <job-id>                        error → pending
//
// Options for add: --quality low|medium|high (default per kind).

import { config as loadEnv } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(HERE, '../.env'), quiet: true });
loadEnv({ path: resolve(HERE, '../../projectfood-app/.env.local'), quiet: true });

const { PRICE, db, listKinds, enqueue, promptFor, processNext } = await import('../lib/pipeline.js');

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
  console.log('usage: assets <add|scan-plants|list|run|retry> ...  (see the header of scripts/assets.mjs)');
  process.exit(command ? 1 : 0);
}
try {
  await commands[command]();
} catch (err) {
  console.error(err?.message ?? err);
  process.exit(1);
}

async function add() {
  const [kind, key, description] = args;
  if (!kind || !key) {
    const kinds = (await listKinds()).map((k) => k.id).join('|');
    throw new Error(`add <${kinds}> <key> ["description"]`);
  }
  const { job, reason } = await enqueue({ kind, key, description, quality: flags.quality });
  if (!job) return console.log(reason);
  console.log(`queued ${job.kind} ${job.key} → ${job.bucket}/${job.path} (${job.quality}, ~$${PRICE[job.quality]})  id ${job.id}`);
}

async function scanPlants() {
  const { data, error } = await db().from('plants').select('slug').eq('is_active', true).is('image_url', null).order('slug');
  if (error) throw new Error(error.message);
  if (!data.length) return console.log('Every active plant has an image_url; nothing to queue.');
  let n = 0;
  for (const { slug } of data) {
    const { job } = await enqueue({ kind: 'plant', key: slug, quality: flags.quality });
    if (job) n++;
  }
  console.log(`queued ${n} of ${data.length} plants without an image (the rest were already queued).`);
}

async function list() {
  let q = db().from('asset_jobs').select('id, kind, key, quality, status, error, public_url, created_at, done_at').order('created_at');
  if (flags.status) q = q.eq('status', flags.status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
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
  if (!id) throw new Error('retry <job-id>');
  const { data, error } = await db()
    .from('asset_jobs')
    .update({ status: 'pending', error: null, started_at: null, done_at: null })
    .eq('id', id)
    .eq('status', 'error')
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  console.log(data ? `back in the queue: ${data.kind} ${data.key}` : 'No job in error state with that id.');
}

async function run() {
  const limit = Number(flags.limit ?? 50);
  const dry = Boolean(flags.dry);
  const { data: jobs, error } = await db().from('asset_jobs').select('*').eq('status', 'pending').order('created_at').limit(limit);
  if (error) throw new Error(error.message);
  if (!jobs.length) return console.log('Queue empty.');
  const cost = jobs.reduce((s, j) => s + PRICE[j.quality], 0);
  console.log(`${jobs.length} job(s), about $${cost.toFixed(2)}${dry ? ' (dry run: prompts only, no API calls)' : ''}\n`);

  if (dry) {
    for (const job of jobs) console.log(`${job.kind} ${job.key} → ${job.bucket}/${job.path} (${job.quality})\n  ${await promptFor(job)}\n`);
    return;
  }
  let done = 0;
  let failed = 0;
  for (const job of jobs) {
    process.stdout.write(`${job.kind} ${job.key} … `);
    const r = await processNext({ jobId: job.id });
    if (!r) { console.log('skipped (no longer pending)'); continue; }
    if (r.ok) { console.log(`done in ${r.seconds}s  ${r.job.public_url}`); done++; }
    else { console.log(`ERROR  ${r.error}`); failed++; }
  }
  console.log(`\n${done} done, ${failed} failed.`);
  if (done) console.log('Mobile picks new renders up on the next build or OTA: cd projectfood-mobile && node scripts/build-assets.mjs');
}
