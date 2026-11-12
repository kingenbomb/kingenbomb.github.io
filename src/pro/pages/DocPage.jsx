import { Link, useLocation } from 'react-router-dom';
import docs from '../data/docs-content.json';
import { Breadcrumb } from '../ui.jsx';
import Blocks from '../page-blocks.jsx';

const ROUTE_KEY = {
  '/pro/docs/introduction': 'introduction',
  '/pro/docs/installation': 'installation',
  '/pro/docs/mcp': 'mcp',
};

export default function DocPage() {
  const { pathname } = useLocation();
  const page = docs[ROUTE_KEY[pathname]];

  if (!page) {
    return (
      <div className="pro-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight">Docs</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a section from the sidebar, or start with the{' '}
          <Link to="/pro/docs/introduction" className="underline">
            introduction
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <article className="pro-fade-in max-w-3xl">
      <Breadcrumb items={[{ label: 'Docs', to: '/pro/docs/components' }, { label: page.title }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{page.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">{page.desc}</p>
      </header>

      <Blocks blocks={page.blocks} />

      <div className="mt-12 rounded-xl border bg-muted/30 p-5">
        <p className="text-sm text-muted-foreground">
          Need the catalogue too?{' '}
          <Link to="/pro/docs/components" className="text-foreground underline decoration-border underline-offset-4">
            Browse all 230 components
          </Link>
          , or{' '}
          <Link to="/pro/docs/agent-kit" className="text-foreground underline decoration-border underline-offset-4">
            hand the registry to your agent
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
