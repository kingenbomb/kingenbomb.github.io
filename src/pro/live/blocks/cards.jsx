/**
 * cards — a responsive grid of content cards with media, meta and a hover ring.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Cards({ palette, label, desc }) {
  const items = [
    ['Aurora Bloom', 'Backgrounds', '12.4k'],
    ['Photon Knot', '3D & Shaders', '8.1k'],
    ['Spectral Drape', 'Backgrounds', '6.3k'],
    ['Vapor Type', 'Text', '4.9k'],
    ['Circuit Dust', 'Backgrounds', '3.1k'],
    ['Chroma Halo', 'Cursor', '2.4k'],
  ];
  return (
    <div className="flex h-full w-full flex-col gap-2.5 p-5" style={{ background: palette.bg }}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold" style={{ color: palette.fg }}>{label}</p>
          <p className="text-[9px]" style={{ color: palette.muted }}>{desc}</p>
        </div>
        <span className="text-[8.5px]" style={{ color: palette.a1 }}>View all →</span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {items.map(([title, group, views], i) => (
          <div key={title} className="group flex flex-col overflow-hidden rounded-lg border" style={{ borderColor: palette.line, background: palette.panel }}>
            <div
              className="relative h-8"
              style={{
                background: `radial-gradient(120% 120% at 20% 0%, ${i % 2 ? palette.a2 : palette.a1}55, transparent 70%), ${palette.bg}`,
              }}
            >
              <span className="absolute bottom-1 left-1.5 text-[7.5px]" style={{ color: palette.fg, opacity: 0.75 }}>{group}</span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-1">
              <span className="truncate text-[9px] font-medium" style={{ color: palette.fg }}>{title}</span>
              <span className="text-[7.5px] tabular-nums" style={{ color: palette.muted }}>{views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
