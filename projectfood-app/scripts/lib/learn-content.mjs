// Shared loader for the learn content folder (projectfood-app/content/learn).
//
// Layout:  content/learn/<internal-slug>/article.json   { type, pillar, display_order, emoji, cover_image_url }
//          content/learn/<internal-slug>/<locale>.md    YAML front matter + Markdown body
//
// The internal slug (folder name) is `learn_articles.slug`, the stable key that `related`,
// `pillar` and `--only` refer to. The public URL segment per locale is the front matter `slug`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { load as yamlLoad } from 'js-yaml';

export const LOCALES = ['en', 'nl', 'it'];
export const LEARN_BASE = { en: 'learn', nl: 'leer', it: 'impara' };
export const SITE = 'https://projectfood.dev';

export const RULES = {
  metaTitleMax: 55, // the layout appends " | Project Food"
  metaDescriptionMin: 120,
  metaDescriptionMax: 155,
  faqMin: 4,
  faqMax: 6,
  relatedCount: 2,
  words: { pillar: [1500, 2500], cluster: [900, 1500] },
  wordsPerMinute: 200,
  slug: /^[a-z0-9]+(-[a-z0-9]+)*$/,
  // Errors in title, subtitle, meta, body and FAQ (citations exempt).
  banned: [
    { re: /!/, why: 'exclamation mark' },
    { re: /—/, why: 'em dash' },
    { re: /\bstamps?\b/i, why: '"stamp": the word is achievement' },
    { re: /\b(kids|children'?s?) app\b/i, why: '"kids app": a family app on the parent\'s phone' },
    { re: /\bapp (for|voor|per) (kids|children|kinderen|bambini)\b/i, why: '"app for kids": a family app' },
    { re: /\b(boosts?|boosting|improves?|improving|strengthens?)\b[^.]{0,40}\b(gut|immune|immunity|microbiome)/i, why: 'health claim' },
    { re: /\b(darmflora|weerstand|immuunsysteem)\b[^.]{0,40}\b(verbeter|versterk)/i, why: 'health claim (nl)' },
    { re: /\b(verbeter|versterk)[a-z]*\b[^.]{0,40}\b(darmflora|weerstand|immuunsysteem)/i, why: 'health claim (nl)' },
    { re: /\b(migliora|rafforza)[a-z]*\b[^.]{0,40}\b(flora|intestin|immunitari|difese)/i, why: 'health claim (it)' },
    { re: /\b(cure|cures|cured|curing)\b/i, why: '"cure"' },
    { re: /\bgenee[sz]/i, why: '"genezen"' },
    { re: /\bguarir|\bguarisc/i, why: '"guarire"' },
    { re: /\bdetox/i, why: '"detox"' },
    { re: /\b(guaranteed?|gegarandeerd|garantito)\b/i, why: 'a guarantee' },
    { re: /\b(scientifically|wetenschappelijk|scientificamente) (proven|bewezen|provato)\b/i, why: '"scientifically proven"' },
  ],
  // Warnings: read them, decide.
  warned: [
    { re: /\bsuperfood/i, why: '"superfood": a category label, never a benefit' },
    { re: /\bfor kids\b/i, why: '"for kids": search vocabulary is fine on the site, never in the store' },
    { re: /\bpicky eater\b/i, why: '"picky eater": the search phrase, not our label for a child' },
  ],
  slugWarn: { re: /(kind|kinderen|bambin)/, why: '"kind/kinderen/bambini" in a slug (hub-slug rule in seo-site-architecture)' },
};

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontMatter(text) {
  const m = text.match(FM);
  if (!m) throw new Error('no front matter (--- block) at the top of the file');
  const fm = yamlLoad(m[1]) ?? {};
  const body = text.slice(m[0].length).replace(/^\s*\n/, '');
  return { fm, body };
}

export function countWords(md) {
  return md
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#*_>`[\]|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(words) {
  return Math.max(1, Math.round(words / RULES.wordsPerMinute));
}

export function publicPath(locale, pillarSlug, articleSlug) {
  return `/${locale}/${LEARN_BASE[locale]}/${pillarSlug}${articleSlug ? `/${articleSlug}` : ''}`;
}

/** Load every article folder (or one, with `only`). Throws on malformed files. */
export function loadArticles(root, only) {
  if (!existsSync(root)) return [];
  const dirs = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory()).sort();
  const articles = [];
  for (const internal of dirs) {
    if (only && !only.includes(internal)) continue;
    const dir = join(root, internal);
    const metaFile = join(dir, 'article.json');
    if (!existsSync(metaFile)) throw new Error(`${internal}: missing article.json`);
    const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
    const locales = {};
    for (const locale of LOCALES) {
      const file = join(dir, `${locale}.md`);
      if (!existsSync(file)) continue;
      const { fm, body } = parseFrontMatter(readFileSync(file, 'utf8'));
      locales[locale] = { fm, body, file: `content/learn/${internal}/${locale}.md`, words: countWords(body) };
    }
    articles.push({ internal, dir, meta, locales });
  }
  return articles;
}

/** Every public learn path that exists in the content folder, for link resolution. */
export function buildUrlIndex(articles) {
  const byInternal = new Map(articles.map((a) => [a.internal, a]));
  const paths = new Set();
  for (const a of articles) {
    for (const [locale, l] of Object.entries(a.locales)) {
      if (a.meta.type === 'pillar') {
        paths.add(publicPath(locale, l.fm.slug));
      } else {
        const pillar = byInternal.get(a.meta.pillar);
        const pillarSlug = pillar?.locales[locale]?.fm.slug;
        if (pillarSlug) paths.add(publicPath(locale, pillarSlug, l.fm.slug));
      }
    }
  }
  return { byInternal, paths };
}

/** The first paragraph of a body: text before the first blank line, skipping headings. */
export function firstParagraph(body) {
  const blocks = body.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.find((b) => !b.startsWith('#')) ?? '';
}

/** Site-relative learn links in a body: `](/nl/leer/...)`. */
export function internalLinks(body) {
  const out = [];
  const re = /\]\((\/(en|nl|it)\/[^)\s#]+)(?:#[^)\s]*)?\)/g;
  let m;
  while ((m = re.exec(body))) out.push(m[1].replace(/\/$/, ''));
  return out;
}
