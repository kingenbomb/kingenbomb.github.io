/**
 * shell — an application shell: icon rail, list column and a detail pane.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Shell({ palette, label, desc }) {
  const items = ['Inbox', 'Assigned', 'Snoozed', 'Drafts', 'Archive'];
  return (
    <div className="flex h-full w-full gap-2 p-4" style={{ background: palette.bg }}>
      <div className="flex w-7 flex-col items-center gap-2 rounded-lg border py-2" style={{ borderColor: palette.line, background: palette.panel }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} className="h-2.5 w-2.5 rounded" style={{ background: i === 0 ? palette.a1 : palette.line }} />
        ))}
      </div>
      <div className="flex w-28 flex-col gap-1 rounded-lg border p-1.5" style={{ borderColor: palette.line, background: palette.panel }}>
        <span className="mb-0.5 text-[8px] uppercase tracking-[0.12em]" style={{ color: palette.muted }}>{label}</span>
        {items.map((item, i) => (
          <span key={item} className="rounded px-1 py-0.5 text-[8.5px]" style={{ background: i === 0 ? `${palette.a1}22` : 'transparent', color: i === 0 ? palette.fg : palette.muted }}>
            {item}
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col rounded-lg border" style={{ borderColor: palette.line, background: palette.panel }}>
        <div className="flex items-center justify-between border-b px-2 py-1.5" style={{ borderColor: palette.line }}>
          <p className="text-[9px] font-medium" style={{ color: palette.fg }}>{label} · detail</p>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className="h-2 w-2 rounded-sm" style={{ background: palette.line }} />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-1.5 p-2">
          <p className="text-[8.5px]" style={{ color: palette.muted }}>{desc}</p>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-1.5 rounded border px-1.5 py-1" style={{ borderColor: palette.line }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 1 ? palette.a2 : palette.muted }} />
              <span className="h-1 flex-1 rounded-full" style={{ background: palette.line, opacity: 0.8 - i * 0.15 }} />
              <span className="h-1 w-4 rounded-full" style={{ background: palette.line }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
