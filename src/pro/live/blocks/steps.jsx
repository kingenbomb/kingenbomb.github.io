/**
 * steps — a numbered how-it-works sequence with connector lines.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Steps({ palette, label, desc }) {
  const steps = [
    ['Install', 'npm i @reactbits/pro'],
    ['Pick a block', 'Copy the file into your app'],
    ['Ship', 'Wire your data and deploy'],
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-7" style={{ background: palette.bg }}>
      <div className="text-center">
        <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: palette.a1 }}>How it works</p>
        <p className="mt-1 text-[18px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</p>
        <p className="mx-auto mt-1 max-w-[44ch] text-[9.5px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
      </div>
      <div className="relative grid grid-cols-3 gap-3">
        <span className="absolute left-[16%] right-[16%] top-3 h-px" style={{ background: palette.line }} />
        {steps.map(([title, note], i) => (
          <div key={title} className="relative flex flex-col items-center text-center">
            <span
              className="grid h-6 w-6 place-items-center rounded-full border text-[9px] font-medium tabular-nums"
              style={{ borderColor: palette.a1, background: palette.bg, color: palette.a1 }}
            >
              {i + 1}
            </span>
            <p className="mt-2 text-[10px] font-medium" style={{ color: palette.fg }}>{title}</p>
            <p className="mt-0.5 text-[8.5px]" style={{ color: palette.muted }}>{note}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto rounded-lg border px-3 py-1.5 font-mono text-[8.5px]" style={{ borderColor: palette.line, color: palette.a2 }}>
        npx reactbits-pro add hero-1
      </div>
    </div>
  );
}
