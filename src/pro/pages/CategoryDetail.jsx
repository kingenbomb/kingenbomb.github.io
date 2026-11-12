import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import detail from '../data/pro-detail.json';
import { Breadcrumb, MetaPill, MissingPage, NewBadge, PrevNext } from '../ui.jsx';

const SECTIONS = {
  blocks: { list: detail.blocks, label: 'Blocks', base: '/pro/docs/blocks', unit: 'block' },
  appUi: { list: detail.appUi, label: 'Application UI', base: '/pro/docs/app-ui', unit: 'category' },
};

function VariantCard({ variant, href }) {
  return (
    <Link
      to={href}
      className="group relative flex flex-col h-full rounded-xl border bg-muted/50 p-1 transition-all hover:border-foreground/20 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-background">
        {variant.img ? (
          <img
            src={variant.img}
            alt={`${variant.name} preview`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">No capture</div>
        )}
        {variant.isNew ? <NewBadge className="absolute top-2 right-2" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-3 pb-2">
        <h3 className="font-semibold tracking-tight leading-tight truncate">{variant.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{variant.description}</p>
        <span className="mt-auto pt-2 inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          Open
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

function VariantRow({ variant, href }) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-4 rounded-xl border bg-muted/30 p-2 transition-colors hover:border-foreground/20 hover:bg-muted/50"
    >
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border bg-background">
        {variant.img ? (
          <img src={variant.img} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium tracking-tight">{variant.name}</h3>
          {variant.isNew ? <NewBadge /> : null}
        </div>
        <p className="truncate text-sm text-muted-foreground">{variant.description}</p>
      </div>
      <span className="hidden shrink-0 pr-2 text-xs text-muted-foreground group-hover:text-foreground sm:block">→</span>
    </Link>
  );
}

export default function CategoryDetail({ kind }) {
  const config = SECTIONS[kind];
  const { cat } = useParams();
  const [sort, setSort] = useState('Default');
  const [view, setView] = useState('Grid');

  const at = config.list.findIndex(item => item.slug === cat);
  const entry = at >= 0 ? config.list[at] : null;

  const variants = useMemo(() => {
    if (!entry) return [];
    if (sort === 'Newest') {
      return [...entry.variants].sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name));
    }
    return entry.variants;
  }, [entry, sort]);

  if (!entry) {
    return <MissingPage what={config.unit === 'block' ? 'Block' : 'Category'} to={config.base} label={`Back to ${config.label}`} />;
  }

  const prev = at > 0 ? config.list[at - 1] : null;
  const next = at < config.list.length - 1 ? config.list[at + 1] : null;
  const hrefFor = variant => `${config.base}/${entry.slug}/${variant.slug}`;

  return (
    <article className="pro-fade-in">
      <Breadcrumb
        items={[
          { label: 'Docs', to: '/pro/docs/components' },
          { label: config.label, to: config.base },
          { label: entry.name },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1.5 text-3xl font-semibold tracking-tight md:text-4xl">{entry.name}</h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{entry.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:mt-1">
          <MetaPill>{entry.count} variants</MetaPill>
          <MetaPill>{entry.tier}</MetaPill>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Sort variants" className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
          {['Default', 'Newest'].map(option => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={sort === option}
              onClick={() => setSort(option)}
              className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                sort === option ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div role="radiogroup" aria-label="View mode" className="inline-flex h-9 items-center gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
          {['Grid', 'List'].map(option => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={view === option}
              onClick={() => setView(option)}
              className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
                view === option ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {view === 'Grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map(variant => (
            <VariantCard key={variant.slug} variant={variant} href={hrefFor(variant)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {variants.map(variant => (
            <VariantRow key={variant.slug} variant={variant} href={hrefFor(variant)} />
          ))}
        </div>
      )}

      <PrevNext prev={prev} next={next} to={item => `${config.base}/${item.slug}`} />
    </article>
  );
}
