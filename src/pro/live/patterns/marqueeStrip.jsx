/**
 * marqueeStrip — a seamless dual-row marquee of tiles that speeds up toward the edges.
 * Reimplementation written for this clone (the original component's source is paid).
 */
export default function MarqueeStrip({ palette, density = 0.5, speed = 0.4, seed = 1, label = 'REACT BITS' }) {
  const items = Array.from({ length: 8 }, (_, i) => i);
  const duration = Math.max(6, 26 - speed * 16);
  const height = Math.round(44 + density * 54);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: palette.bg }}>
      {[0, 1].map(row => (
        <div
          key={row}
          className="flex w-max items-center gap-3 py-2"
          style={{
            marginTop: row === 0 ? `calc(50% - ${height + 8}px)` : 0,
            animation: `rbp-marquee ${row === 0 ? '' : 'reverse '}${duration}s linear infinite`,
          }}
        >
          {items.concat(items).map((item, i) => (
            <div
              key={`${row}-${i}`}
              className="grid shrink-0 place-items-center rounded-lg border"
              style={{
                width: height * 2,
                height,
                borderColor: `${palette.fg}22`,
                background:
                  (i + row) % 3 === 0
                    ? `linear-gradient(120deg, ${palette.a1}33, ${palette.a2}22)`
                    : `${palette.fg}08`,
                color: (i + row) % 3 === 0 ? palette.fg : `${palette.fg}77`,
              }}
            >
              <span className="px-3 text-center text-[11px] font-medium uppercase tracking-[0.16em]">
                {(i + row) % 4 === 0 ? label : `/${String((i % 6) + 1).padStart(2, '0')}`}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16"
        style={{ background: `linear-gradient(90deg, ${palette.bg}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16"
        style={{ background: `linear-gradient(270deg, ${palette.bg}, transparent)` }}
      />
      <style>{`@keyframes rbp-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
