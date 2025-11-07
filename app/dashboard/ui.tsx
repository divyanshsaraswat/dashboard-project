'use client';

import { useDataContext } from '@/components/providers/DataProvider';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { ScatterPlot } from '@/components/charts/ScatterPlot';
import { Heatmap } from '@/components/charts/Heatmap';
import { PerformanceMonitor } from '@/components/ui/PerformanceMonitor';
import { FilterPanel } from '@/components/controls/FilterPanel';
import { TimeRangeSelector } from '@/components/controls/TimeRangeSelector';
import { DataTable } from '@/components/ui/DataTable';
import { useDataStream } from '@/hooks/useDataStream';

export function DashboardClient() {
  const { data, push, filteredData } = useDataContext();
  useDataStream(push, 100);
  return (
    <main className="dashboard">
      <aside className="panel">
        <h3>Controls</h3>
        <FilterPanel />
        <TimeRangeSelector />
        <PerformanceMonitor />
      </aside>
      <section style={{ display: 'grid', gap: 12 }}>
        <div className="row">
          <LineChart data={data.points} />
          <BarChart data={data.points} />
        </div>
        <div className="row">
          <ScatterPlot data={data.points} />
          <Heatmap data={data.points} />
        </div>
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Data</h3>
          <DataTable data={filteredData} />
        </div>
      </section>
    </main>
  );
}

