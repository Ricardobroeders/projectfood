// Builds the bundled image assets from the Supabase buckets.
//   node scripts/build-assets.mjs            plants + avatars + stamps + cups + notification icon
//   node scripts/build-assets.mjs --skip-download   only regenerate the TS maps
// Originals are ~1.5 MB each; they are cached in scripts/.cache and bundled at 256 px webp.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const CACHE = join(ROOT, 'scripts/.cache');
const PLANTS_URL = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/food-images';
const AVATARS_URL = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/avatars';
// Prize renders for the stamps: bucket `achievements`, file `achievement-<id>.png` (Ricardo's n8n workflow, 2026-09-18).
const STAMPS_URL = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/achievements';
// Card-level cups (bronze 1 taste, silver 5, gold 10) from images/app-ui-images (Ricardo, 2026-09-18).
const CUPS_URL = 'https://lkmfmdehysmbstnfdbyg.supabase.co/storage/v1/object/public/images/app-ui-images';
const CUPS = { bronze: 'Bronze_Cup', silver: 'Silver_Cup', gold: 'Golden_Cup' };
const STAMPS = ['explorer', 'green_machine', 'fruit_basket', 'herb_garden', 'nutcracker', 'bean_counter', 'grain_train', 'bubbly', 'superfood', 'tomato_family', 'rainbow', 'big_dinner', 'table_talk', 'family_of_thirty', 'regulars', 'full_table', 'curious'];
const AVATARS = {
  female: ['Amara', 'Camila', 'Elena', 'Freya', 'Isabella', 'Ngozi', 'Priya', 'Sophia', 'Yuki', 'Zara'],
  male: ['Anton', 'Diego', 'Erik', 'Hiroshi', 'Jamal', 'Kai', 'Liam', 'Marcus', 'Rashid', 'Tobias'],
  unknown: ['Bunny', 'Crocodile', 'Jester', 'Robot', 'Shark'],
};
const SIZE = 256;
const skipDownload = process.argv.includes('--skip-download');

