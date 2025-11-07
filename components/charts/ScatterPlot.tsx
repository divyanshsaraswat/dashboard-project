'use client';

import { memo, useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas, drawAxes, drawGrid, Viewport } from '@/lib/canvasUtils';

function ScatterPlotBase({ data, color = '#facc15' }: { data: DataPoint[]; color?: string }) {
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
        let min = data[0]!.value, max = data[0]!.value;
        let tMin = data[0]!.timestamp, tMax = data[data.length - 1]!.timestamp;
        for (let i = 1; i < data.length; i++) { const v = data[i]!.value; if (v < min) min = v; if (v > max) max = v; }
        const vp: Viewport = {
          xMin: tMin,
          xMax: tMax,
          yMin: min - (max - min) * 0.1,
          yMax: max + (max - min) * 0.1
        };
        ctx.scale(dpr, dpr);
        const { chartX, chartY, chartWidth, chartHeight } = drawAxes(ctx, vp, displayWidth, displayHeight);
        drawGrid(ctx, chartX, chartY, chartWidth, chartHeight, vp);
        const xScale = chartWidth / Math.max(1, tMax - tMin);
        const yScale = chartHeight / Math.max(1e-6, max - min);
        ctx.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
          const p = data[i]!;
          const x = chartX + (p.timestamp - tMin) * xScale;
          const y = chartY + chartHeight - (p.value - min) * yScale;
          ctx.fillRect(x - 1, y - 1, 3, 3);
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
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e6e8eb' }}>Scatter Plot - Value vs Time</h4>
      <canvas ref={canvasRef} style={{ width: '100%', height: 'calc(100% - 24px)', display: 'block' }} />
    </div>
  );
}

export const ScatterPlot = memo(ScatterPlotBase);

