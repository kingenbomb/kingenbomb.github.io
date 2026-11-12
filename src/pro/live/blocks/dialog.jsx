/**
 * dialog — a modal over a dimmed surface with actions and a destructive hint.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Dialog({ palette, label, desc }) {
  return (
    <div className="relative grid h-full w-full place-items-center p-6" style={{ background: palette.bg }}>
      <div className="absolute inset-0" style={{ background: `${palette.bg}cc`, backdropFilter: 'blur(2px)' }} />
      <div className="relative w-[230px] rounded-xl border p-3.5" style={{ borderColor: palette.line, background: palette.panel, boxShadow: `0 24px 60px -30px ${palette.a1}` }}>
        <div className="flex items-start gap-2">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px]" style={{ background: `${palette.a1}22`, color: palette.a1 }}>
            !
          </span>
          <div>
            <p className="text-[10.5px] font-semibold" style={{ color: palette.fg }}>{label}</p>
            <p className="mt-0.5 text-[9px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
          </div>
        </div>
        <div className="mt-2.5 rounded-md border px-2 py-1.5 text-[8.5px]" style={{ borderColor: palette.line, color: palette.muted }}>
          This action cannot be undone.
        </div>
        <div className="mt-2.5 flex justify-end gap-1.5">
          <span className="rounded-md border px-2 py-1 text-[9px]" style={{ borderColor: palette.line, color: palette.fg }}>Cancel</span>
          <span className="rounded-md px-2 py-1 text-[9px] font-medium" style={{ background: palette.a1, color: palette.bg }}>Confirm</span>
        </div>
      </div>
    </div>
  );
}
