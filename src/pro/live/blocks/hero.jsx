/**
 * hero — two-column hero: headline, subhead, CTA row on the left, product panel on the right.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Hero({ palette, label, desc }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 p-7" style={{ background: palette.bg }}>
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: palette.line, color: palette.muted }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: palette.a1 }} />
        New · v2.4
      </span>
      <div className="grid flex-1 items-center gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-[26px] font-semibold leading-[1.1] tracking-tight" style={{ color: palette.fg }}>
            {label}
          </h3>
          <p className="mt-2 max-w-[34ch] text-[11px] leading-relaxed" style={{ color: palette.muted }}>
            {desc}
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-md px-3 py-1.5 text-[11px] font-medium" style={{ background: palette.fg, color: palette.bg }}>
              Get started
            </span>
            <span className="rounded-md border px-3 py-1.5 text-[11px]" style={{ borderColor: palette.line, color: palette.fg }}>
              Live demo
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3 opacity-70">
            <div className="flex -space-x-1.5">
              {[0, 1, 2, 3].map(i => (
                <span key={i} className="h-5 w-5 rounded-full border" style={{ background: [palette.a1, palette.a2, palette.muted, palette.fg][i], borderColor: palette.bg, opacity: 0.75 }} />
              ))}
            </div>
            <span className="text-[9px]" style={{ color: palette.muted }}>Trusted by 4,000+ teams</span>
          </div>
        </div>
        <div className="relative h-full min-h-[120px] overflow-hidden rounded-lg border" style={{ borderColor: palette.line, background: palette.panel }}>
          <div className="flex items-center gap-1 border-b px-2 py-1.5" style={{ borderColor: palette.line }}>
            {[palette.a2, palette.a1, palette.muted].map((c, i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </div>
          <div className="space-y-2 p-3">
            <div className="h-2 w-2/3 rounded-full" style={{ background: palette.line }} />
            <div className="h-2 w-1/2 rounded-full" style={{ background: palette.line }} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded border p-2" style={{ borderColor: palette.line }}>
                  <div className="h-1.5 w-6 rounded-full" style={{ background: i === 0 ? palette.a1 : palette.line }} />
                  <div className="mt-1.5 h-1 w-8 rounded-full" style={{ background: palette.line, opacity: 0.6 }} />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl" style={{ background: palette.a1, opacity: 0.25 }} />
        </div>
      </div>
    </div>
  );
}
