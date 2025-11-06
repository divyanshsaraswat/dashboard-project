'use client';

import { useMemo } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';

export function TimeRangeSelector() {
  const { data, setWindow } = useDataContext();
  const ranges = useMemo(() => ([
    { label: '1m', dur: 60_000 },
    { label: '5m', dur: 300_000 },
    { label: '1h', dur: 3_600_000 }
  ]), []);
  const set = (dur: number) => setWindow(Date.now() - dur, Date.now());
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {ranges.map(r => (
        <button key={r.label} onClick={() => set(r.dur)} style={{ padding: '6px 10px', borderRadius: 8, background: '#0f172a', color: '#cbd5e1', border: '1px solid #1f242d' }}>
          {r.label}
        </button>
      ))}
      <div className="badge">Window: {Math.round((data.windowEnd - data.windowStart) / 1000)}s</div>
    </div>
  );
}

