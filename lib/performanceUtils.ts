export function makeFpsCounter() {
  let last = performance.now();
  let frames = 0;
  let fps = 0;
  return {
    tick() {
      frames += 1;
      const now = performance.now();
      if (now - last >= 1000) {
        fps = frames;
        frames = 0;
        last = now;
      }
      return fps;
    },
    value() { return fps; }
  };
}

export function measure<T>(label: string, fn: () => T): { result: T; ms: number } {
  const t0 = performance.now();
  const result = fn();
  const t1 = performance.now();
  performance.measure?.(label, { start: t0, end: t1 } as any);
  return { result, ms: t1 - t0 };
}

export function getApproxMemoryMB(): number {
  const perfMem = (performance as any).memory;
  if (perfMem?.usedJSHeapSize) return perfMem.usedJSHeapSize / (1024 * 1024);
  return 0;
}

