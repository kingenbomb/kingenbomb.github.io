import { Link, useLocation } from 'react-router-dom';
import site from '../data/site-content.json';
import { Breadcrumb } from '../ui.jsx';
import Blocks from '../page-blocks.jsx';

const ROUTE_KEY = {
  '/pro/about': 'about',
  '/pro/license': 'license',
  '/pro/privacy': 'privacy',
  '/pro/roadmap': 'roadmap',
  '/pro/changelog': 'changelog',
  '/pro/affiliate': 'affiliate',
};

export default function SitePage() {
  const { pathname } = useLocation();
  const page = site[ROUTE_KEY[pathname]];

  if (!page) {
    return (
      <div className="pro-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-muted-foreground">
          <Link to="/pro/docs/components" className="underline">
            Back to the components catalogue
          </Link>
        </p>
      </div>
    );
  }

  // Legal pages are one long column; about/roadmap/changelog read better slightly wider.
  const narrow = pathname === '/pro/license' || pathname === '/pro/privacy';

  return (
    <article className={`pro-fade-in ${narrow ? 'max-w-3xl' : 'max-w-4xl'}`}>
      <Breadcrumb items={[{ label: 'Pro', to: '/pro/docs/components' }, { label: page.title }]} />

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {pathname === '/pro/about' ? page.headline : page.title}
        </h1>
        {page.desc ? <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">{page.desc}</p> : null}
      </header>

      <Blocks blocks={page.blocks} />

      <div className="mt-12 rounded-xl border bg-muted/30 p-5">
        <p className="text-sm text-muted-foreground">
          Browse the{' '}
          <Link to="/pro/docs/components" className="text-foreground underline decoration-border underline-offset-4">
            230 components
          </Link>
          , the{' '}
          <Link to="/pro/docs/blocks" className="text-foreground underline decoration-border underline-offset-4">
            block library
          </Link>{' '}
          or{' '}
          <Link to="/pro/pricing" className="text-foreground underline decoration-border underline-offset-4">
            the licence
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
