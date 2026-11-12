import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PRO_SECTIONS } from './ProNav.jsx';

const SECTION_LABEL = {
  components: 'Components',
  blocks: 'Blocks',
  appui: 'Application UI',
  templates: 'Templates',
  agentkit: 'Agent Kit',
};

const ROUTE_FOR = {
  components: '/pro/docs/components',
  blocks: '/pro/docs/blocks',
  appui: '/pro/docs/app-ui',
  templates: '/pro/docs/templates',
  agentkit: '/pro/docs/agent-kit',
};

/** Maps a pro.reactbits.dev doc href onto the matching local route. */
function resolve(item) {
  const href = item.href || '';
  const slug = href.split('/').filter(Boolean).pop();
  if (href.startsWith('/docs/components/')) return { to: `/pro/docs/components/${slug}`, external: false };
  if (href.startsWith('/docs/blocks/')) return { to: `/pro/docs/blocks/${slug}`, external: false };
  if (href.startsWith('/docs/app-ui/')) return { to: `/pro/docs/app-ui/${slug}`, external: false };
  if (href.startsWith('/docs/templates/')) return { to: `/pro/docs/templates/${slug}`, external: false };
  if (href.startsWith('/docs/agent-kit/')) return { to: href.replace('/docs/', '/pro/docs/'), external: false };
  if (href.startsWith('/docs/')) return { to: href.replace('/docs/', '/pro/docs/'), external: false };
  if (href === '/#pricing' || href === '/pricing') return { to: '/pro/pricing', external: false };
  if (['/about', '/license', '/privacy', '/roadmap', '/changelog', '/affiliate'].includes(href)) {
    return { to: `/pro${href}`, external: false };
  }
  const own = Object.values(ROUTE_FOR);
  if (own.includes(href)) return { to: href, external: false };
  return { to: `https://pro.reactbits.dev${href.startsWith('/') ? href : `/${href}`}`, external: true };
}

export default function ProSidebar({ sectionKey, sidebars, counts }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const groups = sidebars[sectionKey] || [];
  const current = `${location.pathname}${location.search}`;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <aside className="hidden lg:block sticky shrink-0 w-64 py-4" style={{ top: 73, height: 'calc(100svh - 73px)' }}>
      <div className="flex flex-col h-full w-full rounded-xl border border-border bg-sidebar overflow-hidden">
        <div className="shrink-0 space-y-2 px-3 pb-2 pt-3" ref={ref}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(value => !value)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 h-10 text-sm font-medium hover:border-foreground/20 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <svg
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                <span className="truncate">{SECTION_LABEL[sectionKey]}</span>
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="tabular-nums text-[11px] font-medium text-muted-foreground">
                  {counts?.[sectionKey] ?? ''}
                </span>
                <svg
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            {open ? (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-border bg-popover p-1 shadow-xl pro-fade-in">
                {PRO_SECTIONS.map(section => (
                  <Link
                    key={section.key}
                    to={section.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-2 rounded-md px-2.5 h-8 text-sm transition-colors ${
                      section.to === ROUTE_FOR[sectionKey]
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {section.label}
                    <span className="tabular-nums text-[11px] text-muted-foreground/70">
                      {counts?.[section.key.replace('app-ui', 'appui').replace('agent-kit', 'agentkit')] ?? ''}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="pro-scroll flex-1 overflow-y-auto px-3 pb-4">
          {groups.map(group => (
            <div key={group.label} className="pb-1.5">
              <p className="flex items-center justify-between gap-2 h-7 px-2 text-[11px] font-semibold tracking-[0.04em] text-muted-foreground/80">
                <span className="truncate">{group.label}</span>
                {group.count != null ? <span className="tabular-nums opacity-60">{group.count}</span> : null}
              </p>
              <nav className="flex flex-col">
                {group.items.map(item => {
                  const target = resolve(item);
                  const active = !target.external && current === target.to;
                  const cls = `group flex items-center justify-between gap-2 h-8 px-2 rounded-md text-sm transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`;
                  return target.external ? (
                    <a
                      key={`${group.label}-${item.name}`}
                      href={target.to}
                      target="_blank"
                      rel="noreferrer"
                      className={cls}
                      title="Not part of this clone — opens pro.reactbits.dev"
                    >
                      <span className="truncate">{item.name}</span>
                      <span className="shrink-0 text-[10px] text-muted-foreground/60">↗</span>
                      {item.badge ? (
                        <span className="shrink-0 rounded-[5px] border border-border/60 bg-background/95 px-1.5 py-0.5 text-[10px] font-medium leading-none text-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </a>
                  ) : (
                    <Link key={`${group.label}-${item.name}`} to={target.to} className={cls}>
                      <span className="truncate">{item.name}</span>
                      {item.badge ? (
                        <span className="shrink-0 rounded-[5px] border border-border/60 bg-background/95 px-1.5 py-0.5 text-[10px] font-medium leading-none text-foreground">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}


