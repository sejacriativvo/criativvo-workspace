// Gráficos simples e leves (sem biblioteca) pro painel.

type Slice = { label: string; value: number; color: string };

// Barras horizontais (ex.: funil de clientes por status).
export function BarChart({ data, title }: { data: Slice[]; title: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold text-neutral-700 mb-3">{title}</div>
      {total === 0 ? (
        <p className="text-sm text-neutral-400 py-6 text-center">Sem dados ainda.</p>
      ) : (
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <div className="w-24 shrink-0 text-xs text-neutral-600">{d.label}</div>
              <div className="flex-1 bg-neutral-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color, minWidth: d.value > 0 ? '1.5rem' : 0 }}
                >
                  {d.value > 0 && <span className="text-[11px] font-bold text-white">{d.value}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Funil de verdade (afunilando de cima pra baixo). Cada etapa é uma faixa
// colorida que estreita; o nome e o número ficam dentro. Bom pra "ler" o funil.
export function Funnel({ data, title }: { data: Slice[]; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const n = data.length;
  const TOP = 96; // largura % da boca do funil
  const BOT = 34; // largura % do bico
  const widthAt = (i: number) => TOP - ((TOP - BOT) * i) / n;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold text-neutral-700 mb-3">{title}</div>
      {total === 0 ? (
        <p className="text-sm text-neutral-400 py-6 text-center">Sem dados ainda.</p>
      ) : (
        <div>
          {data.map((d, i) => {
            const topW = widthAt(i);
            const botW = widthAt(i + 1);
            const l1 = (100 - topW) / 2;
            const r1 = 100 - l1;
            const l2 = (100 - botW) / 2;
            const r2 = 100 - l2;
            return (
              <div
                key={d.label}
                className="flex flex-col items-center justify-center leading-tight h-14"
                style={{
                  background: d.color,
                  clipPath: `polygon(${l1}% 0, ${r1}% 0, ${r2}% 100%, ${l2}% 100%)`,
                }}
              >
                <span className="text-[11px] font-medium text-white/85">{d.label}</span>
                <span className="text-white font-extrabold text-lg leading-none">{d.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Donut (ex.: composição do estoque).
export function Donut({ data, title }: { data: Slice[]; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 42;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-4">
      <div className="text-sm font-semibold text-neutral-700 mb-3">{title}</div>
      {total === 0 ? (
        <p className="text-sm text-neutral-400 py-6 text-center">Sem dados ainda.</p>
      ) : (
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90 shrink-0">
            {data.map((d) => {
              const len = (d.value / total) * C;
              const seg = (
                <circle
                  key={d.label}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return seg;
            })}
            <text x="50" y="50" className="rotate-90" transform="rotate(90 50 50)" textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="800" fill="#171717">
              {total}
            </text>
          </svg>
          <div className="space-y-1.5">
            {data.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-neutral-600">{d.label}</span>
                <span className="font-semibold text-neutral-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
