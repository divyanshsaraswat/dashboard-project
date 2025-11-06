'use client';

import { memo, useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas } from '@/lib/canvasUtils';

function ScatterPlotBase({ data, color = '#facc15' }: { data: DataPoint[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const animate = () => {
      const { width, height } = resizeCanvasToDisplaySize(canvas);
      clearCanvas(ctx);
      if (data.length) {
        let min = data[0]!.value, max = data[0]!.value;
        let tMin = data[0]!.timestamp, tMax = data[data.length - 1]!.timestamp;
        for (let i = 1; i < data.length; i++) { const v = data[i]!.value; if (v < min) min = v; if (v > max) max = v; }
        const xScale = width / Math.max(1, tMax - tMin);
        const yScale = height / Math.max(1e-6, max - min);
        ctx.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
          const p = data[i]!;
          const x = (p.timestamp - tMin) * xScale;
          const y = height - (p.value - min) * yScale;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data, color]);

  return <div className="panel" style={{ height: 280 }}><canvas ref={canvasRef} /></div>;
}

export const ScatterPlot = memo(ScatterPlotBase);

