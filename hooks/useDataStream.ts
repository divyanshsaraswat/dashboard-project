'use client';

import { useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { generateTick } from '@/lib/dataGenerator';

export function useDataStream(onData: (p: DataPoint) => void, intervalMs = 100) {
  const lastRef = useRef<DataPoint>();
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    let active = true;
    const id = setInterval(() => {
      if (!active) return;
      const next = generateTick(lastRef.current);
      lastRef.current = next;
      onDataRef.current(next);
    }, intervalMs);
    return () => { active = false; clearInterval(id); };
  }, [intervalMs]);
}

