/**
 * notFound — a large 404 with a search field and quick links back into the app.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function NotFound({ palette, label, desc }) {
  return (
    <div className="grid h-full w-full place-items-center p-6" style={{ background: palette.bg }}>
      <div className="text-center">
        <p className="text-[44px] font-semibold leading-none tracking-tighter" style={{ color: `${palette.fg}22` }}>404</p>
        <p className="-mt-2 text-[12px] font-semibold" style={{ color: palette.fg }}>{label}</p>
        <p className="mx-auto mt-1 max-w-[40ch] text-[9px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
        <div className="mx-auto mt-3 flex w-[210px] items-center gap-1.5 rounded-md border px-2 py-1.5" style={{ borderColor: palette.line }}>
          <span className="flex-1 text-[8.5px]" style={{ color: palette.muted }}>Search components…</span>
          <span className="rounded border px-1 text-[7.5px]" style={{ borderColor: palette.line, color: palette.muted }}>⌘K</span>
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          {['Home', 'Docs', 'Pricing'].map(link => (
            <span key={link} className="rounded border px-1.5 py-0.5 text-[8.5px]" style={{ borderColor: palette.line, color: palette.muted }}>{link}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
