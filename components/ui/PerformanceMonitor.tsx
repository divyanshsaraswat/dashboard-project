'use client';

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export function PerformanceMonitor() {
  const { metrics } = usePerformanceMonitor();
  return (
    <div className="panel" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span className="badge">FPS: <strong>{metrics.fps}</strong></span>
      <span className="badge">Memory: <strong>{metrics.memoryUsageMB.toFixed(1)} MB</strong></span>
      <span className="badge">Render: <strong>{metrics.renderTimeMs.toFixed(2)} ms</strong></span>
      <span className="badge">Processing: <strong>{metrics.dataProcessingTimeMs.toFixed(2)} ms</strong></span>
    </div>
  );
}

