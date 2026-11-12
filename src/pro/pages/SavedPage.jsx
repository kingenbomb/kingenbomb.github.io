import { Link } from 'react-router-dom';
import { useSaved } from '../saved.jsx';
import { Breadcrumb } from '../ui.jsx';

export default function SavedPage() {
  const { items, remove } = useSaved();

  return (
    <article className="pro-fade-in">
      <Breadcrumb items={[{ label: 'Docs', to: '/pro/docs/components' }, { label: 'Saved' }]} />

      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Saved</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Bookmarks you keep while browsing. They live in this browser (localStorage) — no account, no server, and they
          survive a reload.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open any component and hit <span className="font-medium text-foreground">Save</span>.
          </p>
          <Link
            to="/pro/docs/components"
            className="mt-4 inline-flex h-9 items-center rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Browse components
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(item => (
            <li key={item.slug} className="group relative flex flex-col rounded-xl border bg-muted/40 p-1">
              <Link to={item.to} className="flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-background">
                  {item.img ? (
                    <img src={item.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="px-3 pt-3">
                  <p className="truncate font-semibold tracking-tight">{item.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => remove(item.slug)}
                className="mx-3 my-3 inline-flex h-8 items-center justify-center rounded-md border border-border text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
