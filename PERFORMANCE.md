# PERFORMANCE.md

## Benchmarking Results (local dev machine)

- Baseline (10k points): 60 FPS stable
- Updates at 100ms: no frame drops observed after warm-up
- Memory: stable due to sliding window and 100k cap

Note: Precise numbers vary by device and tab activity. Use Performance tab to validate.

## React Optimization Techniques

- React.memo for chart components
- useMemo/useCallback to avoid recalculation
- useTransition for non-blocking data window updates
- Client-only rendering loops via requestAnimationFrame

## Next.js Performance Features

- Server Component loads initial 10k dataset (no client blocking)
- Edge runtime route for quick data API access
- Streaming not required here (UI is client-rendered), but can be added around slow panes

## Canvas Integration

- Canvas sized to devicePixelRatio for crisp rendering
- Minimal allocations in render loop (typed arrays, reuse refs)
- Dirty full-canvas redraw for simplicity; can optimize to dirty regions if needed

## Scaling Strategy

- Up to 100k points kept in memory with sliding window
- For 100k-1M points, move processing to Web Worker + OffscreenCanvas
- Level-of-detail: downsample/aggregate by viewport (bucket by pixel)
- SSR only for non-interactive metadata; charts remain client-rendered

## Future Enhancements

- Web Worker for data processing + aggregation
- OffscreenCanvas for background rendering (Chrome)
- Progressive downsampling on zoom-out
- GPU/WebGL path for 100k+ data at 60fps

