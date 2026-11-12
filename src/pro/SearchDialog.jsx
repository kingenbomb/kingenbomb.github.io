import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;

function highlight(text, query) {
  if (!text) return text;
  const q = query.trim();
  if (!q) return text;
  const terms = q.split(/\s+/).filter(term => term.length > 1 || CJK.test(term));
  if (!terms.length) return text;
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = String(text).split(pattern);
  return parts.map((part, index) =>
    terms.some(term => part.toLowerCase() === term.toLowerCase()) ? (
      <mark key={index} className="rounded bg-foreground/15 px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [results, setResults] = useState([]);
  const [ready, setReady] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const deferred = useDeferredValue(query);

  // Load the index lazily: it is ~1000 entries, no reason to pay for it on first paint.
  const ensureIndex = useCallback(async () => {
    if (ready) return;
    const mod = await import('./search.js');
    setSuggestions(mod.SEARCH_SUGGESTIONS);
    setCount(mod.SEARCH_ENTRY_COUNT);
    setReady(true);
    setResults(mod.searchAll(deferred));
  }, [ready, deferred]);

  const openDialog = useCallback(() => {
    setOpen(true);
    ensureIndex();
  }, [ensureIndex]);

  useEffect(() => {
    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(value => {
          if (!value) ensureIndex();
          return !value;
        });
        return;
      }
      if (event.key === 'Escape') setOpen(false);
    };
    const onOpen = () => openDialog();
    window.addEventListener('keydown', onKey);
    window.addEventListener('rbp:search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('rbp:search', onOpen);
    };
  }, [ensureIndex, openDialog]);

  useEffect(() => {
    if (open) {
      setActive(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    import('./search.js').then(mod => {
      if (!alive) return;
      setResults(mod.searchAll(deferred));
      setActive(0);
    });
    return () => {
      alive = false;
    };
  }, [deferred, ready]);

  const flat = useMemo(() => results, [results]);

  const choose = useCallback(
    item => {
      if (!item) return;
      navigate(item.to);
      setOpen(false);
      setQuery('');
    },
    [navigate]
  );

  const onKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(value => Math.min(value + 1, flat.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(value => Math.max(value - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(flat[active]);
    }
  };

  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    node?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const isCjk = CJK.test(query);
  const grouped = flat.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border/70 px-3 py-2.5">
          <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.34-4.34" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="搜索组件、区块、模板… / search anything"
            className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded border border-border/70 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
            >
              clear
            </button>
          ) : (
            <kbd className="rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">esc</kbd>
          )}
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain">
          {!query.trim() ? (
            <div className="p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Try one of these · 试试这些
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setQuery(item.label)}
                    className="group inline-flex items-center gap-1.5 rounded-md border border-border/70 px-2 py-1 text-[12px] hover:border-foreground/25 hover:bg-accent"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.hint}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {ready ? `${count} entries indexed · 中英文都能搜` : 'Loading index…'}
              </p>
            </div>
          ) : flat.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium">No matches for “{query}”</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isCjk
                  ? '试试别的中文词，或直接用英文名（例如 光标 → cursor、渐变 → gradient）。'
                  : 'Try a shorter word, or the Chinese keyword (e.g. cursor → 光标).'}
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {flat.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    data-active={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(item)}
                    className={`flex w-full items-start gap-3 px-3 py-2 text-left ${
                      index === active ? 'bg-accent' : 'bg-transparent'
                    }`}
                  >
                    <span className="mt-0.5 w-[92px] shrink-0 truncate rounded border border-border/70 px-1.5 py-0.5 text-center text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">
                      {item.typeLabel}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{highlight(item.title, query)}</span>
                      {item.desc ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {item.meta ? `${item.meta} · ` : ''}
                          {highlight(item.desc, query)}
                        </span>
                      ) : null}
                      {isCjk && item.zh.length ? (
                        <span className="mt-1 flex flex-wrap gap-1">
                          {[...item.zh]
                            .sort((a, b) => Number(b.includes(query.trim())) - Number(a.includes(query.trim())))
                            .slice(0, 4)
                            .map(keyword => (
                              <span
                                key={keyword}
                                className={`rounded px-1 py-0.5 text-[9.5px] ${
                                  keyword.includes(query.trim())
                                    ? 'bg-foreground/15 text-foreground'
                                    : 'bg-muted/60 text-muted-foreground'
                                }`}
                              >
                                {keyword}
                              </span>
                            ))}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border/70 px-3 py-1.5 text-[10.5px] text-muted-foreground">
          <span>
            {query.trim() && flat.length ? `${flat.length} results · ` : ''}
            ↑↓ 选择 · ↵ 打开 · esc 关闭
          </span>
          <span className="hidden sm:inline">
            {Object.entries(grouped)
              .slice(0, 4)
              .map(([type, amount]) => `${type} ${amount}`)
              .join(' · ')}
          </span>
        </div>
      </div>
    </div>
  );
}
