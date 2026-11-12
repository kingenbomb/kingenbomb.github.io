/**
 * stats — a band of oversized numbers with captions and a trend sparkline.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Stats({ palette, label, desc }) {
  const items = [
    ['230', 'components'],
    ['300', 'blocks'],
    ['15', 'templates'],
    ['4.9k', 'developers'],
  ];
  const spark = [30, 44, 38, 62, 55, 74, 68, 88, 80, 96];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-7" style={{ background: palette.bg }}>
      <div>
        <p className="text-[18px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</p>
        <p className="mt-1 max-w-[46ch] text-[9.5px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map(([value, caption], i) => (
          <div key={caption} className="rounded-lg border p-2" style={{ borderColor: palette.line, background: palette.panel }}>
            <p className="text-[18px] font-semibold tabular-nums leading-none" style={{ color: i === 0 ? palette.a1 : palette.fg }}>{value}</p>
            <p className="mt-1 text-[8.5px]" style={{ color: palette.muted }}>{caption}</p>
          </div>
        ))}
      </div>
      <div className="flex h-8 items-end gap-0.5">
        {spark.map((height, i) => (
          <span key={i} className="flex-1 rounded-t-sm" style={{ height: `${height}%`, background: palette.a2, opacity: 0.25 + i * 0.07 }} />
        ))}
      </div>
    </div>
  );
}
