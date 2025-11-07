'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useTransition } from 'react';
import { DataPoint, DataState, AggregationWindow } from '@/lib/types';
import { aggregate } from '@/lib/dataGenerator';

interface DataContextValue {
  data: DataState;
  setWindow: (start: number, end: number) => void;
  push: (p: DataPoint) => void;
  setAggregation: (win: AggregationWindow | 'raw') => void;
  aggregation: AggregationWindow | 'raw';
  category: 'all' | 'A' | 'B';
  setCategory: (cat: 'all' | 'A' | 'B') => void;
  filteredData: DataPoint[];
}

const DataContext = createContext<DataContextValue | null>(null);

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('DataContext missing');
  return ctx;
}

export function DataProvider({ initialData, children }: { initialData: DataPoint[]; children: React.ReactNode }) {
  const [aggregation, setAgg] = useState<AggregationWindow | 'raw'>('raw');
  const [category, setCategory] = useState<'all' | 'A' | 'B'>('all');
  const bufferRef = useRef<DataPoint[]>(initialData);
  const [data, setData] = useState<DataState>(() => {
    const points = bufferRef.current;
    const windowEnd = points.length ? points[points.length - 1]!.timestamp : Date.now();
    const windowStart = windowEnd - 60_000;
    return { points, windowStart, windowEnd };
  });
  const [, startTransition] = useTransition();

  const setWindow = useCallback((start: number, end: number) => {
    startTransition(() => setData(prev => ({ ...prev, windowStart: start, windowEnd: end })));
  }, []);

  const push = useCallback((p: DataPoint) => {
    bufferRef.current.push(p);
    // Sliding window: keep ~100k max to prevent memory leaks
    if (bufferRef.current.length > 100_000) bufferRef.current.splice(0, bufferRef.current.length - 100_000);
    startTransition(() => setData(prev => ({ ...prev, points: bufferRef.current, windowEnd: p.timestamp })));
  }, []);

  const setAggregation = useCallback((win: AggregationWindow | 'raw') => {
    setAgg(win);
  }, []);

  const value = useMemo<DataContextValue>(() => {
    const { windowStart, windowEnd } = data;
    let points = data.points;
    // filter to window quickly
    const startIdx = Math.max(0, binarySearchTimestamp(points, windowStart));
    const endIdx = binarySearchTimestamp(points, windowEnd, true);
    points = points.slice(startIdx, endIdx);
    if (aggregation !== 'raw') {
      const size = aggregation === '1m' ? 60_000 : aggregation === '5m' ? 300_000 : 3_600_000;
      points = aggregate(points, size);
    }
    // Apply category filter for table view
    const filteredData = category === 'all' ? points : points.filter(p => p.category === category);
    return { 
      data: { points, windowStart, windowEnd }, 
      setWindow, 
      push, 
      setAggregation, 
      aggregation,
      category,
      setCategory,
      filteredData
    };
  }, [data, setWindow, push, aggregation, setAggregation, category]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function binarySearchTimestamp(arr: DataPoint[], ts: number, upper = false) {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const v = arr[mid]!.timestamp;
    if (v < ts || (upper && v === ts)) lo = mid + 1; else hi = mid;
  }
  return upper ? lo : Math.max(0, lo - 1);
}

