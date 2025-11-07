'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas } from '@/lib/canvasUtils';

function HeatmapBase({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const grid = useMemo(() => buildGrid(data, 64, 32), [data]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; 
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const animate = () => {
      const { width, height, dpr, displayWidth, displayHeight } = resizeCanvasToDisplaySize(canvas);
      clearCanvas(ctx);
      ctx.scale(dpr, dpr);
      drawGrid(ctx, grid, displayWidth, displayHeight);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [grid]);

  return (
    <div className="panel" style={{ height: 280, minHeight: 280 }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e6e8eb' }}>Heatmap - Data Density</h4>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'calc(100% - 24px)', display: 'block' }} />
    </div>
  );
}

function buildGrid(data: DataPoint[], cols: number, rows: number) {
  if (data.length === 0) return { cols, rows, values: new Float32Array(cols * rows) };
  let min = data[0]!.value, max = data[0]!.value;
  const tMin = data[0]!.timestamp, tMax = data[data.length - 1]!.timestamp;
  for (let i = 1; i < data.length; i++) { const v = data[i]!.value; if (v < min) min = v; if (v > max) max = v; }
  const values = new Float32Array(cols * rows);
  const yScale = rows / Math.max(1e-6, max - min);
  const xScale = cols / Math.max(1, tMax - tMin);
  for (let i = 0; i < data.length; i++) {
    const p = data[i]!;
    const cx = Math.min(cols - 1, Math.max(0, Math.floor((p.timestamp - tMin) * xScale)));
    const cy = Math.min(rows - 1, Math.max(0, rows - 1 - Math.floor((p.value - min) * yScale)));
    const idx = cy * cols + cx;
    const current = values[idx] ?? 0;
    values[idx] = current + 1;
  }
  // normalize
  let vmax = 0;
  for (let i = 0; i < values.length; i++) {
    const val = values[i] ?? 0;
    if (val > vmax) vmax = val;
  }
  if (vmax > 0) {
    for (let i = 0; i < values.length; i++) {
      const val = values[i] ?? 0;
      values[i] = val / vmax;
    }
  }
  return { cols, rows, values };
}

function drawGrid(ctx: CanvasRenderingContext2D, grid: { cols: number; rows: number; values: Float32Array }, width: number, height: number) {
  const legendWidth = 20;
  const legendPadding = 10;
  const chartWidth = width - legendWidth - legendPadding * 2;
  const cw = chartWidth / grid.cols;
  const ch = height / grid.rows;
  
  // Draw heatmap grid
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      const v = grid.values[y * grid.cols + x] ?? 0;
      const col = heatColor(v);
      ctx.fillStyle = col;
      ctx.fillRect(x * cw, y * ch, Math.ceil(cw), Math.ceil(ch));
    }
  }
  
  // Draw legend
  const legendX = chartWidth + legendPadding;
  const legendHeight = height * 0.6;
  const legendY = (height - legendHeight) / 2;
  const legendSteps = 50;
  
  // Draw gradient
  for (let i = 0; i < legendSteps; i++) {
    const t = i / (legendSteps - 1);
    const col = heatColor(t);
    ctx.fillStyle = col;
    const y = legendY + (legendSteps - 1 - i) * (legendHeight / legendSteps);
    ctx.fillRect(legendX, y, legendWidth, Math.ceil(legendHeight / legendSteps) + 1);
  }
  
  // Draw legend border
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 1;
  ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);
  
  // Draw legend labels
  ctx.save();
  ctx.font = '10px system-ui';
  ctx.fillStyle = '#98a2b3';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('High', legendX + legendWidth + 5, legendY);
  ctx.fillText('Low', legendX + legendWidth + 5, legendY + legendHeight);
  ctx.fillText('Density', legendX + legendWidth + 5, legendY + legendHeight / 2);
  ctx.restore();
  
  // Draw axis labels
  ctx.save();
  ctx.font = '11px system-ui';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Time', chartWidth / 2, height - 20);
  ctx.restore();
  
  ctx.save();
  ctx.font = '11px system-ui';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Value', 0, 0);
  ctx.restore();
}

function heatColor(t: number) {
  const r = Math.floor(255 * t);
  const g = Math.floor(64 * (1 - t));
  const b = Math.floor(255 * (1 - t));
  return `rgb(${r},${g},${b})`;
}

export const Heatmap = memo(HeatmapBase);

