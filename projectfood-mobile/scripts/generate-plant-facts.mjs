// Generates one kid fact and one parent tip per plant in en/nl/it and upserts them into plant_facts
// with status 'generated' (Ricardo reviews later; --review prints what is there).
//
//   node scripts/generate-plant-facts.mjs --env ../projectfood-app/.env.local [--limit 5] [--only tomato] [--dry] [--force]
//   node scripts/generate-plant-facts.mjs --env ../projectfood-app/.env.local --review > facts.csv
//
// Needs OPENAI_API_KEY and SUPABASE_SERVICE_ROLE_KEY (+ NEXT_PUBLIC_SUPABASE_URL) in the env file.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);

const envFile = flag('--env');
if (envFile) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI = process.env.OPENAI_API_KEY;
if (!SUPABASE_URL || !SERVICE) throw new Error('missing SUPABASE url/service key');

const LOCALES = ['en', 'nl', 'it'];
const LANG = { en: 'English', nl: 'Dutch', it: 'Italian' };
const MODEL = 'gpt-4o-mini';
const headers = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' };

async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${path}: ${text}`);
  return text ? JSON.parse(text) : null;
}

const plants = await rest('plants?select=id,slug,name,category,botanical_family,color,season_months,is_superfood,subcategory&is_active=eq.true&order=slug');
const existing = await rest('plant_facts?select=plant_id,locale');
const have = new Set(existing.map((f) => `${f.plant_id}:${f.locale}`));

if (has('--review')) {
  const rows = await rest('plant_facts?select=plant_id,locale,kid_fact,parent_tip,status&order=plant_id,locale');
  const bySlug = new Map(plants.map((p) => [p.id, p.slug]));
  console.log('slug,locale,status,kid_fact,parent_tip');
  for (const r of rows) console.log([bySlug.get(r.plant_id), r.locale, r.status, JSON.stringify(r.kid_fact), JSON.stringify(r.parent_tip)].join(','));
  process.exit(0);
}
if (!OPENAI) throw new Error('missing OPENAI_API_KEY');

let todo = plants.filter((p) => has('--force') || LOCALES.some((l) => !have.has(`${p.id}:${l}`)));
const only = flag('--only');
if (only) todo = todo.filter((p) => p.slug === only);
const limit = Number(flag('--limit') ?? 0);
if (limit) todo = todo.slice(0, limit);
console.error(`${todo.length} plants to generate`);

const SYSTEM = `You write two tiny texts for a family food app where kids (ages 4–10) taste plants and collect cards. Rules:
- kid_fact: one playful, TRUE fact about the plant a child would love to tell at the table. Max 140 characters. No health or nutrition claims, no "good for you", no calories. Concrete and surprising (where it grows, how it looks, history, a fun comparison).
- parent_tip: one practical serving idea that makes a child likely to taste it (texture, temperature, cut, pairing, involvement). Max 200 characters. No medical claims.
- Same meaning in every language, written natively (not translated word by word). Use the plant name the locale uses.
Return strict JSON: {"en":{"kid_fact":"","parent_tip":""},"nl":{...},"it":{...}}`;

async function generate(p) {
  const names = await rest(`plant_translations?select=locale,name&plant_id=eq.${p.id}`);
  const nameFor = (l) => names.find((n) => n.locale === l)?.name ?? p.name;
  const user = `Plant: ${p.name} (nl: ${nameFor('nl')}, it: ${nameFor('it')}). Category: ${p.category}${p.subcategory ? ` / ${p.subcategory}` : ''}. Botanical family: ${p.botanical_family ?? 'unknown'}. Colour: ${p.color ?? 'n/a'}. Season months: ${p.season_months?.join(',') ?? 'all year'}.`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, temperature: 0.8, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }] }),
  });
  if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`);
  const out = await res.json();
  const parsed = JSON.parse(out.choices[0].message.content);
  const rows = [];
  for (const l of LOCALES) {
    const f = parsed[l];
    if (!f?.kid_fact || !f?.parent_tip) throw new Error(`incomplete ${p.slug} ${l}`);
    rows.push({ plant_id: p.id, locale: l, kid_fact: String(f.kid_fact).trim().slice(0, 200), parent_tip: String(f.parent_tip).trim().slice(0, 260), status: 'generated', model: MODEL, generated_at: new Date().toISOString() });
  }
  return rows;
}

let done = 0, failed = 0;
const queue = [...todo];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let p = queue.shift(); p; p = queue.shift()) {
      try {
        const rows = await generate(p);
        if (has('--dry')) console.log(JSON.stringify(rows, null, 1));
        else await rest('plant_facts?on_conflict=plant_id,locale', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(rows) });
        done++;
        console.error(`ok ${p.slug} (${done}/${todo.length})`);
      } catch (e) {
        failed++;
        console.error(`FAILED ${p.slug}: ${e.message}`);
      }
    }
  }),
);
console.error(`done: ${done} plants, ${failed} failed`);
process.exit(failed ? 1 : 0);
