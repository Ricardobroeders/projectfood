// Every app icon from one master: assets/brand/app-icon-1024.png (the Figma export, a rounded square
// with transparent corners, four pastel quadrants with one clay render each). Run:
//   node scripts/build-icons.mjs
// Outputs (assets/images): icon.png (full-bleed, opaque: iOS and the default), android-icon-background.png
// (the four quadrant colours, full bleed), android-icon-foreground.png (the master at 70% so the launcher
// mask keeps every render), android-icon-monochrome.png (silhouette for Android themed icons),
// splash-icon.png, notification-icon.png (white silhouette, 96 px). Store assets go to assets/brand/store.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'assets/brand/app-icon-1024.png');
const OUT = join(ROOT, 'assets/images');
const STORE = join(ROOT, 'assets/brand/store');
mkdirSync(STORE, { recursive: true });

const S = 1024;
const HALF = S / 2;
const master = sharp(SRC).resize(S, S);
const { data, info } = await master.clone().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => {
  const i = (y * info.width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};
/** Median colour of a small patch, so one stray pixel cannot pick the quadrant colour. */
function patch(cx, cy) {
  const chans = [[], [], []];
  for (let y = cy - 4; y <= cy + 4; y++) for (let x = cx - 4; x <= cx + 4; x++) px(x, y).slice(0, 3).forEach((v, i) => chans[i].push(v));
  return chans.map((c) => c.sort((a, b) => a - b)[Math.floor(c.length / 2)]);
}
// the four quadrant colours, sampled at each quadrant's outer edge at mid height, away from the render and its shadow
const edge = Math.round(S * 0.03);
const quads = [patch(edge, HALF / 2), patch(S - edge, HALF / 2), patch(edge, S - HALF / 2), patch(S - edge, S - HALF / 2)];
const rect = (w, h, [r, g, b], alpha = 1) => ({ create: { width: w, height: h, channels: 4, background: { r, g, b, alpha } } });
const solid = (w, h, c) => sharp(rect(w, h, c)).png().toBuffer();

// 1. background: the four quadrants, full bleed
const bgBuf = await sharp(rect(S, S, quads[0]))
  .composite([
    { input: await solid(HALF, HALF, quads[1]), left: HALF, top: 0 },
    { input: await solid(HALF, HALF, quads[2]), left: 0, top: HALF },
    { input: await solid(HALF, HALF, quads[3]), left: HALF, top: HALF },
  ])
  .png()
  .toBuffer();
await sharp(bgBuf).toFile(join(OUT, 'android-icon-background.png'));

// 2. the default icon: the master over its own colours, so the rounded corners fill in and nothing is transparent
const masterBuf = await master.clone().png().toBuffer();
const iconBuf = await sharp(bgBuf).composite([{ input: masterBuf }]).removeAlpha().png().toBuffer();
await sharp(iconBuf).toFile(join(OUT, 'icon.png'));
await sharp(iconBuf).resize(512, 512).toFile(join(STORE, 'play-icon-512.png'));

// 3. adaptive foreground: the master at 70% on a transparent canvas; the quadrant lines stay on the centre lines,
//    so it sits seamlessly on the background and the renders survive the circle mask
const SAFE = 0.7;
const small = await master.clone().resize(Math.round(S * SAFE)).png().toBuffer();
await sharp(rect(S, S, [0, 0, 0], 0)).composite([{ input: small, gravity: 'centre' }]).png().toFile(join(OUT, 'android-icon-foreground.png'));

// 4. silhouette: white where a pixel differs from its quadrant colour (the render), transparent elsewhere
const mono = Buffer.alloc(S * S * 4);
for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const q = quads[(x >= HALF ? 1 : 0) + (y >= HALF ? 2 : 0)];
    const [r, g, b, a] = px(x, y);
    const on = a > 128 && Math.abs(r - q[0]) + Math.abs(g - q[1]) + Math.abs(b - q[2]) > 90;
    const i = (y * S + x) * 4;
    mono[i] = mono[i + 1] = mono[i + 2] = 255;
    mono[i + 3] = on ? 255 : 0;
  }
}
const monoFull = sharp(mono, { raw: { width: S, height: S, channels: 4 } });
const monoSmall = await monoFull.clone().resize(Math.round(S * SAFE)).png().toBuffer();
await sharp(rect(S, S, [0, 0, 0], 0)).composite([{ input: monoSmall, gravity: 'centre' }]).png().toFile(join(OUT, 'android-icon-monochrome.png'));
await monoFull.clone().resize(96, 96, { fit: 'inside' }).png().toFile(join(OUT, 'notification-icon.png'));

// 5. splash: the rounded master, drawn small on white by expo-splash-screen
await master.clone().resize(512, 512).png().toFile(join(OUT, 'splash-icon.png'));

console.log('quadrant colours', quads.map((c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')));
console.log('icons written to assets/images and assets/brand/store');
