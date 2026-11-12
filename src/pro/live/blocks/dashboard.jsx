/**
 * dashboard — KPI row, bar chart and a recent activity list inside an app frame.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Dashboard({ palette, label, desc }) {
  const bars = [38, 62, 44, 78, 56, 88, 70, 52, 66, 40, 74, 58];
  const kpis = [
    ['Requests', '128.4k', '+12%'],
    ['Latency', '42ms', '-8%'],
    ['Errors', '0.12%', '-0.4%'],
  ];
  return (
    <div className="flex h-full w-full gap-2 p-4" style={{ background: palette.bg }}>
      <div className="flex w-16 flex-col gap-1 rounded-lg border p-1.5" style={{ borderColor: palette.line, background: palette.panel }}>
        <span className="h-3 w-3 rounded" style={{ background: `linear-gradient(135deg, ${palette.a1}, ${palette.a2})` }} />
        {['Home', 'Charts', 'Keys', 'Team', 'Docs'].map((item, i) => (
          <span key={item} className="rounded px-1 py-0.5 text-[7.5px]" style={{ background: i === 1 ? `${palette.a1}22` : 'transparent', color: i === 1 ? palette.fg : palette.muted }}>
            {item}
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10.5px] font-semibold" style={{ color: palette.fg }}>{label}</p>
            <p className="text-[8.5px]" style={{ color: palette.muted }}>{desc}</p>
          </div>
          <span className="rounded border px-1.5 py-0.5 text-[8px]" style={{ borderColor: palette.line, color: palette.muted }}>Last 30 days</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {kpis.map(([name, value, delta], i) => (
            <div key={name} className="rounded-lg border p-1.5" style={{ borderColor: palette.line, background: palette.panel }}>
              <p className="text-[8px]" style={{ color: palette.muted }}>{name}</p>
              <p className="text-[12px] font-semibold tabular-nums" style={{ color: palette.fg }}>{value}</p>
              <p className="text-[7.5px]" style={{ color: i === 1 ? palette.a2 : palette.a1 }}>{delta}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1 rounded-lg border p-2" style={{ borderColor: palette.line, background: palette.panel }}>
          {bars.map((height, i) => (
            <div key={i} className="flex-1 rounded-t" style={{ height: `${height}%`, background: i === 5 ? palette.a2 : palette.a1, opacity: 0.55 + (i % 3) * 0.15 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
