/**
 * Dev-only timing. Every call is a no-op in a release build. Lines go to the Metro terminal as
 * "[perf] ..." so a test session on the phone can be read back from the dev-server log.
 */
const marks = new Map<string, number>();

export function perfStart(name: string) {
  if (!__DEV__) return;
  marks.set(name, performance.now());
}

export function perfEnd(name: string, note?: string) {
  if (!__DEV__) return;
  const t0 = marks.get(name);
  if (t0 === undefined) return;
  marks.delete(name);
  console.log(`[perf] ${name}: ${Math.round(performance.now() - t0)} ms${note ? ` (${note})` : ''}`);
}

// Image loads are summarised per burst: how many, the average, the slowest, and the burst length.
let burst: { n: number; total: number; max: number; first: number; last: number } | null = null;
let flush: ReturnType<typeof setTimeout> | null = null;
let originLogged = false;

export function perfImage(ms: number, uri?: string) {
  if (!__DEV__) return;
  const now = performance.now();
  if (!burst) burst = { n: 0, total: 0, max: 0, first: now - ms, last: now };
  burst.n += 1;
  burst.total += ms;
  burst.max = Math.max(burst.max, ms);
  burst.last = now;
  if (!originLogged && uri) {
    originLogged = true;
    console.log(`[perf] images served from ${uri.replace(/\/assets.*$/, '')}`);
  }
  if (flush) clearTimeout(flush);
  flush = setTimeout(() => {
    if (!burst) return;
    console.log(`[perf] images: ${burst.n} loaded, avg ${Math.round(burst.total / burst.n)} ms, slowest ${Math.round(burst.max)} ms, burst ${Math.round(burst.last - burst.first)} ms`);
    burst = null;
    flush = null;
  }, 700);
}
