export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap';

export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  metadata?: Record<string, unknown>;
}

export interface ChartConfig {
  type: ChartType;
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsageMB: number;
  renderTimeMs: number;
  dataProcessingTimeMs: number;
}

export interface DataState {
  points: DataPoint[];
  windowStart: number;
  windowEnd: number;
}

export type AggregationWindow = '1m' | '5m' | '1h';

