import { useEffect, useState } from 'react';

const KEY = 'rbp:saved-v1';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('rbp:saved'));
}

export function useSaved() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener('rbp:saved', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('rbp:saved', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const has = slug => items.some(item => item.slug === slug);

  const toggle = entry => {
    const next = has(entry.slug) ? items.filter(item => item.slug !== entry.slug) : [...items, entry];
    write(next);
    setItems(next);
  };

  const remove = slug => {
    const next = items.filter(item => item.slug !== slug);
    write(next);
    setItems(next);
  };

  return { items, has, toggle, remove };
}

export function SaveButton({ entry, className = '' }) {
  const { has, toggle } = useSaved();
  const saved = has(entry.slug);
  return (
    <button
      type="button"
      onClick={() => toggle(entry)}
      aria-pressed={saved}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium transition-colors ${
        saved ? 'bg-foreground text-background border-transparent' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
      } ${className}`}
      title={saved ? 'Remove from saved' : 'Save for later'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
