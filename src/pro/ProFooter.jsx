import { Link } from 'react-router-dom';
import ProLogo from './ProLogo.jsx';

const OWN = {
  '/': '/pro/docs/components',
  '/#pricing': '/pro/pricing',
  '/docs/components': '/pro/docs/components',
  '/docs/blocks': '/pro/docs/blocks',
  '/docs/app-ui': '/pro/docs/app-ui',
  '/docs/templates': '/pro/docs/templates',
  '/docs/agent-kit': '/pro/docs/agent-kit',
  '/docs/introduction': '/pro/docs/introduction',
  '/docs/installation': '/pro/docs/installation',
  '/docs/mcp': '/pro/docs/mcp',
  '/docs/saved': '/pro/docs/saved',
  '/about': '/pro/about',
  '/license': '/pro/license',
  '/privacy': '/pro/privacy',
  '/roadmap': '/pro/roadmap',
  '/changelog': '/pro/changelog',
  '/affiliate': '/pro/affiliate',
  'https://reactbits.dev': '/',
};

function FooterLink({ href, label }) {
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {label}
      </a>
    );
  }
  if (OWN[href]) {
    return (
      <Link to={OWN[href]} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {label}
      </Link>
    );
  }
  const url = href.startsWith('http') ? href : `https://pro.reactbits.dev${href}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      title="Not part of this clone — opens pro.reactbits.dev"
    >
      {label} <span className="text-[10px] text-muted-foreground/60">↗</span>
    </a>
  );
}

export default function ProFooter({ footer }) {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto w-full max-w-[1500px] px-6 py-12 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(2,1fr)] lg:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link to="/pro/docs/components" className="inline-flex items-center gap-2" aria-label="React Bits Pro">
              <ProLogo className="h-5 w-auto text-foreground" />
              <span className="rounded-[5px] border border-border px-1.5 py-0.5 text-[10px] font-semibold leading-none tracking-wide text-muted-foreground">
                PRO
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{footer.tagline}</p>
            <a
              href={`mailto:${footer.email}`}
              className="mt-3 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {footer.email}
            </a>
          </div>
          {footer.columns.map(column => (
            <div key={column.title}>
              <p className="mb-3 text-xs font-semibold tracking-[0.04em] text-foreground">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map(([label, href]) => (
                  <li key={`${column.title}-${label}`}>
                    <FooterLink href={href} label={label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p>
            Clone build — content and previews belong to{' '}
            <a
              href="https://pro.reactbits.dev"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 hover:text-foreground"
            >
              reactbits.dev
            </a>{' '}
            © David Haz.
          </p>
        </div>
      </div>
    </footer>
  );
}

