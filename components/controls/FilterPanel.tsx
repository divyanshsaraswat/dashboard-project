'use client';

import { useMemo, useState } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';

export function FilterPanel() {
  const { data, setAggregation, aggregation } = useDataContext();
  const [category, setCategory] = useState<'all' | 'A' | 'B'>('all');
  const count = useMemo(() => data.points.length, [data.points.length]);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div className="badge">Points: <strong>{count.toLocaleString()}</strong></div>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Aggregation</span>
        <select value={aggregation} onChange={e => setAggregation(e.target.value as any)}>
          <option value="raw">Raw</option>
          <option value="1m">1 min</option>
          <option value="5m">5 min</option>
          <option value="1h">1 hour</option>
        </select>
      </label>
      <label style={{ display: 'grid', gap: 4 }}>
        <span>Category</span>
        <select value={category} onChange={e => setCategory(e.target.value as any)}>
          <option value="all">All</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>
      <small style={{ color: 'var(--muted)' }}>Note: Category filter applies to table view.</small>
    </div>
  );
}

