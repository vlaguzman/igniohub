export interface RadarPoint {
  key: string;
  label: string;
  score: number | null;
}

const SIZE = 380;
const CENTER = SIZE / 2;
const MAX_RADIUS = 118;
const GRIDLINES = [25, 50, 75, 100];
const LABEL_OFFSET = 30;
const LINE_HEIGHT = 12;

function pointFor(index: number, total: number, radius: number): { x: number; y: number } {
  const angle = (-90 + index * (360 / total)) * (Math.PI / 180);
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

// Long capability names (e.g. "Economic Integration Readiness") overflow a
// single line badly at chart scale. Split into up to two roughly-balanced
// lines by word count so each line stays short regardless of label length.
function wrapLabel(label: string): string[] {
  const words = label.split(' ');
  if (words.length <= 1) return [label];

  const target = label.length / 2;
  const line1: string[] = [];
  let acc = 0;
  let i = 0;
  for (; i < words.length; i++) {
    const w = words[i];
    if (acc + w.length > target && line1.length > 0) break;
    line1.push(w);
    acc += w.length + 1;
  }
  const line2 = words.slice(i);
  return line2.length ? [line1.join(' '), line2.join(' ')] : [line1.join(' ')];
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
    <div className="mx-auto w-full max-w-[460px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="Mapa de capacidades"
      >
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
          const { x, y } = pointFor(i, n, MAX_RADIUS + LABEL_OFFSET);
          const anchor = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
          const lines = wrapLabel(d.label);
          const lastIndex = lines.length - 1;
          const startY = y - ((lines.length - 1) * LINE_HEIGHT) / 2;
          return (
            <text
              key={d.key}
              x={x}
              y={startY}
              textAnchor={anchor}
              className="fill-charcoal-slate"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              {lines.map((line, li) => (
                <tspan key={li} x={x} dy={li === 0 ? 0 : LINE_HEIGHT}>
                  {li === lastIndex ? `${line} (${d.score ?? '—'})` : line}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
