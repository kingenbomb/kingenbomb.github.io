import { Link, useParams } from 'react-router-dom';
import detail from '../data/pro-detail.json';
import blockSpecs from '../data/block-specs.json';
import PatternPreview from '../live/PatternPreview.jsx';
import { Breadcrumb, MetaPill, MissingPage, NewBadge } from '../ui.jsx';
import UnlockPanel from '../unlock.jsx';

const SECTIONS = {
  blocks: { list: detail.blocks, label: 'Blocks', base: '/pro/docs/blocks', unit: 'Block' },
  appUi: { list: detail.appUi, label: 'Application UI', base: '/pro/docs/app-ui', unit: 'App UI' },
};

export default function VariantDetail({ kind }) {
  const config = SECTIONS[kind];
  const { cat, variant: variantSlug } = useParams();

  const at = config.list.findIndex(item => item.slug === cat);
  const category = at >= 0 ? config.list[at] : null;
  const vAt = category ? category.variants.findIndex(item => item.slug === variantSlug) : -1;
  const variant = vAt >= 0 ? category.variants[vAt] : null;

  if (!category || !variant) {
    return <MissingPage what={config.unit} to={`${config.base}/${cat || ''}`} label="Back to category" />;
  }

  const prev = vAt > 0 ? category.variants[vAt - 1] : null;
  const next = vAt < category.variants.length - 1 ? category.variants[vAt + 1] : null;

  return (
    <article className="pro-fade-in">
      <Breadcrumb
        items={[
          { label: 'Docs', to: '/pro/docs/components' },
          { label: config.label, to: config.base },
          { label: category.name, to: `${config.base}/${category.slug}` },
          { label: variant.name },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1.5 flex flex-wrap items-center gap-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {variant.name}
            {variant.isNew ? <NewBadge className="translate-y-0.5" /> : null}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{variant.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:mt-1">
          <MetaPill>{category.name}</MetaPill>
          <MetaPill>{category.tier}</MetaPill>
        </div>
      </header>

      <PatternPreview
        key={variant.slug}
        spec={
          blockSpecs[variant.slug] || {
            kind: 'layout',
            pattern: 'cards',
            palette: {
              bg: '#0a0a0a',
              panel: '#141414',
              line: '#262626',
              muted: '#a1a1aa',
              fg: '#f4f4f5',
              a1: '#8b5cf6',
              a2: '#22d3ee',
            },
            label: variant.name,
            desc: variant.description,
          }
        }
        name={variant.name}
        description={variant.description}
        capture={variant.img}
        slug={variant.slug}
        unit={config.unit.toLowerCase()}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Category</p>
          <Link to={`${config.base}/${category.slug}`} className="mt-1 block font-medium hover:underline">
            {category.name}
          </Link>
        </div>
        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Variants in category</p>
          <p className="mt-1 font-medium tabular-nums">{category.variants.length}</p>
        </div>
        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Install name</p>
          <p className="mt-1 truncate font-mono text-sm">{variant.registryName || variant.slug}</p>
        </div>
      </div>

      <UnlockPanel title={variant.name} highlight={category.tier} />

      <nav className="mt-12 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`${config.base}/${category.slug}/${prev.slug}`}
            className="group rounded-xl border bg-muted/30 p-4 transition-colors hover:border-foreground/20 hover:bg-muted/50"
          >
            <span className="text-xs text-muted-foreground">← Previous</span>
            <span className="mt-1 block font-medium tracking-tight group-hover:text-foreground">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`${config.base}/${category.slug}/${next.slug}`}
            className="group rounded-xl border bg-muted/30 p-4 text-right transition-colors hover:border-foreground/20 hover:bg-muted/50 sm:col-start-2"
          >
            <span className="block text-xs text-muted-foreground">Next →</span>
            <span className="mt-1 block font-medium tracking-tight group-hover:text-foreground">{next.name}</span>
          </Link>
        ) : null}
      </nav>

      <p className="mb-8 text-center text-sm">
        <Link to={`${config.base}/${category.slug}`} className="text-muted-foreground hover:text-foreground hover:underline">
          All {category.variants.length} {category.name} variants
        </Link>
      </p>
    </article>
  );
}
