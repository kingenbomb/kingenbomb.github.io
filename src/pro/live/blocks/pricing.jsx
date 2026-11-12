/**
 * pricing — three tier cards with a highlighted plan and a feature checklist.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Pricing({ palette, label, desc }) {
  const tiers = [
    ['Starter', '$0', ['5 blocks', 'Community support', 'MIT licence']],
    ['Pro', '$149', ['300 blocks', '15 templates', 'Priority support']],
    ['Team', '$399', ['Unlimited seats', 'Custom blocks', 'Onboarding call']],
  ];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 p-6" style={{ background: palette.bg }}>
      <div className="text-center">
        <h3 className="text-[19px] font-semibold tracking-tight" style={{ color: palette.fg }}>{label}</h3>
        <p className="mx-auto mt-1 max-w-[42ch] text-[10px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {tiers.map(([name, price, feats], i) => {
          const hot = i === 1;
          return (
            <div
              key={name}
              className="flex flex-col rounded-lg border p-3"
              style={{
                borderColor: hot ? palette.a1 : palette.line,
                background: hot ? `${palette.a1}12` : palette.panel,
                boxShadow: hot ? `0 12px 30px -18px ${palette.a1}` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium" style={{ color: palette.fg }}>{name}</p>
                {hot ? (
                  <span className="rounded-full px-1.5 py-0.5 text-[8px]" style={{ background: palette.a1, color: palette.bg }}>Popular</span>
                ) : null}
              </div>
              <p className="mt-1.5 text-[20px] font-semibold tabular-nums" style={{ color: palette.fg }}>
                {price}
                <span className="text-[9px] font-normal" style={{ color: palette.muted }}> one-time</span>
              </p>
              <ul className="mt-2 flex-1 space-y-1">
                {feats.map(f => (
                  <li key={f} className="flex items-center gap-1 text-[9.5px]" style={{ color: palette.muted }}>
                    <span style={{ color: hot ? palette.a1 : palette.a2 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <span
                className="mt-2 rounded-md py-1 text-center text-[10px] font-medium"
                style={{ background: hot ? palette.a1 : 'transparent', color: hot ? palette.bg : palette.fg, border: hot ? 'none' : `1px solid ${palette.line}` }}
              >
                Choose
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
