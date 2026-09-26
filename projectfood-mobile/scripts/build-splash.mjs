// Builds the Android/iOS splash icon from Ricardo's export.
//   node scripts/build-splash.mjs
//
// Android 12 and up draw the splash themselves: one centred icon, masked to a circle, on
// `backgroundColor`. The mask keeps only the middle two thirds of the image, so artwork drawn
// edge to edge loses its top and bottom. This scales the whole export into that safe circle and
// pads the rest with the same flat mint as the splash background, which makes the mask edge
// invisible. Re-run it whenever the export changes.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, '../app-logo-export/pineapple.png');
const DEST = join(ROOT, 'assets/images/splash-pineapple.png');
const SIZE = 1024;
/** Two thirds of the canvas: what survives the circular mask. */
const SAFE = 682;
/** Must match `backgroundColor` in the expo-splash-screen plugin config. */
const BG = { r: 0xb3, g: 0xe2, b: 0xd9, alpha: 1 };

if (!existsSync(SRC)) {
  process.stderr.write(`missing ${SRC}\n`);
  process.exit(1);
}

const inner = await sharp(SRC).resize(SAFE, SAFE, { fit: 'inside' }).toBuffer();
await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: BG } })
  .composite([{ input: inner, top: (SIZE - SAFE) / 2, left: (SIZE - SAFE) / 2 }])
  .png()
  .toFile(DEST);

// A stray white row along an edge (Figma has exported one) shows up as a line inside the circle.
const { data, info } = await sharp(DEST).raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => [0, 1, 2].map((c) => data[(y * info.width + x) * info.channels + c]);
const edges = [px(0, 0), px(info.width - 1, 0), px(0, info.height - 1), px(info.width - 1, info.height - 1)];
const clean = edges.every(([r, g, b]) => r === BG.r && g === BG.g && b === BG.b);
process.stdout.write(`${DEST}\n${clean ? 'edges are flat mint' : 'WARNING: an edge is not the background colour'}\n`);
