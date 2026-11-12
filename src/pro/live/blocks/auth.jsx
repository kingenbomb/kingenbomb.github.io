/**
 * auth — a centred sign-in card with OAuth buttons and an email field.
 * Reimplementation written for this clone (the original block's source is paid).
 */
export default function Auth({ palette, label, desc }) {
  return (
    <div className="grid h-full w-full place-items-center p-6" style={{ background: palette.bg }}>
      <div className="w-[240px] rounded-xl border p-4" style={{ borderColor: palette.line, background: palette.panel }}>
        <span className="mx-auto grid h-6 w-6 place-items-center rounded-lg" style={{ background: `linear-gradient(135deg, ${palette.a1}, ${palette.a2})` }} />
        <p className="mt-2 text-center text-[11px] font-semibold" style={{ color: palette.fg }}>{label}</p>
        <p className="mt-0.5 text-center text-[9px]" style={{ color: palette.muted }}>{desc}</p>
        <div className="mt-3 space-y-1.5">
          {['Continue with GitHub', 'Continue with Google'].map(provider => (
            <div key={provider} className="flex items-center justify-center gap-1.5 rounded-md border py-1.5 text-[9.5px]" style={{ borderColor: palette.line, color: palette.fg }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: palette.a1 }} />
              {provider}
            </div>
          ))}
        </div>
        <div className="my-2 flex items-center gap-1.5">
          <span className="h-px flex-1" style={{ background: palette.line }} />
          <span className="text-[8px]" style={{ color: palette.muted }}>or</span>
          <span className="h-px flex-1" style={{ background: palette.line }} />
        </div>
        <div className="rounded-md border px-2 py-1.5 text-[8.5px]" style={{ borderColor: palette.line, color: palette.muted }}>
          you@company.com
        </div>
        <div className="mt-1.5 rounded-md py-1.5 text-center text-[9.5px] font-medium" style={{ background: palette.fg, color: palette.bg }}>
          Sign in
        </div>
        <p className="mt-2 text-center text-[8px]" style={{ color: palette.muted }}>No account yet? Start free</p>
      </div>
    </div>
  );
}
