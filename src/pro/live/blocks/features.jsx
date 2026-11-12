/**
 * features — section header plus a grid of feature cards with icon chips.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Features({ palette, label, desc }) {
  const items = [
    ['Instant setup', 'Drop the block in and ship.'],
    ['Themeable', 'Tokens for every surface.'],
    ['Accessible', 'Keyboard and screen-reader ready.'],
    ['Responsive', 'One layout, every breakpoint.'],
    ['Typed', 'Predictable props, no guessing.'],
    ['Composable', 'Mix blocks without conflicts.'],
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-7" style={{ background: palette.bg }}>
      <div className="max-w-[46ch]">
        <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: palette.a1 }}>Features</p>
        <h3 className="mt-1 text-[20px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</h3>
        <p className="mt-1 text-[10.5px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {items.map(([title, note], i) => (
          <div key={title} className="rounded-lg border p-2.5" style={{ borderColor: palette.line, background: palette.panel }}>
            <span
              className="grid h-5 w-5 place-items-center rounded text-[9px]"
              style={{ background: `${i % 2 ? palette.a2 : palette.a1}22`, color: i % 2 ? palette.a2 : palette.a1 }}
            >
              {i + 1}
            </span>
            <p className="mt-1.5 text-[10.5px] font-medium" style={{ color: palette.fg }}>{title}</p>
            <p className="mt-0.5 text-[9.5px] leading-snug" style={{ color: palette.muted }}>{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
