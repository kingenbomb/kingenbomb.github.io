/**
 * nav — a top navigation bar with logo, links, and a primary action.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Nav({ palette, label, desc }) {
  const links = ['Product', 'Solutions', 'Pricing', 'Docs'];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-6" style={{ background: palette.bg, color: palette.fg }}>
      <div className="flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: palette.line, background: palette.panel }}>
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded" style={{ background: `linear-gradient(135deg, ${palette.a1}, ${palette.a2})` }} />
          <span className="text-[10px] font-semibold tracking-tight">{label.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-3">
          {links.map((item, i) => (
            <span key={item} className="text-[9.5px]" style={{ color: i === 0 ? palette.fg : palette.muted }}>
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9.5px]" style={{ color: palette.muted }}>Sign in</span>
          <span className="rounded-md px-2 py-1 text-[9.5px] font-medium" style={{ background: palette.fg, color: palette.bg }}>
            Get started
          </span>
        </div>
      </div>
      <div className="rounded-xl border border-dashed p-4" style={{ borderColor: palette.line }}>
        <p className="text-[10.5px] font-medium">{label}</p>
        <p className="mt-1 max-w-[50ch] text-[9.5px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
        <div className="mt-3 flex gap-1.5">
          {['Overview', 'Changelog', 'Roadmap'].map(t => (
            <span key={t} className="rounded border px-1.5 py-0.5 text-[8.5px]" style={{ borderColor: palette.line, color: palette.muted }}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['Docs', 'Blog', 'Careers', 'Contact'].map(t => (
          <div key={t} className="rounded-lg border p-2 text-[9px]" style={{ borderColor: palette.line, color: palette.muted }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
