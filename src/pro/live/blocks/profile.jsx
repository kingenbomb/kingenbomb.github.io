/**
 * profile — a profile header with avatar, stats and a tabbed activity list.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Profile({ palette, label, desc }) {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-6" style={{ background: palette.bg }}>
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-10 w-10 place-items-center rounded-full text-[10px] font-semibold"
          style={{ background: `linear-gradient(135deg, ${palette.a1}, ${palette.a2})`, color: palette.bg }}
        >
          DH
        </span>
        <div className="flex-1">
          <p className="text-[11px] font-semibold" style={{ color: palette.fg }}>{label}</p>
          <p className="text-[9px]" style={{ color: palette.muted }}>{desc}</p>
        </div>
        <span className="rounded-md border px-2 py-1 text-[9px]" style={{ borderColor: palette.line, color: palette.fg }}>Follow</span>
      </div>
      <div className="flex gap-3 rounded-lg border px-2.5 py-1.5" style={{ borderColor: palette.line, background: palette.panel }}>
        {[['128', 'components'], ['42', 'blocks'], ['9.1k', 'saves']].map(([value, caption]) => (
          <div key={caption}>
            <p className="text-[11px] font-semibold tabular-nums" style={{ color: palette.fg }}>{value}</p>
            <p className="text-[8px]" style={{ color: palette.muted }}>{caption}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-b pb-1" style={{ borderColor: palette.line }}>
        {['Activity', 'Saved', 'About'].map((tab, i) => (
          <span key={tab} className="text-[9px]" style={{ color: i === 0 ? palette.fg : palette.muted, borderBottom: i === 0 ? `1px solid ${palette.a1}` : 'none', paddingBottom: 2 }}>
            {tab}
          </span>
        ))}
      </div>
      <div className="flex-1 space-y-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex items-center gap-2 rounded-lg border px-2 py-1.5" style={{ borderColor: palette.line }}>
            <span className="h-4 w-4 rounded" style={{ background: `${i % 2 ? palette.a2 : palette.a1}33` }} />
            <span className="h-1.5 flex-1 rounded-full" style={{ background: palette.line }} />
            <span className="h-1.5 w-6 rounded-full" style={{ background: palette.line, opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
