import { useParams } from 'react-router-dom';
import detail from '../data/pro-detail.json';
import liveSpecs from '../data/live-specs.json';
import PatternPreview from '../live/PatternPreview.jsx';
import { Breadcrumb, MetaPill, MissingPage, NewBadge, PrevNext } from '../ui.jsx';
import UnlockPanel from '../unlock.jsx';
import { SaveButton } from '../saved.jsx';

const list = detail.components;
const index = new Map(list.map((item, i) => [item.slug, i]));

export default function ComponentDetail() {
  const { slug } = useParams();
  const at = index.get(slug);

  if (at === undefined) {
    return <MissingPage what="Component" to="/pro/docs/components" label="Back to all components" />;
  }

  const comp = list[at];
  const prev = at > 0 ? list[at - 1] : null;
  const next = at < list.length - 1 ? list[at + 1] : null;

  return (
    <article className="pro-fade-in">
      <Breadcrumb
        items={[
          { label: 'Docs', to: '/pro/docs/components' },
          { label: 'Components', to: '/pro/docs/components' },
          { label: comp.group, to: `/pro/docs/components?group=${encodeURIComponent(comp.group)}` },
          { label: comp.name },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1.5 flex flex-wrap items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {comp.name}
            {comp.isNew ? <NewBadge className="translate-y-0.5" /> : null}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{comp.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0 sm:mt-1">
          <SaveButton
            entry={{
              slug: comp.slug,
              name: comp.name,
              description: comp.description,
              img: comp.preview,
              to: `/pro/docs/components/${comp.slug}`,
            }}
          />
          <MetaPill>{comp.tier}</MetaPill>
          <MetaPill>{comp.group}</MetaPill>
        </div>
      </header>

      <PatternPreview
        key={comp.slug}
        spec={liveSpecs[comp.slug] || { pattern: 'dotField', palette: { bg: '#0a0a0a', fg: '#f4f4f5', a1: '#6a4bff', a2: '#22d3ee' }, density: 0.5, speed: 0.4, seed: 1, label: comp.name.toUpperCase() }}
        name={comp.name}
        description={comp.description}
        animated={comp.animated}
        capture={comp.animated}
        slug={comp.slug}
        unit="component"
      />

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border bg-muted/20 p-4 text-sm md:grid-cols-4">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Category</dt>
          <dd className="mt-1 font-medium">{comp.group}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">License tier</dt>
          <dd className="mt-1 font-medium capitalize">{comp.tier}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Code variants</dt>
          <dd className="mt-1 flex flex-wrap gap-1.5">
            {comp.codeVariants.length
              ? comp.codeVariants.map(variant => (
                  <span
                    key={variant}
                    className="rounded-[5px] border border-border/70 bg-background px-1.5 py-0.5 font-mono text-[11px]"
                  >
                    {variant}
                  </span>
                ))
              : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Tags</dt>
          <dd className="mt-1 truncate text-muted-foreground">{comp.tags.join(', ') || '—'}</dd>
        </div>
      </dl>

      <UnlockPanel title={comp.name} highlight={comp.tier} />

      <PrevNext
        prev={prev}
        next={next}
        to={item => `/pro/docs/components/${item.slug}`}
      />
    </article>
  );
}

