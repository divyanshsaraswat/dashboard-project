'use client';

import { memo } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

function LineChartBase({ data, color = '#5eead4' }: { data: DataPoint[]; color?: string }) {
  const { setCanvas } = useChartRenderer(data, color);
  return (
    <div className="panel" style={{ height: 280, minHeight: 280 }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#e6e8eb' }}>Line Chart - Value over Time</h4>
      <canvas ref={setCanvas} style={{ width: '100%', height: 'calc(100% - 24px)', display: 'block' }} />
    </div>
  );
}

export const LineChart = memo(LineChartBase);

