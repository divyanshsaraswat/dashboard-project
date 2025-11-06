'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas } from '@/lib/canvasUtils';

function HeatmapBase({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const grid = useMemo(() => buildGrid(data, 64, 32), [data]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const animate = () => {
      const { width, height } = resizeCanvasToDisplaySize(canvas);
      clearCanvas(ctx);
      drawGrid(ctx, grid, width, height);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [grid]);

  return <div className="panel" style={{ height: 280 }}><canvas ref={canvasRef} /></div>;
}

function buildGrid(data: DataPoint[], cols: number, rows: number) {
  if (data.length === 0) return { cols, rows, values: new Float32Array(cols * rows) };
  let min = data[0].value, max = data[0].value;
  const tMin = data[0].timestamp, tMax = data[data.length - 1].timestamp;
  for (let i = 1; i < data.length; i++) { const v = data[i].value; if (v < min) min = v; if (v > max) max = v; }
  const values = new Float32Array(cols * rows);
  const yScale = rows / Math.max(1e-6, max - min);
  const xScale = cols / Math.max(1, tMax - tMin);
  for (let i = 0; i < data.length; i++) {
    const p = data[i];
    const cx = Math.min(cols - 1, Math.max(0, Math.floor((p.timestamp - tMin) * xScale)));
    const cy = Math.min(rows - 1, Math.max(0, rows - 1 - Math.floor((p.value - min) * yScale)));
    const idx = cy * cols + cx;
    values[idx] += 1;
  }
  // normalize
  let vmax = 0; for (let i = 0; i < values.length; i++) if (values[i] > vmax) vmax = values[i];
  if (vmax > 0) for (let i = 0; i < values.length; i++) values[i] /= vmax;
  return { cols, rows, values };
}

function drawGrid(ctx: CanvasRenderingContext2D, grid: { cols: number; rows: number; values: Float32Array }, width: number, height: number) {
  const cw = width / grid.cols; const ch = height / grid.rows;
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const v = grid.values[y * grid.cols + x];
      const col = heatColor(v);
      ctx.fillStyle = col;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }
}

function heatColor(t: number) {
  const r = Math.floor(255 * t);
  const g = Math.floor(64 * (1 - t));
  const b = Math.floor(255 * (1 - t));
  return `rgb(${r},${g},${b})`;
}

export const Heatmap = memo(HeatmapBase);

