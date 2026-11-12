import { Component, useEffect, useMemo, useState } from 'react';
import { PATTERNS, PATTERN_META, configOf, loadPatternSource } from './patterns/index.js';

class PatternBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
          This reimplementation failed to render in your browser.
        </div>
      );
    }
    return this.props.children;
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = event => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const TABS = [
  { id: 'live', label: 'Live' },
  { id: 'capture', label: 'Official capture' },
  { id: 'code', label: 'Code' },
];

export default function PatternPreview({ spec, name, description, capture, slug, unit = 'component' }) {
  const [tab, setTab] = useState('live');
  const [source, setSource] = useState('');
  const [copied, setCopied] = useState('');
  const reduced = useReducedMotion();

  const Pattern = PATTERNS[spec.pattern] || PATTERNS.dotField;
  const [metaTitle, metaDesc] = PATTERN_META[spec.pattern] || ['Pattern', ''];
  const config = useMemo(() => configOf(spec), [spec]);

  useEffect(() => {
    let alive = true;
    if (tab === 'code' && !source) {
      loadPatternSource(spec.pattern).then(text => {
        if (alive) setSource(text || '');
      });
    }
    return () => {
      alive = false;
    };
  }, [tab, source, spec.pattern]);

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setCopied('');
    }
  };

  const configText = `const config = ${JSON.stringify(config, null, 2)};`;
  const usage = `<${spec.pattern} ${Object.entries(config)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')} />`;

  const forAI = [
    `Reimplementation of the "${name}" effect for a React clone (the original source is paid).`,
    description ? `What it does: ${description}` : '',
    `Pattern: ${spec.pattern} (${metaTitle}).`,
    '',
    '```jsx',
    source.replace(/^\/\*\*[\s\S]*?\*\/\s*/, ''),
    '```',
    '',
    'Usage:',
    '```jsx',
    usage,
    '```',
    '',
    configText,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <figure className="rounded-xl border bg-muted/50 p-1">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-background">
        {tab === 'live' ? (
          <PatternBoundary>
            <div className="absolute inset-0">
              <Pattern {...config} />
            </div>
          </PatternBoundary>
        ) : tab === 'capture' ? (
          capture ? (
            <img
              src={capture}
              alt={`${name} official capture`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="grid h-full place-items-center p-6 text-center text-xs text-muted-foreground">
              No official capture was published for this {unit}.
            </div>
          )
        ) : (
          <div className="absolute inset-0 overflow-auto bg-[#0a0a0a] p-3">
            {source ? (
              <pre className="text-[11px] leading-relaxed text-foreground/85">
                <code className="font-mono">{source}</code>
              </pre>
            ) : (
              <p className="p-4 text-xs text-muted-foreground">Loading source…</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 px-2 pt-2">
        <div className="flex rounded-md border border-border/70 p-0.5">
          {TABS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded px-2.5 py-1 text-[11px] transition-colors ${
                tab === item.id
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'code' ? (
          <div className="ml-auto flex gap-1.5">
            <button
              type="button"
              onClick={() => copy(source, 'code')}
              className="rounded-md border border-border/70 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              {copied === 'code' ? 'Copied' : 'Copy code'}
            </button>
            <button
              type="button"
              onClick={() => copy(forAI, 'ai')}
              className="rounded-md border border-border/70 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
            >
              {copied === 'ai' ? 'Copied' : 'Copy for AI'}
            </button>
          </div>
        ) : (
          <span className="ml-auto text-[11px] text-muted-foreground">
            {tab === 'live' ? `${metaTitle} · ${spec.pattern}` : 'Published by the original site'}
          </span>
        )}
      </div>

      <figcaption className="px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
        {tab === 'live' ? (
          <>
            {spec.kind === 'layout'
              ? 'My own layout, rebuilt from the official capture — the paid source is not reproduced.'
              : 'My own implementation, written from the official capture — the paid source is not reproduced.'}
            {metaDesc ? ` ${metaDesc}` : ''}
            {reduced ? ' Animations keep running; this browser reports prefers-reduced-motion.' : ''}
          </>
        ) : tab === 'capture' ? (
          <>Official 16:9 dark capture of the live component, as published on the catalogue.</>
        ) : (
          <>
            Source of <code className="font-mono">{spec.pattern}.jsx</code> (
            {spec.kind === 'layout' ? 'layout' : 'pattern'} for {slug}), MIT + Commons Clause, © David Haz.
          </>
        )}
      </figcaption>
    </figure>
  );
}
