import { Link, useParams } from 'react-router-dom';
import detail from '../data/pro-detail.json';
import { Breadcrumb, MetaPill, MissingPage, PrevNext } from '../ui.jsx';

const KIND_LABEL = { setup: 'Setup', skill: 'Skill', prompt: 'Prompt', recipe: 'Recipe' };
const KIND_PATH = { setup: 'setup', skill: 'skills', prompt: 'prompts', recipe: 'recipes' };

const list = detail.agentKit;
const bySlug = new Map(list.map((item, i) => [item.slug, i]));
const allSlugs = new Set(list.map(item => item.slug));

function resolvePair(slug) {
  if (allSlugs.has(slug)) return slug;
  const stripped = slug.replace(/^(prompt|recipe|skill)-/, '');
  if (allSlugs.has(stripped)) return stripped;
  return list.find(item => slug.endsWith(item.slug))?.slug || null;
}

const hrefFor = item => `/pro/docs/agent-kit/${KIND_PATH[item.kind] || 'skills'}/${item.slug}`;

export default function AgentKitDetail() {
  const { slug } = useParams();
  const at = bySlug.get(slug);

  if (at === undefined) {
    return <MissingPage what="Agent kit item" to="/pro/docs/agent-kit" label="Back to agent kit" />;
  }

  const item = list[at];
  const prev = at > 0 ? list[at - 1] : null;
  const next = at < list.length - 1 ? list[at + 1] : null;
  const pairs = (item.pairsWith || []).map(resolvePair).filter(Boolean);

  return (
    <article className="pro-fade-in">
      <Breadcrumb
        items={[
          { label: 'Docs', to: '/pro/docs/components' },
          { label: 'Agent Kit', to: '/pro/docs/agent-kit' },
          { label: item.name },
        ]}
      />

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <MetaPill className="uppercase tracking-[0.08em]">{KIND_LABEL[item.kind] || item.kind}</MetaPill>
          {item.category ? <MetaPill>{item.category}</MetaPill> : null}
          {item.version ? <MetaPill>v{item.version}</MetaPill> : null}
        </div>
        <h1 className="mb-1.5 text-3xl font-semibold tracking-tight md:text-4xl">{item.name}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{item.summary}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {[
            KIND_LABEL[item.kind] || item.kind,
            item.category,
            item.outline.length ? `${item.outline.length} sections` : null,
            item.wordCount ? `${item.wordCount.toLocaleString()} words` : null,
            item.version ? `v ${item.version}` : null,
            item.updated ? `updated ${item.updated}` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>

      {item.showcase.length ? (
        <section className="mb-8">
          <h2 className="mb-1 text-lg font-semibold tracking-tight">What this produces</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Screenshots of a real page built by following {item.name}.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {item.showcase.map(shot => (
              <figure key={shot.title} className="overflow-hidden rounded-xl border bg-muted/40 p-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-background">
                  {shot.img ? (
                    <img src={shot.img} alt={shot.title} loading="lazy" className="h-full w-full object-cover object-top" />
                  ) : null}
                </div>
                <figcaption className="px-2 py-2 text-[11px] leading-snug text-muted-foreground">{shot.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {item.whenToUse ? (
        <section className="mb-8 rounded-xl border-l-2 border-foreground/25 bg-muted/30 px-4 py-3">
          <h2 className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">When to use</h2>
          <p className="text-sm leading-relaxed">{item.whenToUse}</p>
        </section>
      ) : null}

      {item.preview ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Preview</h2>
          <div className="rounded-xl border bg-muted/20 p-5">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{item.preview}</p>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Public excerpt. The full text ships with the licence.
          </p>
        </section>
      ) : null}

      {item.outline.length ? (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">What is inside</h2>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {item.outline.map(line => (
              <li key={line} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {item.name} is included with Pro and Ultimate
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Sign in with the email you purchased with to read the full {KIND_LABEL[item.kind]?.toLowerCase() || 'item'},
              copy it into your agent, and install it from the registry.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/pro/pricing"
              className="gradient-button inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium"
            >
              Unlock the kit
            </Link>
            <Link
              to="/pro/docs/agent-kit"
              className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              All of the kit
            </Link>
          </div>
        </div>
      </section>

      {pairs.length ? (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Pairs with</h2>
          <ul className="flex flex-wrap gap-2">
            {pairs.map(slug => {
              const target = list[bySlug.get(slug)];
              return (
                <li key={slug}>
                  <Link
                    to={hrefFor(target)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-foreground/25 hover:bg-muted/60"
                  >
                    {target.name}
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground">
        Licensed for use in your own and your clients' projects under the React Bits Pro licence. Text and screenshots
        belong to David Haz / React Bits Pro.
      </p>

      <PrevNext prev={prev} next={next} to={hrefFor} />
    </article>
  );
}

