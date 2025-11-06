'use client';

import { useMemo, useState } from 'react';

export function useVirtualization(total: number, rowHeight = 24, viewportHeight = 300, overscan = 8) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const end = Math.min(total, start + visibleCount + overscan * 2);
  const offsetTop = start * rowHeight;
  const height = total * rowHeight;
  return useMemo(() => ({ start, end, offsetTop, height, setScrollTop }), [start, end, offsetTop, height]);
}

