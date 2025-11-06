import { DataPoint } from './types';

export function generateInitialDataset(numPoints: number, startTs = Date.now() - 60_000): DataPoint[] {
  const points: DataPoint[] = [];
  let value = 100;
  for (let i = 0; i < numPoints; i++) {
    value += (Math.random() - 0.5) * 2;
    points.push({
      timestamp: startTs + i * 6, // ~10k points over 60s
      value,
      category: i % 2 === 0 ? 'A' : 'B'
    });
  }
  return points;
}

export function generateTick(prev: DataPoint | undefined): DataPoint {
  const now = Date.now();
  const base = prev?.value ?? 100;
  const value = base + (Math.random() - 0.5) * 3;
  return {
    timestamp: now,
    value,
    category: Math.random() > 0.5 ? 'A' : 'B'
  };
}

export function aggregate(points: DataPoint[], windowMs: number): DataPoint[] {
  if (points.length === 0) return points;
  const out: DataPoint[] = [];
  let bucketStart = Math.floor(points[0].timestamp / windowMs) * windowMs;
  let acc = 0;
  let count = 0;
  let lastCategory = 'A';
  for (const p of points) {
    const b = Math.floor(p.timestamp / windowMs) * windowMs;
    if (b !== bucketStart) {
      out.push({ timestamp: bucketStart, value: acc / Math.max(count, 1), category: lastCategory });
      bucketStart = b;
      acc = 0;
      count = 0;
    }
    acc += p.value;
    count++;
    lastCategory = p.category;
  }
  out.push({ timestamp: bucketStart, value: acc / Math.max(count, 1), category: lastCategory });
  return out;
}

