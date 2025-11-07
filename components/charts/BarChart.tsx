'use client';

import { memo, useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas, drawAxes, drawGrid, Viewport } from '@/lib/canvasUtils';

function BarChartBase({ data, color = '#93c5fd' }: { data: DataPoint[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; 
    const ctx = canvas.getContext('2d', { alpha: false }); 
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const animate = () => {
      const { width, height, dpr, displayWidth, displayHeight } = resizeCanvasToDisplaySize(canvas);
      clearCanvas(ctx);
      if (data.length) {
        const first = data[0]!;
        let min = first.value, max = first.value;
        for (let i = 1; i < data.length; i++) { const v = data[i]!.value; if (v < min) min = v; if (v > max) max = v; }
        const vp: Viewport = {
          xMin: data[0]!.timestamp,
          xMax: data[data.length - 1]!.timestamp,
          yMin: min - (max - min) * 0.1,
          yMax: max + (max - min) * 0.1
        };
        ctx.scale(dpr, dpr);
        const { chartX, chartY, chartWidth, chartHeight } = drawAxes(ctx, vp, displayWidth, displayHeight);
        drawGrid(ctx, chartX, chartY, chartWidth, chartHeight, vp);
        const xScale = chartWidth / Math.max(1, vp.xMax - vp.xMin);
        const yScale = chartHeight / Math.max(1e-6, vp.yMax - vp.yMin);
        const timeStep = (vp.xMax - vp.xMin) / data.length;
        const barW = Math.max(2, Math.floor(timeStep * xScale * 0.8)); // 80% of spacing, min 2px
        ctx.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
          const p = data[i]!;
          const v = p.value;
          const h = (v - vp.yMin) * yScale;
          const x = chartX + (p.timestamp - vp.xMin) * xScale - barW / 2;
          const y = chartY + chartHeight - h;
          if (x + barW >= chartX && x <= chartX + chartWidth && h > 0) {
            ctx.fillRect(x, y, barW, h);
          }
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data, color]);

  return (
    <div className="panel" style={{ height: 280, minHeight: 280 }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e6e8eb' }}>Bar Chart - Value Distribution</h4>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'calc(100% - 24px)', display: 'block' }} />
    </div>
  );
}

export const BarChart = memo(BarChartBase);

