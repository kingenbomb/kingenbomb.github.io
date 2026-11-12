import { Link, useParams } from 'react-router-dom';
import detail from '../data/pro-detail.json';
import { Breadcrumb, MetaPill, MissingPage, NewBadge, PrevNext } from '../ui.jsx';

const list = detail.templates;
const index = new Map(list.map((item, i) => [item.slug, i]));

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-muted-foreground">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function TemplateDetail() {
  const { slug } = useParams();
  const at = index.get(slug);

  if (at === undefined) {
    return <MissingPage what="Template" to="/pro/docs/templates" label="Back to templates" />;
  }

  const tpl = list[at];
  const prev = at > 0 ? list[at - 1] : null;
  const next = at < list.length - 1 ? list[at + 1] : null;

  return (
    <article className="pro-fade-in">
      <Breadcrumb
        items={[
          { label: 'Docs', to: '/pro/docs/components' },
          { label: 'Templates', to: '/pro/docs/templates' },
          { label: tpl.name },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1.5 flex flex-wrap items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {tpl.name}
            {tpl.isNew ? <NewBadge className="translate-y-0.5" /> : null}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{tpl.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tpl.tags.map(tag => (
              <span key={tag} className="rounded-[5px] border border-border/70 bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:mt-1">
          <div className="flex items-center gap-2">
            <MetaPill>{tpl.tier}</MetaPill>
            {tpl.isFree ? <MetaPill>Free</MetaPill> : null}
          </div>
          <a
            href={tpl.buyUrl}
            target="_blank"
            rel="noreferrer"
            className="gradient-button inline-flex h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium"
            title="Checkout is handled by pro.reactbits.dev"
          >
            Buy template — $49 ↗
          </a>
          <a
            href={tpl.livePreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-3.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            title="The live deployment of this template runs on Vercel"
          >
            Live preview ↗
          </a>
        </div>
      </header>

      <figure className="rounded-xl border bg-muted/50 p-1">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-background">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            poster={tpl.poster}
            src={tpl.video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-[11px] text-muted-foreground">
          <span>Screen recording of the live template.</span>
          <span className="font-mono">{tpl.slug}</span>
        </figcaption>
      </figure>

      {tpl.builtWith.length ? (
        <section className="mt-8 border-b pb-8">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Built With</h2>
          <div className="flex flex-wrap gap-2">
            {tpl.builtWith.map(item => (
              <span key={item} className="rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">About this template</h2>
        {tpl.about ? (
          <p className="text-base leading-relaxed text-muted-foreground">{tpl.about}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{tpl.description}</p>
        )}
      </section>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {tpl.features.length ? (
          <section>
            <h3 className="mb-3 text-base font-semibold tracking-tight">Special Features</h3>
            <ul className="space-y-2">
              {tpl.features.map(item => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {tpl.sections.length ? (
          <section>
            <h3 className="mb-3 text-base font-semibold tracking-tight">Included Sections</h3>
            <ul className="space-y-2">
              {tpl.sections.map(item => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Get {tpl.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              One-off $49, or included in the Ultimate licence with every other template.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={tpl.buyUrl}
              target="_blank"
              rel="noreferrer"
              className="gradient-button inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium"
            >
              Buy template ↗
            </a>
            <Link
              to="/pro/docs/templates"
              className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              All templates
            </Link>
          </div>
        </div>
      </section>

      <PrevNext prev={prev} next={next} to={item => `/pro/docs/templates/${item.slug}`} />
    </article>
  );
}
