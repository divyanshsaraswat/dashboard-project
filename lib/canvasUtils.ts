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
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, dpr };
}

export function mapToPx(points: DataPoint[], vp: Viewport, width: number, height: number) {
  const xScale = width / Math.max(1, vp.xMax - vp.xMin);
  const yScale = height / Math.max(1e-6, vp.yMax - vp.yMin);
  const yFlip = height; // canvas y down
  const outX = new Float32Array(points.length);
  const outY = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    outX[i] = (p.timestamp - vp.xMin) * xScale;
    outY[i] = yFlip - (p.value - vp.yMin) * yScale;
  }
  return { x: outX, y: outY };
}

export function drawLine(ctx: CanvasRenderingContext2D, xs: Float32Array, ys: Float32Array, color = '#5eead4') {
  if (xs.length === 0) return;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(xs[0]!, ys[0]!);
  for (let i = 1; i < xs.length; i++) ctx.lineTo(xs[i]!, ys[i]!);
  ctx.stroke();
  ctx.restore();
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

