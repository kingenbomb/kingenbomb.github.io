import { Link } from 'react-router-dom';
/** Pricing / unlock block shown at the bottom of every Pro detail page. */
import detail from './data/pro-detail.json';

const TIER_BLURB = {
  starter: 'Components only',
  pro: 'Components + blocks + App UI',
  ultimate: 'Everything, including templates & agent kit',
};

export default function UnlockPanel({ title, highlight }) {
  const tiers = detail.tiers || [];
  return (
    <section className="mt-12 rounded-2xl border bg-muted/30 p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Unlock {title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Source code, variants and install commands ship with a React Bits Pro licence.
          </p>
        </div>
        <Link
          to="/pro/pricing"
          className="text-xs text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
        >
          Compare plans
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map(tier => {
          const active = highlight && tier.id === highlight;
          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-xl border p-4 ${
                active ? 'border-foreground/25 bg-background' : 'border-border/70 bg-background/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold tracking-tight">{tier.name}</h3>
                {tier.popular ? (
                  <span className="rounded-[5px] border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{TIER_BLURB[tier.id] || tier.description}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                ${tier.lifetime}
                <span className="ml-1 text-xs font-normal text-muted-foreground">lifetime</span>
              </p>
              <ul className="mt-3 flex-1 space-y-1.5">
                {(tier.features || []).slice(0, 4).map(feature => (
                  <li key={feature.text} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className={`mt-4 inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? 'gradient-button'
                    : 'border border-border hover:bg-accent hover:text-accent-foreground'
                }`}
                title="Checkout is handled by pro.reactbits.dev"
              >
                {tier.ctaText} ↗
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

