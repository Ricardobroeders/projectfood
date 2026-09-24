// Upserts content/learn into learn_articles + learn_article_content through PostgREST with the
// service role key (the tables have SELECT-only policies), then revalidates the site.
//
//   node scripts/learn-publish.mjs --env .env.local [--only <internal-slug>]... [--dry] [--publish] [--no-revalidate]
//
//   (no flag)   upsert the rows; publish state untouched (a new article stays unpublished)
//   --publish   also set is_published = true and published_at (once; a later run keeps the date)
//   --dry       run the checks and print what would be written; needs no keys
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env file; REVALIDATE_SECRET
// (and optionally SITE_URL) to refresh the live pages right away, otherwise they refresh within
// the hour.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SITE, loadArticles, publicPath, readingTime } from './lib/learn-content.mjs';
import { check } from './learn-check.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);
const only = args.flatMap((a, i) => (a === '--only' ? [args[i + 1]] : []));
const dry = has('--dry');
const publish = has('--publish');

const envFile = flag('--env');
if (envFile) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dry && (!SUPABASE_URL || !SERVICE)) throw new Error('missing SUPABASE url/service key (pass --env .env.local)');

const headers = { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' };
async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${path}: ${body}`);
  return body ? JSON.parse(body) : null;
}

// ── Load and check ───────────────────────────────────────────────────────────
const root = resolve(process.cwd(), 'content/learn');
const all = loadArticles(root);
const todo = (only.length ? all.filter((a) => only.includes(a.internal)) : all)
  .sort((a, b) => (a.meta.type === b.meta.type ? a.internal.localeCompare(b.internal) : a.meta.type === 'pillar' ? -1 : 1));
if (todo.length === 0) {
  console.error(only.length ? `no article folder named ${only.join(', ')}` : 'content/learn is empty');
  process.exit(1);
}
const { errors, warnings } = check(todo, all, { publishing: publish });
for (const w of warnings) console.error(`warning  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`error    ${e}`);
  console.error(`${errors.length} error(s); nothing written`);
  process.exit(1);
}

const CONTENT_FIELDS = ['slug', 'title', 'subtitle', 'body_md', 'reading_time_min', 'meta_title', 'meta_description', 'sd_keywords', 'sd_faq', 'sd_citations', 'related_article_slugs'];

