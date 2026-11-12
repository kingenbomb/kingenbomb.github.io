import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import catalog from '../data/pro-catalog.json';
import { matchesComponent } from '../search-core.js';
import { Chips, EmptyState, NewBadge, SearchField, SectionHeader, Segmented } from '../ui.jsx';

const section = catalog.sections.components;

function Card({ card, eager }) {
  return (
    <Link
      to={`/pro/docs/components/${card.slug}`}
      className="group relative flex flex-col h-full rounded-xl border bg-muted/50 p-1 transition-all hover:border-foreground/20 hover:shadow-md"
      title={`Open ${card.name}`}
    >
      <div className="relative">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-background">
          <img
            alt={`${card.name} preview`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover transition-transform duration-500 group-hover:scale-[1.14]"
            src={card.img}
          />
        </div>
        {card.isNew ? <NewBadge className="absolute top-2 right-2" /> : null}
      </div>
      <div className="flex flex-col flex-1 px-3 pt-3 pb-2">
        <h3 className="font-semibold tracking-tight leading-tight truncate mb-1.5">{card.name}</h3>
        <p className="text-sm text-muted-foreground truncate">{card.description}</p>
      </div>
    </Link>
  );
}

export default function ComponentsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const [sort, setSort] = useState('Newest');
  const [filter, setFilter] = useState(() => params.get('group') || 'All');
  const inputRef = useRef(null);

  useEffect(() => {
    const group = params.get('group');
    if (group) setFilter(group);
  }, [params]);

  const changeFilter = value => {
    setFilter(value);
    const next = new URLSearchParams(params);
    if (value && value !== 'All') next.set('group', value);
    else next.delete('group');
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (!params.get('focus')) return;
    inputRef.current?.focus();
    const next = new URLSearchParams(params);
    next.delete('focus');
    setParams(next, { replace: true });
  }, [params, setParams]);

  const cards = useMemo(() => {
    let list = section.cards.filter(card => {
      if (filter === 'New' && !card.isNew) return false;
      if (filter !== 'All' && filter !== 'New' && card.group !== filter) return false;
      return matchesComponent(card, query);
    });
    if (sort === 'A–Z') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Z–A') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [query, filter, sort]);

  return (
    <div className="pro-fade-in">
      <SectionHeader title={section.title} desc={section.desc} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchField
          innerRef={inputRef}
          value={query}
          onChange={value => {
            const next = new URLSearchParams(params);
            if (value) next.set('q', value);
            else next.delete('q');
            setParams(next, { replace: true });
          }}
          placeholder={`${section.search.replace('...', '')} — 中英文都行`}
        />
        <Segmented label="Sort components" options={section.sorts} value={sort} onChange={setSort} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-6">
        <Chips label="Filter by category" options={section.filters} value={filter} onChange={changeFilter} />
        <p className="text-xs text-muted-foreground tabular-nums">
          {cards.length} {cards.length === 1 ? 'component' : 'components'}
        </p>
      </div>

      {cards.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {cards.map((card, index) => (
            <Card key={card.slug} card={card} eager={index < 6} />
          ))}
        </div>
      )}
    </div>
  );
}
