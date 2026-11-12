import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalog from '../data/pro-catalog.json';
import { Segmented, SectionHeader } from '../ui.jsx';
import { CategoryCard, useScrollToCard } from '../cards.jsx';

const section = catalog.sections.blocks;

export default function BlocksPage() {
  const [params] = useSearchParams();
  const highlight = params.get('cat');
  const [sort, setSort] = useState('Newest');
  useScrollToCard(highlight);

  const cards = useMemo(() => {
    if (sort === 'A–Z') return [...section.cards].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Most variants') return [...section.cards].sort((a, b) => b.count - a.count);
    return section.cards;
  }, [sort]);

  return (
    <div className="pro-fade-in">
      <SectionHeader title={section.title} desc={section.desc} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Segmented label="Sort blocks" options={section.sorts} value={sort} onChange={setSort} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground tabular-nums">{section.showing}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {cards.map(card => (
          <CategoryCard key={card.slug} card={card} kind="blocks" highlighted={card.slug === highlight} />
        ))}
      </div>
    </div>
  );
}

