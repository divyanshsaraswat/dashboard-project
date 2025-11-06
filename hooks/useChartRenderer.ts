'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Viewport, resizeCanvasToDisplaySize, mapToPx, clearCanvas, drawLine } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

export function useChartRenderer(points: DataPoint[], color = '#5eead4') {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const vpRef = useRef<Viewport>({
    xMin: points.length ? points[0].timestamp : Date.now() - 60_000,
    xMax: points.length ? points[points.length - 1].timestamp : Date.now(),
    yMin: -Infinity,
    yMax: Infinity
  });

  const setCanvas = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef.current = el;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const { width, height } = resizeCanvasToDisplaySize(canvas);
      if (points.length) {
        let yMin = points[0].value, yMax = points[0].value;
        for (let i = 1; i < points.length; i++) {
          const v = points[i].value;
          if (v < yMin) yMin = v;
          if (v > yMax) yMax = v;
        }
        const vp = vpRef.current;
        vp.xMin = points[0].timestamp;
        vp.xMax = points[points.length - 1].timestamp;
        vp.yMin = yMin - 1;
        vp.yMax = yMax + 1;
        const mapped = mapToPx(points, vp, width, height);
        clearCanvas(ctx);
        drawLine(ctx, mapped.x, mapped.y, color);
      } else {
        clearCanvas(ctx);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [points, color]);

  return { setCanvas };
}

