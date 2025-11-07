import { DataPoint } from './types';

export interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const displayWidth = canvas.clientWidth | 0;
  const displayHeight = canvas.clientHeight | 0;
  const width = Math.floor(displayWidth * dpr);
  const height = Math.floor(displayHeight * dpr);
  
  // Set CSS size to match display size
  if (canvas.style.width !== `${displayWidth}px`) {
    canvas.style.width = `${displayWidth}px`;
  }
  if (canvas.style.height !== `${displayHeight}px`) {
    canvas.style.height = `${displayHeight}px`;
  }
  
  // Set internal resolution to DPR * display size for crisp rendering
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  
  return { width, height, dpr, displayWidth, displayHeight };
}

export function mapToPx(points: DataPoint[], vp: Viewport, width: number, height: number, offsetX = 0, offsetY = 0) {
  const xScale = width / Math.max(1, vp.xMax - vp.xMin);
  const yScale = height / Math.max(1e-6, vp.yMax - vp.yMin);
  const yFlip = height; // canvas y down
  const outX = new Float32Array(points.length);
  const outY = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    outX[i] = offsetX + (p.timestamp - vp.xMin) * xScale;
    outY[i] = offsetY + yFlip - (p.value - vp.yMin) * yScale;
  }
  return { x: outX, y: outY };
}

export function drawLine(ctx: CanvasRenderingContext2D, xs: Float32Array, ys: Float32Array, color = '#5eead4') {
  if (xs.length === 0) return;
  ctx.save();
  ctx.lineWidth = 2; // Slightly thicker for better visibility at high DPI
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(xs[0]!, ys[0]!);
  for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i]!, ys[i]!);
  ctx.stroke();
  ctx.restore();
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawAxes(ctx: CanvasRenderingContext2D, vp: Viewport, width: number, height: number, padding = { top: 20, right: 20, bottom: 45, left: 50 }) {
  ctx.save();
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 1;
  ctx.font = '11px system-ui';
  ctx.fillStyle = '#98a2b3';
  
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const chartX = padding.left;
  const chartY = padding.top;
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX, chartY + chartHeight);
  ctx.stroke();
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(chartX, chartY + chartHeight);
  ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
  ctx.stroke();
  
  // Y-axis labels
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y = chartY + (chartHeight * (yTicks - i) / yTicks);
    const value = vp.yMin + (vp.yMax - vp.yMin) * (i / yTicks);
    ctx.fillText(value.toFixed(1), chartX - 8, y);
    ctx.beginPath();
    ctx.moveTo(chartX - 3, y);
    ctx.lineTo(chartX, y);
    ctx.stroke();
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  
  // X-axis labels (horizontal ticks)
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const xTicks = 5;
  for (let i = 0; i <= xTicks; i++) {
    const x = chartX + (chartWidth * i / xTicks);
    const ts = vp.xMin + (vp.xMax - vp.xMin) * (i / xTicks);
    const date = new Date(ts);
    const label = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    // Draw tick mark
    ctx.beginPath();
    ctx.moveTo(x, chartY + chartHeight);
    ctx.lineTo(x, chartY + chartHeight + 5);
    ctx.stroke();
    // Draw label horizontally below tick
    ctx.fillText(label, x, chartY + chartHeight + 8);
  }
  
  // Axis title
  ctx.save();
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Time', chartX + chartWidth / 2, chartY + chartHeight + 28);
  ctx.restore();
  
  ctx.save();
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#cbd5e1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.translate(15, chartY + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Value', 0, 0);
  ctx.restore();
  
  ctx.restore();
  return { chartX, chartY, chartWidth, chartHeight, padding };
}

export function drawGrid(ctx: CanvasRenderingContext2D, chartX: number, chartY: number, chartWidth: number, chartHeight: number, vp: Viewport) {
  ctx.save();
  ctx.strokeStyle = '#1f242d';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  const yTicks = 5;
  for (let i = 1; i < yTicks; i++) {
    const y = chartY + (chartHeight * i / yTicks);
    ctx.beginPath();
    ctx.moveTo(chartX, y);
    ctx.lineTo(chartX + chartWidth, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  const xTicks = 5;
  for (let i = 1; i < xTicks; i++) {
    const x = chartX + (chartWidth * i / xTicks);
    ctx.beginPath();
    ctx.moveTo(x, chartY);
    ctx.lineTo(x, chartY + chartHeight);
    ctx.stroke();
  }
  
  ctx.restore();
}

