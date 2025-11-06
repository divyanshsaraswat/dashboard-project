'use client';

import { useMemo, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { useVirtualization } from '@/hooks/useVirtualization';

export function DataTable({ data }: { data: DataPoint[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rowHeight = 24; const viewportHeight = 300;
  const { start, end, offsetTop, height, setScrollTop } = useVirtualization(data.length, rowHeight, viewportHeight, 8);
  const rows = useMemo(() => data.slice(start, end), [data, start, end]);
  return (
    <div ref={viewportRef} style={{ height: viewportHeight, overflow: 'auto', border: '1px solid #1f242d', borderRadius: 8 }} onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}>
      <div style={{ height, position: 'relative' }}>
        <table style={{ position: 'absolute', top: offsetTop, left: 0, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ position: 'sticky', top: -offsetTop, background: '#0f172a' }}>
              <th style={th}>#</th>
              <th style={th}>Timestamp</th>
              <th style={th}>Value</th>
              <th style={th}>Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={start + i} style={{ height: rowHeight }}>
                <td style={td}>{start + i + 1}</td>
                <td style={td}>{new Date(p.timestamp).toLocaleTimeString()}</td>
                <td style={td}>{p.value.toFixed(3)}</td>
                <td style={td}>{p.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #1f242d', position: 'sticky', top: 0 };
const td: React.CSSProperties = { padding: '4px 8px', borderBottom: '1px solid #1f242d' };