function contentRow(articleId, locale, l) {
  const { fm, body, words } = l;
  return {
    article_id: articleId,
    locale,
    slug: fm.slug,
    title: fm.title,
    subtitle: fm.subtitle ?? null,
    body_md: body,
    reading_time_min: readingTime(words),
    meta_title: fm.meta_title ?? null,
    meta_description: fm.meta_description ?? null,
    sd_keywords: Array.isArray(fm.keywords) ? fm.keywords.map(String) : [],
    sd_faq: Array.isArray(fm.faq) ? fm.faq.map((f) => ({ question: String(f.q), answer: String(f.a) })) : null,
    sd_citations: Array.isArray(fm.citations) && fm.citations.length ? fm.citations : null,
    related_article_slugs: Array.isArray(fm.related) ? fm.related.map(String) : [],
  };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const pick = (row, keys) => Object.fromEntries(keys.map((k) => [k, row?.[k] ?? null]));

// ── Publish ──────────────────────────────────────────────────────────────────
let written = 0;
for (const a of todo) {
  const { internal, meta } = a;
  const locales = Object.entries(a.locales).filter(([, l]) => !l.fm.draft);
  if (locales.length === 0) {
    console.error(`skip ${internal}: every locale is draft`);
    continue;
  }

  if (dry) {
    console.log(`\n${internal} (${meta.type}${meta.pillar ? `, pillar ${meta.pillar}` : ''}, order ${meta.display_order ?? 0}${publish ? ', PUBLISH' : ''})`);
    for (const [locale, l] of locales) {
      const row = contentRow('<id>', locale, l);
      console.log(`  ${locale}: /${locale}/…/${row.slug}  ${l.words} words, ${row.reading_time_min} min, title "${row.title}"`);
      console.log(`      meta_title (${row.meta_title.length}) "${row.meta_title}"`);
      console.log(`      meta_description (${row.meta_description.length}) "${row.meta_description}"`);
      console.log(`      keywords ${row.sd_keywords.length}, faq ${row.sd_faq?.length ?? 0}, citations ${row.sd_citations?.length ?? 0}, related [${row.related_article_slugs.join(', ')}]`);
    }
    continue;
  }

  let pillarId = null;
  if (meta.type === 'cluster') {
    const [pillar] = await rest(`learn_articles?slug=eq.${encodeURIComponent(meta.pillar)}&select=id`);
    if (!pillar) throw new Error(`${internal}: pillar "${meta.pillar}" is not in the database yet; publish the pillar first`);
    pillarId = pillar.id;
  }

  const [existing] = await rest(`learn_articles?slug=eq.${encodeURIComponent(internal)}&select=id,is_published,published_at`);
  const articleRow = {
    slug: internal,
    type: meta.type,
    pillar_id: pillarId,
    display_order: Number.isInteger(meta.display_order) ? meta.display_order : 0,
    emoji: meta.emoji ?? null,
    cover_image_url: meta.cover_image_url ?? null,
  };
  if (publish) {
    articleRow.is_published = true;
    articleRow.published_at = existing?.published_at ?? new Date().toISOString();
  }
  const [saved] = await rest('learn_articles?on_conflict=slug', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify([articleRow]),
  });
  const articleId = saved.id;

  for (const [locale, l] of locales) {
    const row = contentRow(articleId, locale, l);
    const [current] = await rest(`learn_article_content?article_id=eq.${articleId}&locale=eq.${locale}&select=${CONTENT_FIELDS.join(',')}`);
    if (current && same(pick(current, CONTENT_FIELDS), pick(row, CONTENT_FIELDS))) {
      console.error(`same ${internal} ${locale} (unchanged, updated_at kept)`);
      continue;
    }
    await rest('learn_article_content?on_conflict=article_id,locale', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify([row]),
    });
    written++;
    console.error(`ok   ${internal} ${locale}`);
  }

  // Read back and print the public URLs
  const contents = await rest(`learn_article_content?article_id=eq.${articleId}&select=locale,slug,reading_time_min&order=locale`);
  const state = publish || existing?.is_published ? 'published' : 'unpublished';
  for (const c of contents) {
    let pillarSlug = c.slug;
    if (meta.type === 'cluster') {
      const [p] = await rest(`learn_article_content?article_id=eq.${pillarId}&locale=eq.${c.locale}&select=slug`);
      pillarSlug = p?.slug;
      if (!pillarSlug) {
        console.error(`     ${c.locale}: pillar has no ${c.locale} row, page will 404`);
        continue;
      }
    }
    console.error(`     ${state}  ${SITE}${publicPath(c.locale, pillarSlug, meta.type === 'cluster' ? c.slug : null)}  (${c.reading_time_min} min)`);
  }
}

if (dry) {
  console.log('\ndry run: nothing written');
  process.exit(0);
}

// ── Revalidate ───────────────────────────────────────────────────────────────
if (written === 0) {
  console.error('nothing changed; no revalidation needed');
} else if (has('--no-revalidate')) {
  console.error('revalidation skipped (--no-revalidate); pages refresh within the hour');
} else if (process.env.REVALIDATE_SECRET) {
  const site = process.env.SITE_URL ?? SITE;
  const res = await fetch(`${site}/api/revalidate`, { method: 'POST', headers: { Authorization: `Bearer ${process.env.REVALIDATE_SECRET}` } });
  console.error(res.ok ? `revalidated ${site}` : `revalidate failed: ${res.status} ${await res.text()}`);
} else {
  console.error('REVALIDATE_SECRET not set; pages refresh within the hour');
}
console.error(`done: ${written} content row(s) written`);
