import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalog from '../data/pro-catalog.json';
import { Chips, SectionHeader } from '../ui.jsx';
import { CategoryCard, useScrollToCard } from '../cards.jsx';

const section = catalog.sections['app-ui'];

export default function AppUiPage() {
  const [params] = useSearchParams();
  const highlight = params.get('cat');
  const [filter, setFilter] = useState('All');
  useScrollToCard(highlight);

  const options = useMemo(
    () => [{ name: 'All', count: section.cards.length }, ...section.filters],
    []
  );

  const cards = useMemo(
    () => (filter === 'All' ? section.cards : section.cards.filter(card => card.category === filter)),
    [filter]
  );

  return (
    <div className="pro-fade-in">
      <SectionHeader title={section.title} desc={section.desc} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4">
        <Chips label="Filter by category" options={options} value={filter} onChange={setFilter} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground tabular-nums">
          Showing {cards.length} of {section.cards.length} categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {cards.map(card => (
          <CategoryCard key={card.slug} card={card} kind="appUi" highlighted={card.slug === highlight} />
        ))}
      </div>
    </div>
  );
}

