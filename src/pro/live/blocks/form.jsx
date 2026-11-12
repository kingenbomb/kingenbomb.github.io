/**
 * form — a two-column settings/contact form with labelled fields and a save row.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Form({ palette, label, desc }) {
  const fields = [
    ['Full name', 'Ada Lovelace'],
    ['Email', 'ada@company.com'],
    ['Company', 'Analytical Engines'],
    ['Role', 'Founder'],
  ];
  return (
    <div className="grid h-full w-full grid-cols-[1fr_1.1fr] gap-4 p-6" style={{ background: palette.bg }}>
      <div className="flex flex-col justify-center">
        <h3 className="text-[18px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</h3>
        <p className="mt-1 text-[10px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
        <ul className="mt-3 space-y-1.5">
          {['Validated on submit', 'Errors inline', 'Autosave drafts'].map(item => (
            <li key={item} className="flex items-center gap-1.5 text-[9.5px]" style={{ color: palette.muted }}>
              <span style={{ color: palette.a1 }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-center rounded-xl border p-3" style={{ borderColor: palette.line, background: palette.panel }}>
        <div className="grid grid-cols-2 gap-2">
          {fields.map(([field, value], i) => (
            <div key={field}>
              <p className="text-[8.5px]" style={{ color: palette.muted }}>{field}</p>
              <div
                className="mt-0.5 rounded-md border px-1.5 py-1 text-[9.5px]"
                style={{
                  borderColor: i === 1 ? palette.a1 : palette.line,
                  color: i === 1 ? palette.fg : palette.muted,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <p className="text-[8.5px]" style={{ color: palette.muted }}>Notes</p>
          <div className="mt-0.5 h-9 rounded-md border px-1.5 py-1 text-[9px]" style={{ borderColor: palette.line, color: palette.muted }}>
            Tell us what you are building…
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[8.5px]" style={{ color: palette.muted }}>Saved 2m ago</span>
          <span className="rounded-md px-2 py-1 text-[9.5px] font-medium" style={{ background: palette.fg, color: palette.bg }}>
            Save changes
          </span>
        </div>
      </div>
    </div>
  );
}
