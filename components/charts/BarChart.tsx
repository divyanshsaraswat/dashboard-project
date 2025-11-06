'use client';

import { memo, useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { resizeCanvasToDisplaySize, clearCanvas } from '@/lib/canvasUtils';

function BarChartBase({ data, color = '#93c5fd' }: { data: DataPoint[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    const animate = () => {
      const { width, height } = resizeCanvasToDisplaySize(canvas);
      clearCanvas(ctx);
      if (data.length) {
        const first = data[0]!;
        let min = first.value, max = first.value;
        for (let i = 1; i < data.length; i++) { const v = data[i]!.value; if (v < min) min = v; if (v > max) max = v; }
        const barW = Math.max(1, Math.floor(width / data.length));
        const yScale = height / Math.max(1e-6, max - min);
        ctx.fillStyle = color;
        for (let i = 0; i < data.length; i++) {
          const v = data[i]!.value; const h = (v - min) * yScale; const x = i * barW; const y = height - h;
          ctx.fillRect(x, y, barW - 1, h);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [data, color]);

  return <div className="panel" style={{ height: 280 }}><canvas ref={canvasRef} /></div>;
}

export const BarChart = memo(BarChartBase);

