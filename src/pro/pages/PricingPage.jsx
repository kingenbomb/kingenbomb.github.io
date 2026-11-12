import detail from '../data/pro-detail.json';
import { Breadcrumb } from '../ui.jsx';

export default function PricingPage() {
  const tiers = detail.tiers || [];
  return (
    <article className="pro-fade-in">
      <Breadcrumb items={[{ label: 'Docs', to: '/pro/docs/components' }, { label: 'Pricing' }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Pricing</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          One licence, the whole library in your repo. Every plan is a one-off payment — no subscription, no seat
          counting, and every future drop is included.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map(tier => (
          <div
            key={tier.id}
            className={`flex flex-col rounded-2xl border p-5 ${
              tier.popular ? 'border-foreground/25 bg-background shadow-sm' : 'border-border/70 bg-muted/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold tracking-tight">{tier.name}</h2>
              {tier.popular ? (
                <span className="rounded-[5px] border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Popular
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{tier.description}</p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-tight tabular-nums">${tier.lifetime}</span>
              <span className="text-xs text-muted-foreground">one-off</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
              or ${tier.annual}/yr{Array.isArray(tier.includes) ? ` · includes ${tier.includes.join(' + ')}` : ''}
            </p>
            <ul className="mt-4 flex-1 space-y-2">
              {(tier.features || []).map(feature => (
                <li key={feature.text} className="flex gap-2 text-sm text-muted-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-[3px] h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
            <a
              href={tier.checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className={`mt-5 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors ${
                tier.popular ? 'gradient-button' : 'border border-border hover:bg-accent hover:text-accent-foreground'
              }`}
              title="Checkout runs on pro.reactbits.dev"
            >
              {tier.ctaText} ↗
            </a>
          </div>
        ))}
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ['Every future drop included', 'New components, blocks and templates land in your repo with your existing licence.'],
          ['Commercial licence', 'Unlimited projects, your own and your clients. No attribution required.'],
          ['The code is yours', 'Files are copied in, not installed from node_modules. Nothing breaks if you never update.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border bg-muted/20 p-4">
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground">
        Prices and checkout are read from the public React Bits Pro catalogue (pro-manifest.json). Payment is handled by
        Polar on pro.reactbits.dev — this clone has no backend and cannot take an order.
      </p>
    </article>
  );
}
