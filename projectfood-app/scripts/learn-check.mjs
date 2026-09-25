// Lint for content/learn. Run before every publish; learn-publish.mjs runs it too.
//
//   node scripts/learn-check.mjs [--only <internal-slug>]... [--publishing]
//
// Errors exit 1. Warnings are printed and left to the writer. With --publishing (what
// learn-publish.mjs passes for --publish) unresolved internal links, missing cluster links on a
// pillar and missing related locales become errors instead of warnings, so a pillar draft may
// link the clusters that are still planned, but nothing goes live with a dead link.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  RULES, buildUrlIndex, firstParagraph, internalLinks, loadArticles, publicPath,
} from './lib/learn-content.mjs';

const text = (s) => (typeof s === 'string' ? s : '');

export function check(articles, all, { publishing = false } = {}) {
  const errors = [];
  const warnings = [];
  const err = (file, msg) => errors.push(`${file}: ${msg}`);
  const warn = (file, msg) => warnings.push(`${file}: ${msg}`);
  const soft = publishing ? err : warn;
  const { byInternal, paths } = buildUrlIndex(all);

  // Public slugs are unique per locale across the whole folder (and the DB enforces it too).
  const seen = new Map();
  for (const a of all) {
    for (const [locale, l] of Object.entries(a.locales)) {
      const key = `${locale}:${l.fm.slug}`;
      if (seen.has(key) && seen.get(key) !== a.internal) err(l.file, `slug "${l.fm.slug}" is also used by ${seen.get(key)} in ${locale}`);
      seen.set(key, a.internal);
    }
  }

  for (const a of articles) {
    const { meta, internal } = a;
    const metaFile = `content/learn/${internal}/article.json`;
    if (!['pillar', 'cluster'].includes(meta.type)) err(metaFile, 'type must be "pillar" or "cluster"');
    if (meta.type === 'cluster' && !meta.pillar) err(metaFile, 'a cluster needs "pillar" (the pillar\'s internal slug)');
    if (meta.type === 'cluster' && meta.pillar && !byInternal.has(meta.pillar)) err(metaFile, `pillar "${meta.pillar}" has no folder`);
    if (meta.type === 'pillar' && meta.pillar) err(metaFile, 'a pillar has no "pillar"');
    if (!Number.isInteger(meta.display_order)) warn(metaFile, 'display_order missing (defaults to 0)');
    if (Object.keys(a.locales).length === 0) warn(metaFile, 'no locale files yet');

    for (const [locale, l] of Object.entries(a.locales)) {
      const { fm, body, file, words } = l;

      // Slug
      if (!RULES.slug.test(text(fm.slug))) err(file, `slug missing or malformed: "${fm.slug ?? ''}"`);
      else if (RULES.slugWarn.re.test(fm.slug)) warn(file, RULES.slugWarn.why);

      // Required fields and meta lengths
      for (const k of ['title', 'meta_title', 'meta_description']) if (!text(fm[k]).trim()) err(file, `${k} missing`);
      if (!text(fm.subtitle).trim()) warn(file, 'subtitle missing (the dek under the H1)');
      const mt = text(fm.meta_title).length;
      if (mt > RULES.metaTitleMax) err(file, `meta_title is ${mt} characters, max ${RULES.metaTitleMax} (the layout appends " | Project Food")`);
      const md = text(fm.meta_description).length;
      if (md && (md < RULES.metaDescriptionMin || md > RULES.metaDescriptionMax)) {
        err(file, `meta_description is ${md} characters, want ${RULES.metaDescriptionMin} to ${RULES.metaDescriptionMax}`);
      }
      if (!Array.isArray(fm.keywords) || fm.keywords.length === 0) warn(file, 'keywords empty');

      // FAQ
      const faq = Array.isArray(fm.faq) ? fm.faq : [];
      if (faq.length < RULES.faqMin || faq.length > RULES.faqMax) err(file, `faq has ${faq.length} items, want ${RULES.faqMin} to ${RULES.faqMax}`);
      faq.forEach((f, i) => {
        if (!text(f?.q).trim() || !text(f?.a).trim()) err(file, `faq[${i}] needs "q" and "a"`);
        else if (/[*_[#]/.test(f.a)) warn(file, `faq[${i}] answer contains markdown; answers render as plain text`);
      });

      // Length
      const [min, max] = RULES.words[meta.type] ?? [0, Infinity];
      if (words < min) err(file, `${words} words, a ${meta.type} needs at least ${min}`);
      else if (words > max) warn(file, `${words} words, above the ${max} guideline`);

      // Related (internal slugs)
      const related = Array.isArray(fm.related) ? fm.related : [];
      if (meta.type === 'cluster' && related.length !== RULES.relatedCount) {
        warn(file, `related has ${related.length} entries, want ${RULES.relatedCount} internal slugs`);
      }
      for (const r of related) {
        if (r === internal) err(file, 'related links to itself');
        else if (!byInternal.has(r)) warn(file, `related "${r}" has no folder yet (the page shows only published related articles)`);
        else if (!byInternal.get(r).locales[locale]) warn(file, `related "${r}" has no ${locale} file yet (the page shows only published related articles)`);
      }

      // A cluster needs its pillar in the same locale
      let pillarPath = null;
      if (meta.type === 'cluster' && meta.pillar) {
        const pillarSlug = byInternal.get(meta.pillar)?.locales[locale]?.fm.slug;
        if (!pillarSlug) err(file, `pillar "${meta.pillar}" has no ${locale} file`);
        else pillarPath = publicPath(locale, pillarSlug);
      }

      // Links
      const links = internalLinks(body);
      for (const link of links) {
        if (!link.startsWith(`/${locale}/`)) warn(file, `link ${link} points at another locale`);
        if (!paths.has(link)) soft(file, `link ${link} does not resolve to a page in content/learn (still planned?)`);
      }
      if (meta.type === 'cluster' && pillarPath && !internalLinks(firstParagraph(body)).includes(pillarPath)) {
        err(file, `the first paragraph must link the pillar (${pillarPath})`);
      }
      if (meta.type === 'pillar' && fm.slug) {
        for (const c of all) {
          if (c.meta.type !== 'cluster' || c.meta.pillar !== internal || !c.locales[locale]) continue;
          const clusterPath = publicPath(locale, fm.slug, c.locales[locale].fm.slug);
          if (!links.includes(clusterPath)) soft(file, `pillar body does not link cluster ${c.internal} (${clusterPath})`);
        }
      }

      // Body shape
      if (/^#\s/m.test(body)) err(file, 'body contains an H1; the title is the H1, use ## and ###');
      const questionLines = body.split('\n').filter((line) => !line.trim().startsWith('#') && /\?\s*$/.test(line)).length;
      if (questionLines > 0) warn(file, `${questionLines} body line(s) end in a question mark; no rhetorical questions in body text (headings are fine)`);

      // Banned and warned strings (citations exempt)
      const fields = {
        title: fm.title,
        subtitle: fm.subtitle,
        meta_title: fm.meta_title,
        meta_description: fm.meta_description,
        body,
        faq: faq.map((f) => `${text(f?.q)}\n${text(f?.a)}`).join('\n'),
      };
      for (const [name, value] of Object.entries(fields)) {
        const v = text(value);
        if (!v) continue;
        for (const b of RULES.banned) if (b.re.test(v)) err(file, `${name}: ${b.why}`);
        for (const w of RULES.warned) if (w.re.test(v)) warn(file, `${name}: ${w.why}`);
      }

      if (fm.draft) warn(file, 'draft: true, this locale is not uploaded');
    }
  }
  return { errors, warnings };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const only = args.flatMap((a, i) => (a === '--only' ? [args[i + 1]] : []));
  const root = resolve(process.cwd(), 'content/learn');
  const all = loadArticles(root);
  const todo = only.length ? all.filter((a) => only.includes(a.internal)) : all;
  if (todo.length === 0) {
    console.error(only.length ? `no article folder named ${only.join(', ')}` : 'content/learn is empty');
    process.exit(1);
  }
  const { errors, warnings } = check(todo, all, { publishing: args.includes('--publishing') });
  for (const w of warnings) console.log(`warning  ${w}`);
  for (const e of errors) console.log(`error    ${e}`);
  for (const a of todo) {
    for (const [locale, l] of Object.entries(a.locales)) {
      console.log(`${l.file}: ${l.words} words, meta_title ${text(l.fm.meta_title).length}, meta_description ${text(l.fm.meta_description).length}, faq ${Array.isArray(l.fm.faq) ? l.fm.faq.length : 0}, links ${internalLinks(l.body).length} (${locale})`);
    }
  }
  console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}
