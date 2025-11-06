'use client';

import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export function PerformanceMonitor() {
  const { metrics } = usePerformanceMonitor();
  return (
    <div className="panel">
      <div className="metrics">
        <span className="badge">FPS: <strong>{metrics.fps}</strong></span>
        <span className="badge">Memory: <strong>{metrics.memoryUsageMB > 0 ? metrics.memoryUsageMB.toFixed(1) + ' MB' : 'N/A'}</strong></span>
        <span className="badge">Render: <strong>{metrics.renderTimeMs.toFixed(2)} ms</strong></span>
        <span className="badge">Processing: <strong>{metrics.dataProcessingTimeMs.toFixed(2)} ms</strong></span>
      </div>
    </div>
  );
}

