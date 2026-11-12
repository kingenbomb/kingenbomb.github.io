/**
 * table — a data table with filters, sortable header and status pills.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function DataTable({ palette, label, desc }) {
  const rows = [
    ['Aurora Bloom', 'Active', '12.4k', '2 min ago'],
    ['Photon Knot', 'Review', '8.1k', '14 min ago'],
    ['Spectral Drape', 'Paused', '931', '2 h ago'],
    ['Horizon Blur', 'Active', '4.6k', '5 h ago'],
    ['Vapor Type', 'Draft', '0', '1 d ago'],
  ];
  const tone = { Active: palette.a1, Review: palette.a2, Paused: palette.muted, Draft: palette.muted };
  return (
    <div className="flex h-full w-full flex-col gap-2.5 p-6" style={{ background: palette.bg }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold" style={{ color: palette.fg }}>{label}</p>
          <p className="text-[9px]" style={{ color: palette.muted }}>{desc}</p>
        </div>
        <div className="flex gap-1.5">
          <span className="rounded-md border px-2 py-1 text-[9px]" style={{ borderColor: palette.line, color: palette.muted }}>Filter</span>
          <span className="rounded-md px-2 py-1 text-[9px] font-medium" style={{ background: palette.fg, color: palette.bg }}>Export</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border" style={{ borderColor: palette.line }}>
        <div className="grid grid-cols-[1.6fr_0.8fr_0.6fr_0.8fr] gap-2 border-b px-2.5 py-1.5 text-[8.5px] uppercase tracking-[0.1em]" style={{ borderColor: palette.line, color: palette.muted, background: palette.panel }}>
          <span>Name</span>
          <span>Status</span>
          <span className="text-right">Views</span>
          <span className="text-right">Updated</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row[0]}
            className="grid grid-cols-[1.6fr_0.8fr_0.6fr_0.8fr] items-center gap-2 border-b px-2.5 py-1.5 text-[9.5px] last:border-0"
            style={{ borderColor: palette.line, background: i % 2 ? 'transparent' : `${palette.panel}88` }}
          >
            <span className="flex items-center gap-1.5" style={{ color: palette.fg }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone[row[1]] }} />
              {row[0]}
            </span>
            <span style={{ color: palette.muted }}>{row[1]}</span>
            <span className="text-right tabular-nums" style={{ color: palette.fg }}>{row[2]}</span>
            <span className="text-right" style={{ color: palette.muted }}>{row[3]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
