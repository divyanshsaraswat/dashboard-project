'use client';

import { memo } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

function LineChartBase({ data, color = '#5eead4' }: { data: DataPoint[]; color?: string }) {
  const { setCanvas } = useChartRenderer(data, color);
  return (
    <div className="panel" style={{ height: 280 }}>
      <canvas ref={setCanvas} />
    </div>
  );
}

export const LineChart = memo(LineChartBase);

