import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import catalog from '../data/pro-catalog.json';
import { Chips } from '../ui.jsx';
import { useScrollToCard } from '../cards.jsx';

const section = catalog.sections['agent-kit'];

const KIND_LABEL = { setup: 'Setup', skill: 'Skill', prompt: 'Prompt', recipe: 'Recipe' };
const KIND_PATH = { setup: 'setup', skill: 'skills', prompt: 'prompts', recipe: 'recipes' };
const FILTER_KIND = { Skills: 'skill', Prompts: 'prompt', Recipes: 'recipe', Setup: 'setup' };

function AgentKitCard({ card, highlighted }) {
  return (
    <li
      id={`cat-${card.slug}`}
      className={`group relative flex h-full flex-col rounded-xl border bg-muted/50 transition-[box-shadow,border-color] duration-300 hover:shadow-[0_12px_32px_-16px_rgb(0_0_0/0.28)] dark:hover:border-foreground/25 ${
        highlighted ? 'border-foreground/30 ring-2 ring-ring' : ''
      }`}
    >
      <div className="p-1">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-background">
          <img
            alt={`${card.name} preview`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
            src={card.img}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h2 className="text-base font-medium leading-snug tracking-[-0.01em] sm:text-[1.05rem]">
          <Link
            to={`/pro/docs/agent-kit/${KIND_PATH[card.kind] || 'skills'}/${card.slug}`}
            className="outline-none before:absolute before:inset-0 before:rounded-xl before:content-['']"
            title={`Open ${card.name}`}
          >
            {card.name}
          </Link>
        </h2>
        <p className="mb-5 mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {card.kind ? (
              <span className="inline-flex h-7 items-center rounded-sm border bg-muted/50 px-2.5 text-xs text-muted-foreground">
                {KIND_LABEL[card.kind] || card.kind}
              </span>
            ) : null}
            {card.tier ? (
              <span className="hidden sm:inline-flex h-7 items-center rounded-sm border bg-muted/50 px-2 text-xs text-muted-foreground">
                {card.tier}
              </span>
            ) : null}
          </div>
          <span className="inline-flex h-7 shrink-0 items-center rounded-sm border bg-muted/50 px-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            View
          </span>
        </div>
      </div>
    </li>
  );
}

export default function AgentKitPage() {
  const [params] = useSearchParams();
  const highlight = params.get('cat');
  const [filter, setFilter] = useState('All');
  useScrollToCard(highlight);

  const cards = useMemo(() => {
    const kind = FILTER_KIND[filter];
    return kind ? section.cards.filter(card => card.kind === kind) : section.cards;
  }, [filter]);

  return (
    <div className="pro-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{section.title}</h1>
        <p className="text-muted-foreground">{section.desc}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Chips label="Filter by kind" options={section.filters} value={filter} onChange={setFilter} />
        <p className="text-xs text-muted-foreground tabular-nums">
          Showing {cards.length} of {section.cards.length}
        </p>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(card => (
          <AgentKitCard key={card.slug} card={card} highlighted={card.slug === highlight} />
        ))}
      </ul>
    </div>
  );
}
