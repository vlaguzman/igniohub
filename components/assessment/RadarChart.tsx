export interface RadarPoint {
  key: string;
  label: string;
  score: number | null;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const MAX_RADIUS = 110;
const GRIDLINES = [25, 50, 75, 100];

function pointFor(index: number, total: number, radius: number): { x: number; y: number } {
  const angle = (-90 + index * (360 / total)) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export function RadarChart({ data }: { data: RadarPoint[] }) {
  const n = data.length;
  const valuePolygon = data
    .map((d, i) => {
      const v = d.score ?? 0;
      const { x, y } = pointFor(i, n, MAX_RADIUS * (v / 100));
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="mx-auto w-full max-w-[420px] overflow-visible">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Mapa de capacidades">
        {/* gridlines */}
        {GRIDLINES.map((g) => {
          const pts = Array.from({ length: n }, (_, i) => {
            const { x, y } = pointFor(i, n, MAX_RADIUS * (g / 100));
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon key={g} points={pts} fill="none" stroke="#38393b" strokeOpacity={0.12} strokeWidth={1} />
          );
        })}
        {/* axes */}
        {data.map((d, i) => {
          const { x, y } = pointFor(i, n, MAX_RADIUS);
          return (
            <line key={d.key} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#38393b" strokeOpacity={0.12} strokeWidth={1} />
          );
        })}
        {/* value polygon */}
        <polygon points={valuePolygon} fill="#7c39ed" fillOpacity={0.18} stroke="#7c39ed" strokeWidth={2} />
        {/* value dots */}
        {data.map((d, i) => {
          const v = d.score ?? 0;
          const { x, y } = pointFor(i, n, MAX_RADIUS * (v / 100));
          return <circle key={d.key} cx={x} cy={y} r={3} fill="#7c39ed" />;
        })}
        {/* labels */}
        {data.map((d, i) => {
          const { x, y } = pointFor(i, n, MAX_RADIUS + 26);
          const anchor = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
          return (
            <text
              key={d.key}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-charcoal-slate"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {d.label} ({d.score ?? '—'})
            </text>
          );
        })}
      </svg>
    </div>
  );
}
