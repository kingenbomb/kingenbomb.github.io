import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProLogo from './ProLogo.jsx';

export const PRO_SECTIONS = [
  { key: 'components', label: 'Components', to: '/pro/docs/components' },
  { key: 'blocks', label: 'Blocks', to: '/pro/docs/blocks' },
  { key: 'app-ui', label: 'Application UI', to: '/pro/docs/app-ui' },
  { key: 'templates', label: 'Templates', to: '/pro/docs/templates' },
  { key: 'agent-kit', label: 'Agent Kit', to: '/pro/docs/agent-kit' },
];

export default function ProNav({ counts }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = event => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const onKey = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('/pro/docs/components?focus=1');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="w-full px-4 lg:px-8 py-4">
        <div className="relative flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
          <div className="flex flex-1 basis-0 items-center gap-5">
            <Link to="/pro/docs/components" className="flex items-center gap-2 shrink-0" aria-label="React Bits Pro">
              <ProLogo className="h-5 w-auto text-foreground" />
              <span className="rounded-[5px] border border-border px-1.5 py-0.5 text-[10px] font-semibold leading-none tracking-wide text-muted-foreground">
                PRO
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 text-sm" ref={wrapRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(value => !value)}
                  aria-expanded={open}
                  className="inline-flex items-center gap-1 h-9 px-3 rounded-md text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  Library
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
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
                </button>
                {open ? (
                  <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-popover p-1 shadow-xl pro-fade-in">
                    {PRO_SECTIONS.map(section => (
                      <Link
                        key={section.key}
                        to={section.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        {section.label}
                        <span className="tabular-nums text-[11px] text-muted-foreground/70">
                          {counts?.[section.key] ?? ''}
                        </span>
                      </Link>
                    ))}
                    <div className="my-1 h-px bg-border" />
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      Free components
                      <span className="text-[11px] text-muted-foreground/70">→</span>
                    </Link>
                  </div>
                ) : null}
              </div>
              <Link
                to="/pro/docs/introduction"
                className="h-9 px-3 inline-flex items-center rounded-md text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/pro/docs/agent-kit"
                className="h-9 px-3 inline-flex items-center rounded-md text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Agents
              </Link>
              <Link
                to="/pro/pricing"
                className="h-9 px-3 inline-flex items-center rounded-md text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          <div className="flex flex-1 basis-0 items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('rbp:search'))}
              className="inline-flex items-center gap-2 h-9 px-2 sm:pl-3 sm:pr-2 rounded-md border border-border/70 bg-background text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              title="Search components, blocks, templates — 中英文都能搜"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.34-4.34" />
              </svg>
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden sm:inline rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <a
              href="https://pro.reactbits.dev/login"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex h-9 items-center rounded-md px-3 text-sm font-medium tracking-tight text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Sign-in lives on pro.reactbits.dev (this clone has no accounts)"
            >
              Sign In ↗
            </a>
            <Link
              to="/pro/pricing"
              className="gradient-button inline-flex h-10 items-center rounded-md px-3 sm:px-5 text-sm font-semibold tracking-tight whitespace-nowrap"
            >
              <span className="hidden xl:inline">Get Lifetime Access</span>
              <span className="xl:hidden">Get Pro</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

