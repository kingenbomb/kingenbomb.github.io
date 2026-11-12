import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalog from '../data/pro-catalog.json';
import { SectionHeader, Segmented } from '../ui.jsx';
import { TemplateCard, useScrollToCard } from '../cards.jsx';

const section = catalog.sections.templates;

export default function TemplatesPage() {
  const [params] = useSearchParams();
  const highlight = params.get('cat');
  const [sort, setSort] = useState('Newest');
  useScrollToCard(highlight);

  const cards = useMemo(() => {
    if (sort === 'A–Z') return [...section.cards].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'Z–A') return [...section.cards].sort((a, b) => b.name.localeCompare(a.name));
    return section.cards;
  }, [sort]);

  return (
    <div className="pro-fade-in">
      <SectionHeader title={section.title} desc={section.desc} />

      <div className="flex items-center justify-between mb-6 gap-3">
        <p className="text-sm text-muted-foreground">{section.countLabel}</p>
        <Segmented label="Sort templates" options={section.sorts} value={sort} onChange={setSort} />
      </div>

      <div id={highlight ? `cat-${highlight}` : undefined} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
        {cards.map(card => (
          <TemplateCard key={card.slug} card={card} />
        ))}
      </div>
    </div>
  );
}
