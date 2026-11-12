/**
 * faq — an accordion list with one open answer and a support callout.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Faq({ palette, label, desc }) {
  const rows = [
    ['What is included?', 'Every block, template and app UI surface in the library, plus future updates.'],
    ['Can I use it on client work?', 'Yes — projects are covered, redistribution of the source is not.'],
    ['Do I get updates?', 'Lifetime updates on the lifetime plan; annual plans get the year they paid for.'],
    ['Is there a refund policy?', '14 days, no questions asked, if the library is not a fit.'],
  ];
  return (
    <div className="grid h-full w-full grid-cols-[1.1fr_1fr] gap-5 p-7" style={{ background: palette.bg }}>
      <div className="flex flex-col justify-center">
        <h3 className="text-[19px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</h3>
        <p className="mt-1 text-[10.5px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
        <div className="mt-4 rounded-lg border p-3" style={{ borderColor: palette.line, background: palette.panel }}>
          <p className="text-[10px] font-medium" style={{ color: palette.fg }}>Still stuck?</p>
          <p className="mt-0.5 text-[9.5px]" style={{ color: palette.muted }}>We answer within one business day.</p>
          <span className="mt-2 inline-block rounded-md border px-2 py-1 text-[9.5px]" style={{ borderColor: palette.line, color: palette.fg }}>
            Contact support
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1.5">
        {rows.map(([q, a], i) => (
          <div key={q} className="rounded-lg border" style={{ borderColor: i === 0 ? palette.a1 : palette.line, background: palette.panel }}>
            <div className="flex items-center justify-between px-2.5 py-2">
              <p className="text-[10px] font-medium" style={{ color: palette.fg }}>{q}</p>
              <span className="text-[10px]" style={{ color: i === 0 ? palette.a1 : palette.muted }}>{i === 0 ? '−' : '+'}</span>
            </div>
            {i === 0 ? (
              <p className="px-2.5 pb-2 text-[9.5px] leading-relaxed" style={{ color: palette.muted }}>{a}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
