/**
 * footer — a four-column footer with brand blurb, link groups and a legal row.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Footer({ palette, label, desc }) {
  const groups = [
    ['Product', ['Components', 'Blocks', 'Templates', 'Agent kit']],
    ['Company', ['About', 'Blog', 'Careers', 'Contact']],
    ['Legal', ['Licence', 'Privacy', 'Terms', 'Cookies']],
  ];
  return (
    <div className="flex h-full w-full flex-col justify-between p-6" style={{ background: palette.bg }}>
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded" style={{ background: `linear-gradient(135deg, ${palette.a1}, ${palette.a2})` }} />
            <span className="text-[10px] font-semibold" style={{ color: palette.fg }}>React Bits</span>
          </div>
          <p className="mt-1.5 max-w-[26ch] text-[9px] leading-relaxed" style={{ color: palette.muted }}>{desc}</p>
          <div className="mt-2 flex gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className="h-4 w-4 rounded border" style={{ borderColor: palette.line }} />
            ))}
          </div>
        </div>
        {groups.map(([title, links]) => (
          <div key={title}>
            <p className="text-[9px] font-medium uppercase tracking-[0.14em]" style={{ color: palette.fg }}>{title}</p>
            <ul className="mt-1.5 space-y-1">
              {links.map(link => (
                <li key={link} className="text-[9px]" style={{ color: palette.muted }}>{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-2 text-[8.5px]" style={{ borderColor: palette.line, color: palette.muted }}>
        <span>{label} · © 2026 React Bits</span>
        <span>Built with React and Tailwind</span>
      </div>
    </div>
  );
}
