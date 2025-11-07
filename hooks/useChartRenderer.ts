'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Viewport, resizeCanvasToDisplaySize, mapToPx, clearCanvas, drawLine, drawAxes, drawGrid } from '@/lib/canvasUtils';
import { DataPoint } from '@/lib/types';

export function useChartRenderer(points: DataPoint[], color = '#5eead4') {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const vpRef = useRef<Viewport>({
    xMin: points.length ? points[0]!.timestamp : Date.now() - 60_000,
    xMax: points.length ? points[points.length - 1]!.timestamp : Date.now(),
    yMin: -Infinity,
    yMax: Infinity
  });

  const setCanvas = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef.current = el;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const animate = () => {
      const { width, height, dpr, displayWidth, displayHeight } = resizeCanvasToDisplaySize(canvas);
      if (points.length) {
        let yMin = points[0]!.value, yMax = points[0]!.value;
        for (let i = 1; i < points.length; i++) {
          const v = points[i]!.value;
          if (v < yMin) yMin = v;
          if (v > yMax) yMax = v;
        }
        const vp = vpRef.current;
        vp.xMin = points[0]!.timestamp;
        vp.xMax = points[points.length - 1]!.timestamp;
        vp.yMin = yMin - (yMax - yMin) * 0.1;
        vp.yMax = yMax + (yMax - yMin) * 0.1;
        clearCanvas(ctx);
        // Scale context for high DPI
        ctx.scale(dpr, dpr);
        const { chartX, chartY, chartWidth, chartHeight } = drawAxes(ctx, vp, displayWidth, displayHeight);
        drawGrid(ctx, chartX, chartY, chartWidth, chartHeight, vp);
        const mapped = mapToPx(points, vp, chartWidth, chartHeight, chartX, chartY);
        drawLine(ctx, mapped.x, mapped.y, color);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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

