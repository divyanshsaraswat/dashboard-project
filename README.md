# Performance Dashboard (Next.js 14 + TypeScript)

## Setup

```bash
npm install
npm run dev
```

- Dev: http://localhost:3000/dashboard
- Build: `npm run build` then `npm start`

## Features

- Canvas+SVG-free minimal charts (no D3/Chart.js)
- Real-time data stream (100ms ticks)
- Line, Bar, Scatter, Heatmap
- Time range selection and basic aggregation (raw/1m/5m/1h)
- Virtualized data table
- FPS + Memory monitor
- App Router, Server/Client composition, Edge API route

## Performance Testing

- Open the dashboard, watch FPS and memory badges
- Increase stress by opening devtools Performance to validate 60fps
- Verify memory stability after several minutes (sliding window + capping to 100k points)

## Browser Compatibility

- Latest Chrome, Edge, Firefox. Safari supported but memory metrics may differ.

## Next.js Optimizations

- App Router Server Component for initial 10k dataset
- Client components isolate canvas rendering and streaming
- Edge runtime for `/api/data` route
- `reactCompiler` enabled and console removal in production

## Notes

- No external chart libraries; rendering fully custom with Canvas
- Web Workers/OffscreenCanvas can be added for further isolation (see PERFORMANCE.md)

