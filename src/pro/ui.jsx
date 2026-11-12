/** Shared bits of the Pro docs chrome (header, sort switch, filter chips). */
import { Link } from 'react-router-dom';

export function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              ) : null}
              {item.to && !last ? (
                <Link to={item.to} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-foreground' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Small pill used for tier / kind / tag metadata. */
export function MetaPill({ children, className = '' }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-[6px] border border-border/70 bg-muted/40 px-2 text-[11px] font-medium text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

export function PrevNext({ prev, next, to }) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-12 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {prev ? (
        <Link
          to={to(prev)}
          className="group rounded-xl border bg-muted/30 p-4 transition-colors hover:border-foreground/20 hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">← Previous</span>
          <span className="mt-1 block font-medium tracking-tight group-hover:text-foreground">{prev.name}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={to(next)}
          className="group rounded-xl border bg-muted/30 p-4 text-right transition-colors hover:border-foreground/20 hover:bg-muted/50 sm:col-start-2"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next →</span>
          <span className="mt-1 block font-medium tracking-tight group-hover:text-foreground">{next.name}</span>
        </Link>
      ) : null}
    </nav>
  );
}

export function SectionHeader({ title, desc, children }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

export function Segmented({ label, options, value, onChange }) {
  return (
    <div
      aria-label={label}
      role="radiogroup"
      className="inline-flex items-center gap-1 p-1 rounded-lg border border-border/50 bg-muted/40 h-10"
    >
      {options.map(option => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={`px-3 h-8 text-xs font-medium rounded-md transition-colors cursor-pointer focus-visible:outline-none ${
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function Chips({ label, options, value, onChange }) {
  return (
    <div aria-label={label} role="radiogroup" className="flex flex-wrap items-center gap-1.5">
      {options.map(option => {
        const active = option.name === value;
        return (
          <button
            key={option.name}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.name)}
            className={`inline-flex items-center gap-1.5 px-3 h-8 text-xs font-medium rounded-md border transition-colors cursor-pointer focus-visible:outline-none ${
              active
                ? 'bg-secondary border-border text-foreground'
                : 'bg-background border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {option.name}
            <span className={`tabular-nums text-[10px] ${active ? 'opacity-70' : 'opacity-50'}`}>
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchField({ value, onChange, placeholder, innerRef }) {
  return (
    <div className="relative flex-1">
      <svg
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
      >
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" />
      </svg>
      <input
        ref={innerRef}
        aria-label={placeholder}
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-lg border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export function NewBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center shrink-0 px-1.5 py-0.5 rounded-[5px] border border-border/60 bg-background/95 text-[10px] font-medium tracking-tight leading-none text-foreground backdrop-blur-sm shadow-sm ${className}`}
    >
      New
    </span>
  );
}

export function ArrowRight({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-20 text-center">
      <p className="text-sm font-medium">No results{query ? ` for "${query}"` : ''}</p>
      <p className="text-sm text-muted-foreground">Try a different name, a Chinese keyword, or clear the filters.</p>
    </div>
  );
}

export function MissingPage({ what, to, label }) {
  return (
    <div className="pro-fade-in">
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border p-10">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Not in this build</p>
        <h1 className="text-2xl font-semibold tracking-tight">{what} not found</h1>
        <p className="text-sm text-muted-foreground">
          This entry is not part of the local catalogue snapshot. It may have been renamed or removed upstream.
        </p>
        <Link
          to={to}
          className="mt-2 inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
