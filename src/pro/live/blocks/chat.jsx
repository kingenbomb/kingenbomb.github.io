/**
 * chat — a conversation thread with tool call chips, sources and a prompt box.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Chat({ palette, label, desc }) {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-5" style={{ background: palette.bg }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10.5px] font-semibold" style={{ color: palette.fg }}>{label}</p>
          <p className="text-[8.5px]" style={{ color: palette.muted }}>{desc}</p>
        </div>
        <span className="rounded-full border px-1.5 py-0.5 text-[8px]" style={{ borderColor: palette.line, color: palette.muted }}>
          gpt-4.1 · streaming
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="ml-auto w-[70%] rounded-lg rounded-br-sm px-2.5 py-1.5 text-[9.5px]" style={{ background: `${palette.a1}22`, color: palette.fg }}>
          Summarise the pricing page and list the tiers.
        </div>
        <div className="w-[82%] space-y-1.5 rounded-lg rounded-bl-sm border px-2.5 py-1.5" style={{ borderColor: palette.line, background: palette.panel }}>
          <p className="text-[9.5px] leading-relaxed" style={{ color: palette.fg }}>
            Three tiers: Starter at $0, Pro at $149 and Team at $399. Pro is highlighted as most popular.
          </p>
          <div className="flex flex-wrap gap-1">
            {['read_file pricing.tsx', 'list_tiers()'].map(tool => (
              <span key={tool} className="rounded border px-1.5 py-0.5 font-mono text-[8px]" style={{ borderColor: palette.line, color: palette.a2 }}>
                {tool}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[8px]" style={{ color: palette.muted }}>
            <span className="h-1 w-1 rounded-full" style={{ background: palette.a1 }} />
            2 sources
          </div>
        </div>
        <div className="w-[64%] rounded-lg rounded-bl-sm border px-2.5 py-1.5 text-[9px] opacity-70" style={{ borderColor: palette.line, color: palette.muted }}>
          Want me to compare them against the annual pricing?
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5" style={{ borderColor: palette.line }}>
        <span className="flex-1 text-[9px]" style={{ color: palette.muted }}>Ask a follow-up…</span>
        <span className="rounded px-1.5 py-0.5 text-[8.5px]" style={{ background: palette.a1, color: palette.bg }}>Send</span>
      </div>
    </div>
  );
}
