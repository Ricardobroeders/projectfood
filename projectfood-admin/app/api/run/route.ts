import { NextResponse } from 'next/server';
import { processNext, pendingCount } from '@/lib/pipeline.js';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Runs one pending job per call; the Run button loops until the queue is empty.
export async function POST() {
  try {
    const result = await processNext();
    const remaining = await pendingCount();
    if (!result) return NextResponse.json({ done: null, remaining });
    return NextResponse.json({
      done: { id: result.job.id, kind: result.job.kind, key: result.job.key, ok: result.ok, error: result.error ?? null, seconds: result.seconds },
      remaining,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
