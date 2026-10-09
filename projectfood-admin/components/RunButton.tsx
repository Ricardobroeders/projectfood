'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Play } from 'lucide-react';

export function RunButton({ pending, cost }: { pending: number; cost: number }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function run() {
    setRunning(true);
    setLog([]);
    try {
      for (;;) {
        const res = await fetch('/api/run', { method: 'POST' });
        const body = await res.json();
        if (!res.ok) { setLog((l) => [...l, `Error: ${body.error}`]); break; }
        if (!body.done) break;
        const d = body.done;
        setLog((l) => [...l, d.ok ? `${d.kind} ${d.key}: done in ${d.seconds}s` : `${d.kind} ${d.key}: ${d.error}`]);
        router.refresh();
        if (body.remaining === 0) break;
      }
    } finally {
      setRunning(false);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button className="btn" onClick={run} disabled={running || pending === 0}>
        <Play size={16} strokeWidth={2.5} />
        {running ? 'Generating…' : pending === 0 ? 'Queue empty' : `Run ${pending} · about $${cost.toFixed(2)}`}
      </button>
      {log.length > 0 && (
        <ul className="meta text-right">
          {log.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      )}
    </div>
  );
}
