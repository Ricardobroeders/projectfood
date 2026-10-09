import type { NextConfig } from 'next';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

// Local tool: secrets come from this folder's .env or, failing that, the marketing site's env
// file, so nothing is copied. The dev server binds to 127.0.0.1 (see package.json).
loadEnv({ path: resolve(process.cwd(), '.env'), quiet: true });
loadEnv({ path: resolve(process.cwd(), '../projectfood-app/.env.local'), quiet: true });

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