async function fetchCached(url, name) {
  const file = join(CACHE, name);
  if (existsSync(file)) return file;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

async function toWebp(src, dest) {
  await sharp(src).resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
}

async function run() {
  mkdirSync(CACHE, { recursive: true });
  mkdirSync(join(ROOT, 'assets/plants'), { recursive: true });
  for (const g of Object.keys(AVATARS)) mkdirSync(join(ROOT, `assets/avatars/${g}`), { recursive: true });
  mkdirSync(join(ROOT, 'assets/stamps'), { recursive: true });
  mkdirSync(join(ROOT, 'assets/cups'), { recursive: true });

  const catalog = JSON.parse(readFileSync(join(ROOT, 'scripts/catalog.json'), 'utf8'));
  let failed = 0;
  if (!skipDownload) {
    // small concurrency keeps the bucket happy
    const queue = [...catalog];
    await Promise.all(
      Array.from({ length: 6 }, async () => {
        for (let item = queue.shift(); item; item = queue.shift()) {
          const dest = join(ROOT, `assets/plants/${item.slug}.webp`);
          if (existsSync(dest)) continue;
          try {
            const src = await fetchCached(`${PLANTS_URL}/${item.file}`, item.file);
            await toWebp(src, dest);
            process.stdout.write(`plant ${item.slug}\n`);
          } catch (e) {
            failed++;
            process.stderr.write(`FAILED ${item.slug}: ${e.message}\n`);
          }
        }
      }),
    );
    for (const [group, names] of Object.entries(AVATARS)) {
      for (const name of names) {
        const dest = join(ROOT, `assets/avatars/${group}/${name}.webp`);
        if (existsSync(dest)) continue;
        try {
          const src = await fetchCached(`${AVATARS_URL}/${group}/${name}.png`, `avatar-${group}-${name}.png`);
          await toWebp(src, dest);
          process.stdout.write(`avatar ${group}/${name}\n`);
        } catch (e) {
          failed++;
          process.stderr.write(`FAILED avatar ${group}/${name}: ${e.message}\n`);
        }
      }
    }
    // Stamps: a missing render is reported, not fatal, so the set can grow one file at a time.
    for (const id of STAMPS) {
      const dest = join(ROOT, `assets/stamps/${id}.webp`);
      if (existsSync(dest)) continue;
      try {
        const src = await fetchCached(`${STAMPS_URL}/achievement-${id}.png`, `stamp-${id}.png`);
        await toWebp(src, dest);
        process.stdout.write(`stamp ${id}\n`);
      } catch (e) {
        process.stderr.write(`missing stamp ${id}: ${e.message}\n`);
      }
    }
    for (const [level, file] of Object.entries(CUPS)) {
      const dest = join(ROOT, `assets/cups/${level}.webp`);
      if (existsSync(dest)) continue;
      try {
        const src = await fetchCached(`${CUPS_URL}/${file}.png`, `cup-${level}.png`);
        await toWebp(src, dest);
        process.stdout.write(`cup ${level}\n`);
      } catch (e) {
        failed++;
        process.stderr.write(`FAILED cup ${level}: ${e.message}\n`);
      }
    }
    // Android notification glyph: 96x96, white on transparent, from the splash icon silhouette.
    const glyph = join(ROOT, 'assets/images/notification-icon.png');
    if (!existsSync(glyph)) {
      const alpha = await sharp(join(ROOT, 'assets/images/splash-icon.png')).resize(96, 96, { fit: 'inside' }).ensureAlpha().extractChannel('alpha').toBuffer();
      await sharp({ create: { width: 96, height: 96, channels: 3, background: '#FFFFFF' } })
        .joinChannel(alpha)
        .png()
        .toFile(glyph);
      process.stdout.write('notification icon\n');
    }
  }

  // TS maps -------------------------------------------------------------------------------
  const plantLines = catalog
    .filter((p) => existsSync(join(ROOT, `assets/plants/${p.slug}.webp`)))
    .map((p) => `  '${p.slug}': require('@/assets/plants/${p.slug}.webp'),`);
  writeFileSync(
    join(ROOT, 'src/data/plantImages.generated.ts'),
    `// Generated by scripts/build-assets.mjs. Do not edit.\nimport type { ImageSourcePropType } from 'react-native';\n\nexport const PLANT_IMAGES: Record<string, ImageSourcePropType> = {\n${plantLines.join('\n')}\n};\n`,
  );
  const avatarLines = Object.entries(AVATARS).flatMap(([g, names]) =>
    names.map((n) => `  '${g}/${n}': require('@/assets/avatars/${g}/${n}.webp'),`),
  );
  writeFileSync(
    join(ROOT, 'src/data/avatars.ts'),
    `// Generated by scripts/build-assets.mjs. Do not edit.\nimport type { ImageSourcePropType } from 'react-native';\n\nexport type AvatarGroup = 'female' | 'male' | 'unknown';\nexport const AVATAR_GROUPS: Record<AvatarGroup, string[]> = ${JSON.stringify(AVATARS, null, 2).replace(/"/g, "'")};\n/** key = '<group>/<Name>', the same value user_settings.custom_avatar_image used in the PWA. */\nexport const AVATAR_IMAGES: Record<string, ImageSourcePropType> = {\n${avatarLines.join('\n')}\n};\n`,
  );
  const stampLines = STAMPS.filter((id) => existsSync(join(ROOT, `assets/stamps/${id}.webp`))).map((id) => `  ${id}: require('@/assets/stamps/${id}.webp'),`);
  writeFileSync(
    join(ROOT, 'src/data/stampImages.generated.ts'),
    `// Generated by scripts/build-assets.mjs. Do not edit.\nimport type { ImageSourcePropType } from 'react-native';\n\n/** Prize renders by stamp image id (bucket achievements/achievement-<id>.png), 256 px webp with alpha. */\nexport const STAMP_IMAGES: Record<string, ImageSourcePropType> = {\n${stampLines.join('\n')}\n};\n`,
  );
  const cupLines = Object.keys(CUPS).filter((l) => existsSync(join(ROOT, `assets/cups/${l}.webp`))).map((l) => `  ${l}: require('@/assets/cups/${l}.webp'),`);
  writeFileSync(
    join(ROOT, 'src/data/cupImages.generated.ts'),
    `// Generated by scripts/build-assets.mjs. Do not edit.\nimport type { ImageSourcePropType } from 'react-native';\n\nexport type CupLevel = 'bronze' | 'silver' | 'gold';\n/** Card-level cups (images/app-ui-images/<Level>_Cup.png), 256 px webp with alpha. */\nexport const CUP_IMAGES: Record<CupLevel, ImageSourcePropType> = {\n${cupLines.join('\n')}\n};\n`,
  );
  process.stdout.write(`done: ${plantLines.length} plants, ${avatarLines.length} avatars, ${stampLines.length} stamps, ${cupLines.length} cups, ${failed} failed\n`);
  if (failed) process.exit(1);
}
run();
