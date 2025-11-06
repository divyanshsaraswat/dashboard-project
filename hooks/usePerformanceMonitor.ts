'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { PerformanceMetrics } from '@/lib/types';
import { makeFpsCounter, getApproxMemoryMB } from '@/lib/performanceUtils';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, memoryUsageMB: 0, renderTimeMs: 0, dataProcessingTimeMs: 0 });
  const fps = useMemo(() => makeFpsCounter(), []);
  const frameRef = useRef<number>();

  useEffect(() => {
    let mounted = true;
    const loop = () => {
      fps.tick();
      if (mounted) setMetrics(prev => ({ ...prev, fps: fps.value(), memoryUsageMB: getApproxMemoryMB() }));
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => { mounted = false; if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [fps]);

  const setRenderTime = (ms: number) => setMetrics(prev => ({ ...prev, renderTimeMs: ms }));
  const setProcessingTime = (ms: number) => setMetrics(prev => ({ ...prev, dataProcessingTimeMs: ms }));

  return { metrics, setRenderTime, setProcessingTime };
}

